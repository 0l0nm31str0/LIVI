'use client'

import Image from 'next/image'
import Link from 'next/link'

interface AuthBrandPanelProps {
  title: string
  description: string
  footer?: string
}

export function AuthBrandPanel({ title, description, footer }: AuthBrandPanelProps) {
  return (
    <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-stone-900 lg:flex">
      {/* Hero photo */}
      <div className="absolute inset-0">
        <Image
          src="/images/assets/5_1.png"
          alt="LIVI Longevity"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      <div className="relative flex flex-1 flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/assets/Transparent-03.png"
            alt="LIVI"
            width={72}
            height={28}
            className="h-7 w-auto object-contain"
          />
        </Link>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
            The Longevity Club
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white text-balance">
            {title}
          </h1>
          <p className="mt-4 max-w-sm leading-relaxed text-white/70">{description}</p>
        </div>

        <p className="text-xs text-white/50">
          {footer ?? '503A Compounding · HIPAA Compliant · Licensed Physicians'}
        </p>
      </div>
    </div>
  )
}
