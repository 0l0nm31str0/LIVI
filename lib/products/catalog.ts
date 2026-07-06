import type { ProductType } from '@/types'
export type { ProductType }

export type ProductCategory = 'longevity' | 'hormones' | 'mens-health' | 'weight-loss' | 'wellness'

export interface SubscriptionPlan {
  interval: 'month' | 'quarter' | 'semiannual' | 'annual'
  label: string
  priceCents: number
  stripePriceId?: string
  savingsLabel?: string
}

export interface Product {
  slug: string
  name: string
  shortName: string
  type: ProductType
  category: ProductCategory
  description: string
  longDescription: string
  image: string
  priceFromCents: number
  plans: SubscriptionPlan[]
  badge?: string
  highlights: string[]
  // Rx only
  belugaVisitType?: string
  belugaMedId?: string
  requiresIntake?: boolean
  // OTC only
  fulfillmentPartner?: 'mock' | 'otc_partner'
}

export const PRESCRIPTION_PRODUCTS: Product[] = [
  {
    slug: 'oxytocin',
    name: 'Oxytocin Longevity Shot',
    shortName: 'Oxytocin',
    type: 'prescription',
    category: 'longevity',
    description: 'Compounded oxytocin formulated for cellular longevity and stress resilience.',
    longDescription:
      'Oxytocin supports healthy aging pathways, enhancing cellular regeneration and emotional wellbeing. Prescribed and shipped directly to your door after clinical review.',
    image: '/images/assets/5.png',
    priceFromCents: 14900,
    plans: [
      { interval: 'month', label: 'Monthly', priceCents: 14900 },
      { interval: 'quarter', label: 'Quarterly', priceCents: 41700, savingsLabel: 'Save 7%' },
      { interval: 'semiannual', label: '6 Months', priceCents: 77400, savingsLabel: 'Save 13%' },
      { interval: 'annual', label: 'Annual', priceCents: 143000, savingsLabel: 'Save 20%' },
    ],
    highlights: ['503A compounded', 'Clinical review included', 'Free discreet shipping'],
    badge: 'Longevity',
    belugaVisitType: process.env.BELUGA_VISIT_TYPE ?? 'longevity',
    belugaMedId: process.env.BELUGA_MED_ID_OXYTOCIN ?? 'oxytocin-placeholder',
    requiresIntake: true,
  },
  {
    slug: 'sermorelin',
    name: 'Sermorelin Wellness Shot',
    shortName: 'Sermorelin',
    type: 'prescription',
    category: 'hormones',
    description: 'Growth hormone-releasing peptide to support energy, muscle, and metabolism.',
    longDescription:
      'Sermorelin stimulates the pituitary to release growth hormone naturally — supporting lean muscle preservation, energy levels, and metabolic function without synthetic HGH.',
    image: '/images/assets/8.png',
    priceFromCents: 17900,
    plans: [
      { interval: 'month', label: 'Monthly', priceCents: 17900 },
      { interval: 'quarter', label: 'Quarterly', priceCents: 50100, savingsLabel: 'Save 7%' },
      { interval: 'semiannual', label: '6 Months', priceCents: 93000, savingsLabel: 'Save 13%' },
      { interval: 'annual', label: 'Annual', priceCents: 172000, savingsLabel: 'Save 20%' },
    ],
    highlights: ['GHRH peptide therapy', 'Clinical supervision', 'Discreet delivery'],
    badge: 'Popular',
    belugaVisitType: process.env.BELUGA_VISIT_TYPE ?? 'hormones',
    belugaMedId: process.env.BELUGA_MED_ID_SERMORELIN ?? 'sermorelin-placeholder',
    requiresIntake: true,
  },
  {
    slug: 'sildenafil',
    name: 'Sildenafil',
    shortName: 'Sildenafil',
    type: 'prescription',
    category: 'mens-health',
    description: 'FDA-approved sildenafil for erectile dysfunction, prescribed online.',
    longDescription:
      'Prescription sildenafil (generic Viagra) reviewed by a licensed physician and shipped discreetly. Same active ingredient, fraction of the cost.',
    image: '/images/assets/18.png',
    priceFromCents: 4900,
    plans: [
      { interval: 'month', label: 'Monthly', priceCents: 4900 },
      { interval: 'quarter', label: 'Quarterly', priceCents: 13700, savingsLabel: 'Save 7%' },
      { interval: 'semiannual', label: '6 Months', priceCents: 25500, savingsLabel: 'Save 13%' },
      { interval: 'annual', label: 'Annual', priceCents: 47000, savingsLabel: 'Save 20%' },
    ],
    highlights: ["FDA-approved active ingredient", 'Online physician review', 'Plain packaging'],
    badge: "Men's Health",
    belugaVisitType: process.env.BELUGA_VISIT_TYPE ?? 'mens_health',
    belugaMedId: process.env.BELUGA_MED_ID_SILDENAFIL ?? 'sildenafil-placeholder',
    requiresIntake: true,
  },
  {
    slug: 'vardenafil-tadalafil',
    name: 'Vardenafil + Tadalafil',
    shortName: 'Vardenafil / Tadalafil',
    type: 'prescription',
    category: 'mens-health',
    description: 'Dual-action compounded formula for enhanced performance and duration.',
    longDescription:
      'A compounded blend of vardenafil and tadalafil offering faster onset with extended duration. Formulated by licensed pharmacists and reviewed by a LIVI physician.',
    image: '/images/assets/22.png',
    priceFromCents: 7900,
    plans: [
      { interval: 'month', label: 'Monthly', priceCents: 7900 },
      { interval: 'quarter', label: 'Quarterly', priceCents: 22200, savingsLabel: 'Save 7%' },
      { interval: 'semiannual', label: '6 Months', priceCents: 41100, savingsLabel: 'Save 13%' },
      { interval: 'annual', label: 'Annual', priceCents: 75800, savingsLabel: 'Save 20%' },
    ],
    highlights: ['Dual-action formula', '503A compounded', 'Discreet delivery'],
    belugaVisitType: process.env.BELUGA_VISIT_TYPE ?? 'mens_health',
    belugaMedId: process.env.BELUGA_MED_ID_VARDENAFIL ?? 'vardenafil-tadalafil-placeholder',
    requiresIntake: true,
  },
  {
    slug: 'semaglutide',
    name: 'Semaglutide GLP-1',
    shortName: 'Semaglutide',
    type: 'prescription',
    category: 'weight-loss',
    description: 'Compounded semaglutide (GLP-1) for sustainable weight management.',
    longDescription:
      'Compounded semaglutide mimics a natural hormone that regulates appetite and blood sugar — shown in trials to reduce body weight by 15%+ when combined with lifestyle changes.',
    image: '/images/assets/8.png',
    priceFromCents: 29900,
    plans: [
      { interval: 'month', label: 'Monthly', priceCents: 29900 },
      { interval: 'quarter', label: 'Quarterly', priceCents: 83700, savingsLabel: 'Save 7%' },
      { interval: 'semiannual', label: '6 Months', priceCents: 155000, savingsLabel: 'Save 13%' },
      { interval: 'annual', label: 'Annual', priceCents: 287000, savingsLabel: 'Save 20%' },
    ],
    highlights: ['GLP-1 receptor agonist', 'Physician-supervised', 'Weekly injection'],
    badge: 'Weight Loss',
    belugaVisitType: process.env.BELUGA_VISIT_TYPE ?? 'weight_loss',
    belugaMedId: process.env.BELUGA_MED_ID_SEMAGLUTIDE ?? 'semaglutide-placeholder',
    requiresIntake: true,
  },
]

