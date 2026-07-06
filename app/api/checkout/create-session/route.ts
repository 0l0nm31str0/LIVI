import { NextRequest, NextResponse } from 'next/server'
import { getMarketplaceOrder, updateMarketplaceOrder } from '@/lib/marketplace/orders'
import { createCheckoutSession } from '@/lib/stripe/checkout'

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json()
    if (!orderId) {
      return NextResponse.json({ success: false, error: 'orderId required' }, { status: 400 })
    }

    const order = await getMarketplaceOrder(orderId)
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    const result = await createCheckoutSession(order)

    // In demo mode, immediately advance to paid
    if (result.demo) {
      await updateMarketplaceOrder(orderId, { status: 'paid' })
    } else if (result.sessionId) {
      await updateMarketplaceOrder(orderId, {
        stripe_checkout_session_id: result.sessionId,
        status: 'checkout_pending',
      })
    }

    return NextResponse.json({ success: true, data: result })
  } catch (e) {
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 })
  }
}
