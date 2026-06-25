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
  const { data: visit } = await db
    .from('visits')
    .select('id,beluga_master_id,patient_id')
    .eq('id', params.id)
    .single()

  if (!visit) return NextResponse.json(err('Visit not found'), { status: 404 })

  const { data, error } = await db
    .from('visit_messages')
    .select('*')
    .eq('visit_id', visit.id)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json(err(error.message), { status: 500 })
  return NextResponse.json(ok(data))
}

// POST /api/visits/[id]/messages — send patient chat via Beluga
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => null)
  if (!body?.message) return NextResponse.json(err('message is required'), { status: 400 })

  const db = getServerSupabase()
  const { data: visit } = await db
    .from('visits')
    .select('id,beluga_master_id,patient_id')
    .eq('id', params.id)
    .single()

  if (!visit) return NextResponse.json(err('Visit not found'), { status: 404 })

  const { data: patient } = await db
    .from('patient_profiles')
    .select('first_name,last_name')
    .eq('livi_user_id', visit.patient_id)
    .single()

  if (visit.beluga_master_id && patient) {
    try {
      await belugaMessaging.sendPatientChat({
        masterId: visit.beluga_master_id,
        firstName: patient.first_name,
        lastName: patient.last_name,
        content: body.message,
        isMedia: false,
      })
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
    })
    .select()
    .single()

  if (error) return NextResponse.json(err(error.message), { status: 500 })
  return NextResponse.json(ok(data), { status: 201 })
}
