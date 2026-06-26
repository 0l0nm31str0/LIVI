'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { StaticShowcaseFallback } from '@/components/motion/static-fallbacks'

const LivingShowcase = dynamic(
  () => import('@/components/motion/LivingShowcase').then((m) => m.LivingShowcase),
  { loading: () => <StaticShowcaseFallback />, ssr: false }
)

interface AuthBrandPanelProps {
  title: string
  description: string
  footer?: string
}

export function AuthBrandPanel({ title, description, footer }: AuthBrandPanelProps) {
  return (
    <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-ink lg:flex">
      <div className="absolute inset-0">
        <Image
          src="/images/marketing/hero-care.svg"
          alt=""
          fill
          className="object-cover photo-ken-burns opacity-40"
          priority
          unoptimized
        />
        <div className="photo-overlay absolute inset-0" aria-hidden />
      </div>

      <div className="relative flex flex-1 flex-col justify-between p-12">
        <Link href="/" className="font-display text-2xl font-semibold text-on-ink">
          LIVI
        </Link>

        <div>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-on-ink text-balance">
            {title}
          </h1>
          <p className="mt-4 max-w-sm leading-relaxed text-on-ink-muted">{description}</p>
          <div className="mt-8 max-w-sm">
            <LivingShowcase compact />
          </div>
        </div>

        <p className="text-xs text-on-ink-muted">
          {footer ?? 'HIPAA compliant · Licensed providers'}
        </p>
      </div>
    </div>
  )
}
