import { NextRequest, NextResponse } from 'next/server'
import { createMarketplaceOrder, listMarketplaceOrders } from '@/lib/marketplace/orders'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const patientId = searchParams.get('patient_id')
  if (!patientId) {
    return NextResponse.json({ success: false, error: 'patient_id required' }, { status: 400 })
  }
  try {
    const orders = await listMarketplaceOrders(patientId)
    return NextResponse.json({ success: true, data: orders })
  } catch (e) {
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const order = await createMarketplaceOrder({
      patient_id: body.patient_id ?? null,
      patient_email: body.patient_email ?? 'demo@livi.com',
      product_slug: body.product_slug,
      product_type: body.product_type,
      plan_interval: body.plan_interval ?? 'month',
      auto_renew: body.auto_renew ?? true,
      amount_cents: body.amount_cents,
      status: body.status ?? 'cart',
      shipping_address: body.shipping_address ?? {},
    })
    return NextResponse.json({ success: true, data: order }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 })
  }
}
