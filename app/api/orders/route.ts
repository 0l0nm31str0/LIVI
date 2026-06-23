import { NextRequest, NextResponse } from 'next/server'
import { ordersDb, prescriptionsDb } from '@/lib/mock-db'
import { compressData } from '@/lib/compression'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const patientId = searchParams.get('patient_id')
  const pharmacyId = searchParams.get('pharmacy_id')
  const useCompression = searchParams.get('compress') === 'true'

  let data
  if (patientId) data = ordersDb.byPatient(patientId)
  else if (pharmacyId) data = ordersDb.byPharmacy(pharmacyId)
  else data = ordersDb.getAll()

  const payload = { success: true, data }

  if (useCompression) {
    const jsonStr = JSON.stringify(payload)
    if (Buffer.byteLength(jsonStr, 'utf-8') > 1000) {
      const result = await compressData(payload)
      return NextResponse.json({
        success: true,
        data: result.compressed,
        meta: { compressed: true, compressionRatio: result.metadata.ratio },
      })
    }
  }

  return NextResponse.json(payload)
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const order = ordersDb.create({
    prescription_id: body.prescription_id,
    patient_id: body.patient_id,
    pharmacy_id: body.pharmacy_id,
    order_date: new Date().toISOString(),
    status: 'payment_confirmed',
    total_amount: body.total_amount ?? 19.99,
    shipping_address: body.shipping_address,
    tracking_number: null,
    payment_method: body.payment_method ?? 'credit_card',
    stripe_payment_id: body.payment_method === 'credit_card' ? `pi_mock_${Date.now()}` : null,
  })

  // Update prescription status to ordered
  prescriptionsDb.update(body.prescription_id, { status: 'ordered' })

  return NextResponse.json({ success: true, data: order }, { status: 201 })
}
