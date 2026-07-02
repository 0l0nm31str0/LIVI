// Prescription API route
// POST: Resend/update prescription via Beluga /external/updateVisit
//       RX_WRITTEN webhook then triggers Curexa order automatically.
import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { belugaRx, BelugaError } from '@/lib/beluga/client'
import { ok, err } from '@/lib/api-response'
import { compressData } from '@/lib/compression'

export async function GET(req: NextRequest) {
  const patientId = req.nextUrl.searchParams.get('patient_id')
  const useCompression = req.nextUrl.searchParams.get('compress') === 'true'

  const db = getServerSupabase()
  let query = db
    .from('visits')
    .select('id,prescription_data,status,patient_id,created_at,rx_written')
    .eq('rx_written', true)

  if (patientId) query = query.eq('patient_id', patientId)

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) return NextResponse.json(err(error.message), { status: 500 })

  const payload = ok(data)
  if (useCompression && Buffer.byteLength(JSON.stringify(payload), 'utf-8') > 1000) {
    const result = await compressData(payload)
    return NextResponse.json({
      success: true,
      data: result.compressed,
      meta: { compressed: true, compressionRatio: result.metadata.ratio },
    })
  }
  return NextResponse.json(payload)
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json(err('Invalid body'), { status: 400 })

  const {
    beluga_master_id,
    livi_visit_id,
    medication_name,
    ndc_code,
    dosage,
    quantity,
    refills,
    days_supply,
    med_id,
  } = body as {
    beluga_master_id: string
    livi_visit_id?: string
    medication_name: string
    ndc_code?: string
    dosage: string
    quantity: number
    refills: number
    days_supply: number
    med_id?: string
  }

  if (!beluga_master_id || !medication_name || !dosage) {
    return NextResponse.json(err('beluga_master_id, medication_name, and dosage are required'), { status: 400 })
  }

  try {
    const rx = await belugaRx.updateVisit({
      masterId: beluga_master_id,
      patientPreference: [
        {
          name: medication_name,
          strength: dosage,
          quantity: String(quantity),
          refills: String(refills),
          daysSupply: String(days_supply ?? 30),
          medId: med_id ?? ndc_code ?? process.env.BELUGA_DEFAULT_MED_ID ?? 'N/A',
        },
      ],
    })

    if (livi_visit_id) {
      const db = getServerSupabase()
      await db
        .from('visits')
        .update({
          rx_written: true,
          prescription_data: rx,
          status: 'prescribed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', livi_visit_id)
    }

    return NextResponse.json(ok(rx), { status: 201 })
  } catch (e) {
    if (e instanceof BelugaError) {
      return NextResponse.json(
        err(`Beluga error: ${e.message}`),
        { status: e.status >= 400 && e.status < 500 ? e.status : 502 }
      )
    }
    return NextResponse.json(err('Internal error'), { status: 500 })
  }
}
