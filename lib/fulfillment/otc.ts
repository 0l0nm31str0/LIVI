import { isDemoMode } from '@/lib/config'
import type { MarketplaceOrder } from '@/types'

export interface OtcFulfillmentResult {
  fulfillmentId: string
  status: 'processing' | 'shipped' | 'error'
  trackingNumber?: string
}

export async function createOtcFulfillment(
  order: MarketplaceOrder
): Promise<OtcFulfillmentResult> {
  if (isDemoMode()) {
    return {
      fulfillmentId: `mock-${order.id}`,
      status: 'processing',
    }
  }

  // PRODUCTION: wire OTC dropship partner when confirmed
  // const result = await otcPartnerClient.createOrder({
  //   sku: order.product_slug,
  //   quantity: 1,
  //   recipient: {
  //     name: `${order.shipping_address.firstName ?? ''} ${order.shipping_address.lastName ?? ''}`.trim(),
  //     address: order.shipping_address.line1,
  //     city: order.shipping_address.city,
  //     state: order.shipping_address.state,
  //     zip: order.shipping_address.zip,
  //   },
  //   email: order.patient_email,
  // })
  // return { fulfillmentId: result.id, status: 'processing', trackingNumber: result.tracking }

  throw new Error('OTC fulfillment partner not configured. Set DEMO_MODE=true for demo.')
}
