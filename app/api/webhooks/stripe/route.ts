import { NextRequest, NextResponse } from 'next/server'
import { isDemoMode } from '@/lib/config'
import { updateMarketplaceOrder } from '@/lib/marketplace/orders'

export async function POST(req: NextRequest) {
  if (isDemoMode()) {
    return NextResponse.json({ received: true })
  }

  const rawBody = await req.text()
  const sig = req.headers.get('stripe-signature') ?? ''
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    return NextResponse.json({ error: 'Stripe webhook secret not configured' }, { status: 500 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any

  try {
    const { getStripe } = await import('@/lib/stripe/client')
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: `Webhook error: ${msg}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const orderId = session.metadata?.orderId
        if (orderId) {
          await updateMarketplaceOrder(orderId, {
            status: 'paid',
            stripe_checkout_session_id: session.id,
          })

          const { getMarketplaceOrder } = await import('@/lib/marketplace/orders')
          const order = await getMarketplaceOrder(orderId)
          if (order?.product_type === 'prescription' && !order.beluga_master_id) {
            try {
              const { createBelugaVisitForOrder } = await import('@/lib/beluga/intake')
              const result = await createBelugaVisitForOrder(order)
              if (result) {
                await updateMarketplaceOrder(orderId, {
                  beluga_master_id: result.masterId,
                  visit_id: result.visitId,
                  status: 'under_review',
                })
              }
            } catch (e) {
              console.error('[stripe/webhook] Failed to create Beluga visit:', e)
            }
          }
        }
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object
        const subscriptionId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription?.id
        if (subscriptionId) {
          console.log('[stripe/webhook] Invoice paid for subscription:', subscriptionId)
        }
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object
        console.log('[stripe/webhook] Subscription event:', event.type, sub.id, sub.status)
        break
      }
    }
  } catch (e) {
    console.error('[stripe/webhook] Handler error:', e)
  }

  return NextResponse.json({ received: true })
}
