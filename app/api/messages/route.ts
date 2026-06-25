// Unified messaging: patient sends to doctor (Beluga) or pharmacy (Curexa)
import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { belugaMessaging } from '@/lib/beluga/client'
import { curexaMessaging } from '@/lib/curexa/client'
import { ok, err } from '@/lib/api-response'

// POST /api/messages
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json(err('Invalid body'), { status: 400 })

  const { visit_id, message, recipient, patient_name } = body as {
    visit_id: string
    message: string
    recipient: 'doctor' | 'pharmacy'
    patient_name?: string
  }

  if (!visit_id || !message || !recipient) {
    return NextResponse.json(err('visit_id, message, and recipient are required'), { status: 400 })
  }

  const db = getServerSupabase()
  const { data: visit } = await db
    .from('visits')
    .select('id,beluga_visit_id,curexa_order_id')
    .eq('id', visit_id)
    .single()

  if (!visit) return NextResponse.json(err('Visit not found'), { status: 404 })

  let externalId: string | null = null

  if (recipient === 'doctor' && visit.beluga_visit_id) {
    try {
      const m = await belugaMessaging.send(visit.beluga_visit_id, message, 'patient')
      externalId = m.id
    } catch (e) {
      console.warn('Beluga message failed:', e)
    }
  } else if (recipient === 'pharmacy' && visit.curexa_order_id) {
    try {
      const m = await curexaMessaging.send(visit.curexa_order_id, message, 'patient')
      externalId = m.message_id
    } catch (e) {
      console.warn('Curexa message failed:', e)
    }
  }

  const { data, error } = await db.from('visit_messages').insert({
    visit_id: visit.id,
    sender_name: patient_name ?? 'Patient',
    sender_type: 'patient',
    message,
    source: recipient === 'doctor' ? 'beluga' : 'curexa',
    external_id: externalId,
  }).select().single()

  if (error) return NextResponse.json(err(error.message), { status: 500 })
  return NextResponse.json(ok(data), { status: 201 })
}
