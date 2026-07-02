'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { StaticShowcaseFallback } from '@/components/motion/static-fallbacks'
import { FluidCurrent } from '@/components/three/FluidCurrent'

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
    <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-deep lg:flex">
      <div className="absolute inset-0">
        <FluidCurrent className="absolute inset-0" intensity={0.55} />
      </div>

      <div className="relative flex flex-1 flex-col justify-between p-12">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-2xl font-semibold text-on-deep"
        >
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: 'linear-gradient(135deg, var(--current-bright), var(--current))' }}
            aria-hidden
          />
          LIVI
        </Link>

        <div>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-on-deep text-balance">
            {title}
          </h1>
          <p className="mt-4 max-w-sm leading-relaxed text-on-deep-muted">{description}</p>
          <div className="mt-8 max-w-sm">
            <LivingShowcase compact />
          </div>
        </div>

        <p className="text-xs text-on-deep-muted">
          {footer ?? 'HIPAA compliant · Licensed providers'}
        </p>
      </div>
    </div>
  )
}
