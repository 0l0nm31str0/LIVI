import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { belugaVisits, BelugaError } from '@/lib/beluga/client'
import { ok, err } from '@/lib/api-response'

// GET /api/visits?patient_id=xxx&status=active
export async function GET(req: NextRequest) {
  const patientId = req.nextUrl.searchParams.get('patient_id')
  const status    = req.nextUrl.searchParams.get('status')

  const db = getServerSupabase()
  let query = db.from('visits').select('*').order('created_at', { ascending: false })

  if (patientId) query = query.eq('patient_id', patientId)
  if (status)    query = query.eq('status', status)

  const { data, error } = await query
  if (error) return NextResponse.json(err(error.message), { status: 500 })
  return NextResponse.json(ok(data))
}

// POST /api/visits — creates Beluga visit (masterId flow) and saves to Supabase
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json(err('Invalid JSON'), { status: 400 })

  const {
    patient_id,
    patient_email,
    visit_type = 'async',
    chief_complaint,
    questionnaire = {},
    profile,
  } = body as {
    patient_id: string
    patient_email: string
    visit_type?: string
    chief_complaint?: string
    questionnaire?: Record<string, unknown>
    profile: {
      first_name: string
      last_name: string
      date_of_birth: string
      phone: string
      gender: string
      address_line1: string
      city: string
      state: string
      zip: string
    }
  }

  if (!patient_id || !patient_email || !profile) {
    return NextResponse.json(err('patient_id, patient_email, and profile are required'), { status: 400 })
  }

  const db = getServerSupabase()

  await db.from('patient_profiles').upsert(
    {
      livi_user_id: patient_id,
      email: patient_email,
      first_name: profile.first_name,
      last_name: profile.last_name,
      date_of_birth: profile.date_of_birth,
      phone: profile.phone,
      gender: profile.gender,
      address_line1: profile.address_line1,
      city: profile.city,
      state: profile.state,
      zip: profile.zip,
    },
    { onConflict: 'livi_user_id' }
  )

  let belugaMasterId: string | null = null
  let belugaVisitId: string | null = null
  let belugaError: string | null = null

  try {
    const result = await belugaVisits.create({
      patient_email,
      chief_complaint,
      questionnaire,
      profile,
      visitType: mapVisitType(visit_type, questionnaire),
    })
    belugaMasterId = result.masterId
    belugaVisitId = result.visitId
  } catch (e) {
    if (e instanceof BelugaError) {
      belugaError = e.message
      console.error('Beluga visit creation error:', e.message)
    } else {
      belugaError = e instanceof Error ? e.message : String(e)
      console.error('Unexpected Beluga error:', e)
    }
  }

  const { data: visit, error: dbErr } = await db
    .from('visits')
    .insert({
      patient_id,
      patient_email,
      beluga_master_id: belugaMasterId,
      beluga_visit_id: belugaVisitId,
      status: belugaMasterId ? 'submitted' : 'draft',
      visit_type,
      chief_complaint,
      questionnaire,
    })
    .select()
    .single()

  if (dbErr) return NextResponse.json(err(dbErr.message), { status: 500 })

  if (belugaError && !belugaMasterId) {
    return NextResponse.json(
      err(`Visit saved locally but Beluga submission failed: ${belugaError}`),
      { status: 502 }
    )
  }

  return NextResponse.json(ok(visit), { status: 201 })
}

function mapVisitType(visitType: string, questionnaire: Record<string, unknown>): string {
  const fromEnv = process.env.BELUGA_VISIT_TYPE
  if (fromEnv) return fromEnv
  const vertical = String(questionnaire.vertical ?? questionnaire.visit_type ?? '').toLowerCase()
  if (vertical.includes('weight')) return 'weightloss'
  if (vertical.includes('ed')) return 'ED'
  if (vertical.includes('hair')) return 'hairloss'
  return visitType === 'sync' ? 'weightloss' : 'weightloss'
}
