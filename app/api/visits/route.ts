import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { belugaPatients, belugaVisits, BelugaError } from '@/lib/beluga/client'
import { ok, err } from '@/lib/api-response'

// GET /api/visits?patient_id=xxx
export async function GET(req: NextRequest) {
  const patientId = req.nextUrl.searchParams.get('patient_id')
  if (!patientId) return NextResponse.json(err('patient_id is required'), { status: 400 })

  const db = getServerSupabase()
  const { data, error } = await db
    .from('visits')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json(err(error.message), { status: 500 })
  return NextResponse.json(ok(data))
}

// POST /api/visits
// Creates (or retrieves) a Beluga patient, then creates a Beluga visit.
// Saves everything to Supabase.
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

  // Upsert patient profile in Supabase
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

  // Get or create Beluga patient
  let belugaPatientId: string | null = null
  try {
    const { data: existing } = await db
      .from('patient_profiles')
      .select('beluga_patient_id')
      .eq('livi_user_id', patient_id)
      .single()

    if (existing?.beluga_patient_id) {
      belugaPatientId = existing.beluga_patient_id
    } else {
      const belugaPt = await belugaPatients.create({
        external_id: patient_id,
        email: patient_email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        date_of_birth: profile.date_of_birth,
        phone: profile.phone,
        gender: profile.gender,
        address: {
          line1: profile.address_line1,
          city: profile.city,
          state: profile.state,
          zip: profile.zip,
        },
      })
      belugaPatientId = belugaPt.id
      await db
        .from('patient_profiles')
        .update({ beluga_patient_id: belugaPatientId })
        .eq('livi_user_id', patient_id)
    }
  } catch (e) {
    if (e instanceof BelugaError) {
      console.error('Beluga patient error:', e.message)
    } else {
      console.error('Unexpected error creating Beluga patient:', e)
    }
  }

  // Create Beluga visit
  let belugaVisitId: string | null = null
  let zoomLink: string | null = null

  if (belugaPatientId) {
    try {
      const bv = await belugaVisits.create({
        patient_id: belugaPatientId,
        visit_type,
        questionnaire: { chief_complaint, ...questionnaire },
      })
      belugaVisitId = bv.id
      zoomLink = bv.zoom_link
    } catch (e) {
      console.error('Beluga visit creation error:', e)
    }
  }

  // Save visit to Supabase
  const { data: visit, error: dbErr } = await db
    .from('visits')
    .insert({
      patient_id,
      patient_email,
      beluga_visit_id: belugaVisitId,
      beluga_patient_id: belugaPatientId,
      status: belugaVisitId ? 'submitted' : 'draft',
      visit_type,
      chief_complaint,
      questionnaire,
      zoom_link: zoomLink,
    })
    .select()
    .single()

  if (dbErr) return NextResponse.json(err(dbErr.message), { status: 500 })
  return NextResponse.json(ok(visit), { status: 201 })
}
