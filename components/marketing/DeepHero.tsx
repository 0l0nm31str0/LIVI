'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const TRUST = [
  '503A Compounding',
  'Board-Certified Physicians',
  'HIPAA Compliant',
  'Licensed in 50 States',
]

export function DeepHero() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 60])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, reduced ? 1 : 0])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.08])

  return (
    <div ref={ref} className="relative min-h-[100svh] overflow-hidden">
      {/* Photo hero background */}
      <motion.div style={{ scale: imgScale }} className="absolute inset-0 origin-center">
        <Image
          src="/images/assets/3.png"
          alt="LIVI — The Longevity Club"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex min-h-[100svh] flex-col justify-between px-6 pt-28 pb-12">
        <div className="mx-auto w-full max-w-6xl flex-1 flex items-center">
          <motion.div style={{ y: copyY, opacity: fade }} className="max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
              The Longevity Club
            </p>
            <h1 className="font-display text-[clamp(3rem,8vw,6rem)] font-bold leading-[0.94] tracking-[-0.03em] text-white">
              Own Your<br />
              <span className="text-orange-400">Longevity.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/75 text-pretty">
              Prescription treatments and wellness products, reviewed by licensed
              physicians and delivered to your door.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-orange-600"
              >
                Shop treatments
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                Sign in
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Trust bar */}
        <motion.div
          style={{ opacity: fade }}
          className="mx-auto w-full max-w-6xl border-t border-white/15 pt-6"
        >
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            {TRUST.map((label) => (
              <div key={label} className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                <span className="text-sm font-medium text-white/70">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
