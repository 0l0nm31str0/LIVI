'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { StaticShowcaseFallback } from '@/components/motion/static-fallbacks'

const KineticHero = dynamic(
  () => import('@/components/motion/KineticHero').then((m) => m.KineticHero),
  { ssr: false }
)

const LivingShowcase = dynamic(
  () => import('@/components/motion/LivingShowcase').then((m) => m.LivingShowcase),
  { ssr: false, loading: () => <StaticShowcaseFallback /> }
)

export function LandingHero() {
  return (
    <KineticHero
      eyebrow="Telemedicine & pharmacy"
      headline="Healthcare that moves at your pace."
      subhead="LIVI connects you with licensed physicians, digital prescriptions, and pharmacy delivery — without the friction."
      showcase={<LivingShowcase />}
    >
      <div className="flex flex-wrap gap-3">
        <Link href="/login">
          <Button size="lg">Book a visit</Button>
        </Link>
        <Link href="/login">
          <Button
            variant="secondary"
            size="lg"
            className="border-white/20 bg-white/10 text-on-ink hover:bg-white/20"
          >
            Sign in
          </Button>
        </Link>
      </div>
    </KineticHero>
  )
}
