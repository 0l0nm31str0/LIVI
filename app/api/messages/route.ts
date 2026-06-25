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
    .select('id,beluga_master_id,curexa_order_id,patient_id,patient_email')
    .eq('id', visit_id)
    .single()

  if (!visit) return NextResponse.json(err('Visit not found'), { status: 404 })

  if (recipient === 'doctor' && visit.beluga_master_id) {
    const { data: patient } = await db
      .from('patient_profiles')
      .select('first_name,last_name')
      .eq('livi_user_id', visit.patient_id)
      .single()

    if (patient) {
      try {
        await belugaMessaging.sendPatientChat({
          masterId: visit.beluga_master_id,
          firstName: patient.first_name,
          lastName: patient.last_name,
          content: message,
        })
      } catch (e) {
        console.warn('Beluga message failed:', e)
      }
    }
  } else if (recipient === 'pharmacy' && visit.curexa_order_id) {
    try {
      await curexaMessaging.send(visit.curexa_order_id, message, visit.patient_email)
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
  }).select().single()

  if (error) return NextResponse.json(err(error.message), { status: 500 })
  return NextResponse.json(ok(data), { status: 201 })
}
