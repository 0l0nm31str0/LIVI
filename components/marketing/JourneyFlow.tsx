'use client'

import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { ShoppingBag, ClipboardList, CreditCard, CheckCircle2, Package, type LucideIcon } from 'lucide-react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface JourneyStep {
  icon: LucideIcon
  title: string
  description: string
  detail: string
}

const steps: JourneyStep[] = [
  {
    icon: ShoppingBag,
    title: 'Choose your treatment',
    description:
      'Browse prescription and OTC products. Select a subscription plan that works for you.',
    detail: 'No appointment needed',
  },
  {
    icon: ClipboardList,
    title: 'Complete your intake',
    description:
      'A short, HIPAA-compliant medical questionnaire reviewed by a board-certified physician.',
    detail: 'Takes under 5 minutes',
  },
  {
    icon: CreditCard,
    title: 'Checkout securely',
    description:
      'Pay only after physician approval. Subscriptions auto-renew and can be cancelled anytime.',
    detail: 'Stripe-secured payments',
  },
  {
    icon: CheckCircle2,
    title: 'Physician review',
    description:
      'A licensed doctor evaluates your intake and approves your prescription within 24 hours.',
    detail: 'Usually within hours',
  },
  {
    icon: Package,
    title: 'Delivered to your door',
    description:
      'Your treatment ships from a 503A-accredited pharmacy in discreet packaging, tracked end-to-end.',
    detail: 'Discreet, tracked delivery',
  },
]

export function JourneyFlow() {
  const railRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start 0.7', 'end 0.55'],
  })
  const grow = useSpring(scrollYProgress, { stiffness: 90, damping: 25 })
  const lineScale = useTransform(grow, [0, 1], [0, 1])

  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-on-deep md:text-5xl">
            From browse to doorstep.
          </h2>
          <p className="mt-5 max-w-sm text-lg leading-relaxed text-on-deep-muted">
            Select a treatment, complete intake, pay after approval — and your
            prescription arrives at your door.
          </p>
        </div>

        <div ref={railRef} className="relative">
          <div className="absolute bottom-6 left-[1.4rem] top-6 w-px bg-white/10" aria-hidden />
          <motion.div
            className="absolute bottom-6 left-[1.4rem] top-6 w-px origin-top"
            style={{
              scaleY: reduced ? 1 : lineScale,
              background: 'linear-gradient(to bottom, #F97316, #EA580C)',
            }}
            aria-hidden
          />

          <ol className="space-y-14">
            {steps.map((step, i) => (
              <motion.li
                key={step.title}
                className="relative pl-16"
                initial={reduced ? false : { opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -12% 0px' }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className="absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)' }}
                >
                  <step.icon className="h-5 w-5 text-orange-400" strokeWidth={1.75} />
                </div>
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <span className="font-display text-sm font-semibold text-orange-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-on-deep">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-3 max-w-md leading-relaxed text-on-deep-muted">
                  {step.description}
                </p>
                <p className="mt-2 text-sm font-medium text-orange-400">{step.detail}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
