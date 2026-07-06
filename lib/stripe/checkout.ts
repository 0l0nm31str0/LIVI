import { isDemoMode } from '@/lib/config'
import type { MarketplaceOrder } from '@/types'
import { getProductBySlug } from '@/lib/products/catalog'

export interface CheckoutResult {
  url: string
  sessionId?: string
  demo?: boolean
}

export async function createCheckoutSession(order: MarketplaceOrder): Promise<CheckoutResult> {
  if (isDemoMode()) {
    // Return a mock success URL in demo mode
    return {
      url: `/checkout/success?orderId=${order.id}&demo=true`,
      demo: true,
    }
  }

  const { getStripe } = await import('@/lib/stripe/client')
  const stripe = getStripe()

  const product = getProductBySlug(order.product_slug)
  const plan = product?.plans.find((p) => p.interval === order.plan_interval)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  if (plan?.stripePriceId) {
    // Use synced Stripe Price ID
    const session = await stripe.checkout.sessions.create({
      mode: order.auto_renew ? 'subscription' : 'payment',
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&orderId=${order.id}`,
      cancel_url: `${appUrl}/shop`,
      customer_email: order.patient_email,
      metadata: { orderId: order.id, product_slug: order.product_slug },
    })
    return { url: session.url!, sessionId: session.id }
  }

  // Ad-hoc price (catalog not yet synced to Stripe)
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: order.amount_cents,
          product_data: {
            name: product?.name ?? order.product_slug,
            description: `${order.plan_interval} subscription`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&orderId=${order.id}`,
    cancel_url: `${appUrl}/shop`,
    customer_email: order.patient_email,
    metadata: { orderId: order.id, product_slug: order.product_slug },
  })

  return { url: session.url!, sessionId: session.id }
}