export const OTC_PRODUCTS: Product[] = [
  {
    slug: 'nad-plus',
    name: 'NAD+',
    shortName: 'NAD+',
    type: 'otc',
    category: 'longevity',
    description: 'Nicotinamide adenine dinucleotide to fuel cellular energy and longevity.',
    longDescription:
      'NAD+ declines with age, affecting energy metabolism and DNA repair. Our pharmaceutical-grade NAD+ supplement supports mitochondrial function and healthy aging.',
    image: '/images/assets/34.png',
    priceFromCents: 6900,
    plans: [
      { interval: 'month', label: 'Monthly', priceCents: 6900 },
      { interval: 'quarter', label: 'Quarterly', priceCents: 19300, savingsLabel: 'Save 7%' },
      { interval: 'semiannual', label: '6 Months', priceCents: 35700, savingsLabel: 'Save 14%' },
      { interval: 'annual', label: 'Annual', priceCents: 66200, savingsLabel: 'Save 20%' },
    ],
    highlights: ['No prescription required', 'Pharmaceutical grade', 'Free shipping on subscriptions'],
    badge: 'Longevity',
    fulfillmentPartner: 'mock',
  },
  {
    slug: 'collagen-peptides',
    name: 'Collagen Peptides',
    shortName: 'Collagen',
    type: 'otc',
    category: 'wellness',
    description: 'Hydrolyzed type I & III collagen for skin, joints, and gut health.',
    longDescription:
      'Premium hydrolyzed collagen peptides sourced from grass-fed bovine. Unflavored, easily dissolved, with third-party purity testing.',
    image: '/images/assets/34.png',
    priceFromCents: 4900,
    plans: [
      { interval: 'month', label: 'Monthly', priceCents: 4900 },
      { interval: 'quarter', label: 'Quarterly', priceCents: 13700, savingsLabel: 'Save 7%' },
      { interval: 'semiannual', label: '6 Months', priceCents: 25500, savingsLabel: 'Save 13%' },
      { interval: 'annual', label: 'Annual', priceCents: 47000, savingsLabel: 'Save 20%' },
    ],
    highlights: ['No prescription required', 'Grass-fed bovine', 'Third-party tested'],
    fulfillmentPartner: 'mock',
  },
  {
    slug: 'magnesium-glycinate',
    name: 'Magnesium Glycinate',
    shortName: 'Magnesium',
    type: 'otc',
    category: 'wellness',
    description: 'Highly bioavailable magnesium for sleep, stress, and muscle recovery.',
    longDescription:
      'Magnesium glycinate is the most bioavailable form of magnesium — supporting deep sleep, cortisol regulation, muscle relaxation, and cardiovascular health.',
    image: '/images/assets/34.png',
    priceFromCents: 3900,
    plans: [
      { interval: 'month', label: 'Monthly', priceCents: 3900 },
      { interval: 'quarter', label: 'Quarterly', priceCents: 10900, savingsLabel: 'Save 7%' },
      { interval: 'semiannual', label: '6 Months', priceCents: 20300, savingsLabel: 'Save 13%' },
      { interval: 'annual', label: 'Annual', priceCents: 37400, savingsLabel: 'Save 20%' },
    ],
    highlights: ['No prescription required', 'High bioavailability', '200mg elemental per serving'],
    fulfillmentPartner: 'mock',
  },
]

export const ALL_PRODUCTS: Product[] = [...PRESCRIPTION_PRODUCTS, ...OTC_PRODUCTS]

export function getProductBySlug(slug: string): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.slug === slug)
}

export function getProductsByType(type: ProductType): Product[] {
  return ALL_PRODUCTS.filter((p) => p.type === type)
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return ALL_PRODUCTS.filter((p) => p.category === category)
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}
