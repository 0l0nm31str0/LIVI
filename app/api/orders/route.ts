import { NextRequest, NextResponse } from 'next/server'
import { ordersDb, prescriptionsDb } from '@/lib/mock-db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const patientId = searchParams.get('patient_id')
  const pharmacyId = searchParams.get('pharmacy_id')

  let data
  if (patientId) data = ordersDb.byPatient(patientId)
  else if (pharmacyId) data = ordersDb.byPharmacy(pharmacyId)
  else data = ordersDb.getAll()

  return NextResponse.json({ success: true, data })
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

  prescriptionsDb.update(body.prescription_id, { status: 'ordered' })

  return NextResponse.json({ success: true, data: order }, { status: 201 })
}
