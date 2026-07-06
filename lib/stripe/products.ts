// Script-ready Stripe product/price sync utility.
// Run manually: npx ts-node lib/stripe/products.ts
// Not executed in demo mode or during normal app lifecycle.

import { ALL_PRODUCTS } from '@/lib/products/catalog'

export async function syncCatalogToStripe() {
  const { getStripe } = await import('@/lib/stripe/client')
  const stripe = getStripe()

  for (const product of ALL_PRODUCTS) {
    // Create or update Stripe product
    const stripeProduct = await stripe.products.create({
      name: product.name,
      description: product.description,
      metadata: { slug: product.slug, type: product.type },
    })

    for (const plan of product.plans) {
      const price = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: plan.priceCents,
        currency: 'usd',
        recurring: { interval: plan.interval === 'month' ? 'month' : 'year' },
        metadata: { slug: product.slug, interval: plan.interval },
      })
      console.log(`Created price ${price.id} for ${product.slug} / ${plan.interval}`)
      // TODO: write price.id back to catalog or .env
    }
  }
}
