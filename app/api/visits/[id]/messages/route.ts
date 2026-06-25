import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { belugaMessaging } from '@/lib/beluga/client'
import { ok, err } from '@/lib/api-response'

// GET /api/visits/[id]/messages
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = getServerSupabase()

  // Get LIVI visit to find Beluga visit ID
  const { data: visit } = await db.from('visits').select('id,beluga_visit_id,curexa_order_id').eq('id', params.id).single()
  if (!visit) return NextResponse.json(err('Visit not found'), { status: 404 })

  // Fetch Beluga messages and sync to DB
  if (visit.beluga_visit_id) {
    try {
      const { messages } = await belugaMessaging.list(visit.beluga_visit_id)
      for (const m of messages) {
        await db.from('visit_messages').upsert(
          {
            visit_id: visit.id,
            sender_id: m.sender_id,
            sender_name: m.sender_type === 'doctor' ? 'Doctor' : m.sender_type === 'system' ? 'LIVI' : 'Patient',
            sender_type: m.sender_type,
            message: m.message,
            source: 'beluga',
            external_id: m.id,
            created_at: m.created_at,
          },
          { onConflict: 'external_id' }
        )
      }
    } catch (e) {
      console.warn('Could not sync Beluga messages:', e)
    }
  }

  // Return all messages from DB
  const { data, error } = await db
    .from('visit_messages')
    .select('*')
    .eq('visit_id', visit.id)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json(err(error.message), { status: 500 })
  return NextResponse.json(ok(data))
}

// POST /api/visits/[id]/messages
// Sends a patient message via Beluga.
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => null)
  if (!body?.message) return NextResponse.json(err('message is required'), { status: 400 })

  const db = getServerSupabase()
  const { data: visit } = await db.from('visits').select('id,beluga_visit_id').eq('id', params.id).single()
  if (!visit) return NextResponse.json(err('Visit not found'), { status: 404 })

  let externalId: string | null = null

  if (visit.beluga_visit_id) {
    try {
      const m = await belugaMessaging.send(visit.beluga_visit_id, body.message, 'patient')
      externalId = m.id
    } catch (e) {
      console.warn('Beluga send failed, saving locally only:', e)
    }
  }

  const { data, error } = await db
    .from('visit_messages')
    .insert({
      visit_id: visit.id,
      sender_id: body.patient_id ?? null,
      sender_name: body.patient_name ?? 'Patient',
      sender_type: 'patient',
      message: body.message,
      source: 'beluga',
      external_id: externalId,
    })
    .select()
    .single()

  if (error) return NextResponse.json(err(error.message), { status: 500 })
  return NextResponse.json(ok(data), { status: 201 })
}
