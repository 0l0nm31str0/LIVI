import { NextRequest, NextResponse } from 'next/server'
import { getMarketplaceOrder, updateMarketplaceOrder } from '@/lib/marketplace/orders'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = await getMarketplaceOrder(params.id)
    if (!order) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: order })
  } catch (e) {
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const order = await updateMarketplaceOrder(params.id, body)
    if (!order) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: order })
  } catch (e) {
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 })
  }
}
