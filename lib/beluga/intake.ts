import type { MarketplaceOrder } from '@/types'
import { getProductBySlug } from '@/lib/products/catalog'

/**
 * Build the Beluga intake embed URL for a given masterId.
 * Used in production when BELUGA_INTAKE_EMBED_URL is set.
 */
export function buildIntakeEmbedUrl(masterId: string): string {
  const base = process.env.BELUGA_INTAKE_EMBED_URL
  if (!base) throw new Error('BELUGA_INTAKE_EMBED_URL is not configured')
  return `${base}?masterId=${encodeURIComponent(masterId)}`
}

/**
 * Create a Beluga visit for a new Rx marketplace order.
 * Returns masterId + visitId to store on the marketplace order.
 * Only demographics from shipping address are sent — PHI is collected in Beluga's embed.
 */
export async function createBelugaVisitForOrder(
  order: MarketplaceOrder
): Promise<{ masterId: string; visitId: string }> {
  const { belugaVisits } = await import('@/lib/beluga/client')
  const product = getProductBySlug(order.product_slug)

  const visitType = product?.belugaVisitType ?? process.env.BELUGA_VISIT_TYPE ?? 'longevity'
  const medId = product?.belugaMedId ?? process.env.BELUGA_DEFAULT_MED_ID ?? ''
  const address = order.shipping_address ?? {}

  const visit = await belugaVisits.create({
    patient_email: order.patient_email,
    chief_complaint: `Marketplace order: ${order.product_slug}`,
    profile: {
      first_name: order.patient_first_name ?? 'Patient',
      last_name: order.patient_last_name ?? '',
      date_of_birth: '',
      phone: '',
      gender: 'U',
      address_line1: address.line1 ?? '',
      city: address.city ?? '',
      state: address.state ?? '',
      zip: address.zip ?? '',
    },
    questionnaire: {
      livi_order_id: order.id,
      livi_product_slug: order.product_slug,
      medication_preference: medId,
    },
    visitType,
  })

  return {
    masterId: visit.masterId,
    visitId: visit.visitId ?? visit.masterId,
  }
}
