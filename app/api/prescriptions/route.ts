// Prescription API route
// POST: Writes a prescription through Beluga Health.
//       The RX_WRITTEN webhook then triggers a Curexa order automatically.
import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { belugaRx, BelugaError } from '@/lib/beluga/client'
import { ok, err } from '@/lib/api-response'
import { medicationsDb } from '@/lib/mock-db'

// GET /api/prescriptions?patient_id=... or ?doctor_id=...
export async function GET(req: NextRequest) {
  const patientId = req.nextUrl.searchParams.get('patient_id')
  const doctorId  = req.nextUrl.searchParams.get('doctor_id')

  const db = getServerSupabase()
  let query = db.from('visits').select('id,prescription_data,status,patient_id,created_at,rx_written').eq('rx_written', true)

  if (patientId) query = query.eq('patient_id', patientId)
  // doctor filtering not yet supported — would need to store doctor_id on visit

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) return NextResponse.json(err(error.message), { status: 500 })
  return NextResponse.json(ok(data))
}

// POST /api/prescriptions
// Sends Rx to Beluga; the webhook fires and creates the Curexa order.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json(err('Invalid body'), { status: 400 })

  const {
    beluga_visit_id,
    livi_visit_id,
    medication_name,
    ndc_code,
    dosage,
    quantity,
    refills,
    days_supply,
    special_instructions,
  } = body as {
    beluga_visit_id: string
    livi_visit_id: string
    medication_name: string
    ndc_code?: string
    dosage: string
    quantity: number
    refills: number
    days_supply: number
    special_instructions?: string
  }

  if (!beluga_visit_id || !medication_name || !dosage) {
    return NextResponse.json(err('beluga_visit_id, medication_name, and dosage are required'), { status: 400 })
  }

  try {
    const rx = await belugaRx.write(beluga_visit_id, {
      medication_name,
      ndc_code,
      dosage,
      quantity,
      refills,
      days_supply: days_supply ?? 30,
      special_instructions,
    })

    // Optimistically update the LIVI visit; webhook will confirm
    if (livi_visit_id) {
      const db = getServerSupabase()
      await db.from('visits').update({
        rx_written: true,
        prescription_data: rx,
        status: 'prescribed',
      }).eq('id', livi_visit_id)
    }

    return NextResponse.json(ok(rx), { status: 201 })
  } catch (e) {
    if (e instanceof BelugaError) {
      return NextResponse.json(err(`Beluga error: ${e.message}`), { status: e.status >= 400 && e.status < 500 ? e.status : 502 })
    }
    return NextResponse.json(err('Internal error'), { status: 500 })
  }
}
