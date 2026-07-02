'use client'

import { useRef } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform } from 'motion/react'
import { CheckCircle2, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tilt3D } from '@/components/motion/Tilt3D'
import { StaticShowcaseFallback } from '@/components/motion/static-fallbacks'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const LivingShowcase = dynamic(
  () => import('@/components/motion/LivingShowcase').then((m) => m.LivingShowcase),
  { ssr: false, loading: () => <StaticShowcaseFallback /> }
)

const HEADLINE = 'Care that flows to you.'

const trust = ['HIPAA compliant', 'Licensed physicians', 'Pharmacy network', 'Board-certified care']

export function DeepHero() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Depth on scroll: copy recedes slower than the showcase — parallax planes.
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 60])
  const cardY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 140])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, reduced ? 1 : 0])

  const words = HEADLINE.split(' ')

  return (
    <div ref={ref} className="relative flex min-h-[100svh] flex-col px-6 pt-28 md:pt-32">
      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <motion.div style={{ y: copyY, opacity: fade }}>
          <p className="mb-5 text-sm font-medium text-current-bright">
            Telemedicine &amp; pharmacy, one current
          </p>
          <h1 className="font-display text-[clamp(2.9rem,7vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-on-deep">
            {reduced ? (
              HEADLINE
            ) : (
              words.map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  className="mr-[0.24em] inline-block"
                  initial={{ opacity: 0, y: 28, rotateX: -35 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.12 + i * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  {word}
                </motion.span>
              ))
            )}
          </h1>
          <motion.p
            className="mt-7 max-w-md text-lg leading-relaxed text-on-deep-muted text-pretty"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            See a licensed physician, get your prescription, and track it to your
            door — one connected journey, no waiting rooms.
          </motion.p>
          <motion.div
            className="mt-9 flex flex-wrap gap-3"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/signup">
              <Button size="lg" className="h-12 px-7 text-base">
                Start your visit
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="secondary"
                size="lg"
                className="h-12 border border-white/15 bg-white/[0.07] px-7 text-base text-on-deep hover:bg-white/15"
              >
                Sign in
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: cardY }} className="relative hidden justify-center lg:flex">
          <Tilt3D max={8} className="relative">
            <div style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}>
              <LivingShowcase className="deep-card w-[26rem] max-w-full" />
              {/* Depth satellites — closer planes drift more with the tilt */}
              <div
                className="deep-card absolute -left-14 -top-7 flex items-center gap-2 rounded-full px-4 py-2 text-sm text-on-deep"
                style={{ transform: 'translateZ(70px)' }}
              >
                <CheckCircle2 className="h-4 w-4 text-current-bright" strokeWidth={2} />
                Rx approved
              </div>
              <div
                className="deep-card absolute -bottom-6 -right-8 flex items-center gap-2 rounded-full px-4 py-2 text-sm text-on-deep"
                style={{ transform: 'translateZ(55px)' }}
              >
                <Package className="h-4 w-4 text-ember" strokeWidth={2} />
                Arrives Thursday
              </div>
            </div>
          </Tilt3D>
        </motion.div>
      </div>

      <div className="mx-auto mt-16 w-full max-w-6xl border-t border-white/10 pb-8 pt-6">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 lg:justify-between">
          {trust.map((label) => (
            <span key={label} className="text-sm font-medium text-on-deep-muted">
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
