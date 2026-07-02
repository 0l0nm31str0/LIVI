'use client'

// The four-step care journey as a scroll-linked timeline.
// A "current line" grows down the rail as you scroll; each step surfaces
// as it enters the viewport. This is a genuine sequence, so the numbers
// carry information — intake happens before review, review before Rx.

import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { Stethoscope, Calendar, FileText, Package, type LucideIcon } from 'lucide-react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface JourneyStep {
  icon: LucideIcon
  title: string
  description: string
  detail: string
}

const steps: JourneyStep[] = [
  {
    icon: Stethoscope,
    title: 'Tell us how you feel',
    description:
      'A short clinical questionnaire, built for your treatment area. No waiting rooms, no phone trees.',
    detail: 'Takes about 5 minutes',
  },
  {
    icon: Calendar,
    title: 'A physician reviews your case',
    description:
      'A licensed doctor evaluates your intake and consults by video or secure messaging.',
    detail: 'Usually within hours',
  },
  {
    icon: FileText,
    title: 'Your prescription is issued',
    description:
      'If treatment is appropriate, your Rx is written digitally and routed straight to the pharmacy.',
    detail: 'No paper, no pickup line',
  },
  {
    icon: Package,
    title: 'Delivered to your door',
    description:
      'Track fulfillment and shipping in your portal — from the pharmacy shelf to your doorstep.',
    detail: 'Discreet packaging, tracked',
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
            From symptom to doorstep.
          </h2>
          <p className="mt-5 max-w-sm text-lg leading-relaxed text-on-deep-muted">
            One flow carries your visit, your prescription, and your delivery.
            You never have to chase a status again.
          </p>
        </div>

        <div ref={railRef} className="relative">
          {/* Rail + scroll-grown current */}
          <div className="absolute bottom-6 left-[1.4rem] top-6 w-px bg-white/10" aria-hidden />
          <motion.div
            className="absolute bottom-6 left-[1.4rem] top-6 w-px origin-top"
            style={{
              scaleY: reduced ? 1 : lineScale,
              background: 'linear-gradient(to bottom, var(--current-bright), var(--current))',
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
                <div className="deep-card absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-xl">
                  <step.icon className="h-5 w-5 text-current-bright" strokeWidth={1.75} />
                </div>
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <span className="font-display text-sm font-semibold text-current-bright">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-on-deep">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-3 max-w-md leading-relaxed text-on-deep-muted">
                  {step.description}
                </p>
                <p className="mt-2 text-sm font-medium text-ember">{step.detail}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
