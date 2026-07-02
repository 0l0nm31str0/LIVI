'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, animate } from 'motion/react'
import { Calendar, FileText, MessageSquare, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const JOURNEY_STEPS = [
  {
    id: 'intake',
    label: 'Health intake',
    detail: 'Complete your questionnaire',
    icon: MessageSquare,
    status: 'Submitted',
  },
  {
    id: 'consult',
    label: 'Physician review',
    detail: 'Licensed doctor reviews your case',
    icon: Calendar,
    status: 'In progress',
  },
  {
    id: 'rx',
    label: 'Prescription issued',
    detail: 'Digital Rx sent to pharmacy',
    icon: FileText,
    status: 'Approved',
  },
  {
    id: 'delivery',
    label: 'Home delivery',
    detail: 'Track your order to your door',
    icon: Package,
    status: 'Shipped',
  },
] as const

interface LivingShowcaseProps {
  className?: string
  compact?: boolean
}

export function LivingShowcase({ className, compact }: LivingShowcaseProps) {
  const reducedMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const progress = useMotionValue(0)
  const cycleRef = useRef<ReturnType<typeof animate> | null>(null)

  useEffect(() => {
    if (reducedMotion || paused) {
      cycleRef.current?.stop()
      return
    }

    progress.set(0)
    cycleRef.current = animate(progress, 1, {
      duration: 4,
      ease: 'linear',
      onComplete: () => {
        setActiveIndex((prev) => (prev + 1) % JOURNEY_STEPS.length)
      },
    })

    return () => cycleRef.current?.stop()
  }, [activeIndex, paused, reducedMotion, progress])

  const current = JOURNEY_STEPS[activeIndex]

  return (
    <div
      className={cn(
        'deep-card rounded-2xl',
        compact ? 'max-w-xs p-3' : 'w-full max-w-md p-5',
        className
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium text-on-ink-muted">Your visit</span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-current-bright">
          {current.status}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="rounded-xl bg-white/10 p-4"
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-current">
              <current.icon className="h-5 w-5 text-[color:var(--deep)]" strokeWidth={2} />
            </div>
            <div>
              <p className="font-medium text-on-ink">{current.label}</p>
              <p className="text-xs text-on-ink-muted">{current.detail}</p>
            </div>
          </div>

          {!reducedMotion && (
            <div className="h-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full w-full origin-left rounded-full bg-ember"
                style={{ scaleX: progress }}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className={cn('mt-4 flex gap-1', compact && 'mt-3')}>
        {JOURNEY_STEPS.map((step, i) => (
          <button
            key={step.id}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              i === activeIndex ? 'bg-ember' : 'bg-white/15'
            )}
            aria-label={`Show ${step.label}`}
          />
        ))}
      </div>
    </div>
  )
}
