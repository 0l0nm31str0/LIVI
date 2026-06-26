'use client'

import { type LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export interface BentoStep {
  title: string
  description: string
  icon?: LucideIcon
}

interface ScrollBentoProps {
  steps: BentoStep[]
  className?: string
}

export function ScrollBento({ steps, className }: ScrollBentoProps) {
  const reducedMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (reducedMotion) return

    const observers: IntersectionObserver[] = []

    stepRefs.current.forEach((el, i) => {
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setActiveIndex(i)
          }
        },
        { threshold: [0.5], rootMargin: '-10% 0px -10% 0px' }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [reducedMotion, steps.length])

  const progress = reducedMotion ? 100 : ((activeIndex + 1) / steps.length) * 100

  return (
    <div className={className}>
      <div className="relative mb-8 hidden h-0.5 w-full overflow-hidden rounded-full bg-border sm:block">
        <div
          className="h-full rounded-full bg-sage transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => {
          const isActive = i === activeIndex
          const isLarge = i === 0
          const Icon = step.icon

          return (
            <div
              key={step.title}
              ref={(el) => {
                stepRefs.current[i] = el
              }}
              className={cn(
                'rounded-xl border bg-surface p-5 transition-[border-color,box-shadow,transform] duration-300',
                isLarge && 'sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2 lg:p-8',
                isActive
                  ? 'border-sage shadow-elevated -translate-y-0.5'
                  : 'border-border shadow-card'
              )}
            >
              {Icon && (
                <div
                  className={cn(
                    'mb-4 flex items-center justify-center rounded-xl transition-colors',
                    isLarge ? 'h-14 w-14' : 'h-11 w-11',
                    isActive ? 'bg-sage text-white' : 'bg-accent-light text-sage'
                  )}
                >
                  <Icon className={isLarge ? 'h-7 w-7' : 'h-5 w-5'} strokeWidth={1.75} />
                </div>
              )}
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Step {i + 1}
              </p>
              <h3
                className={cn(
                  'mb-2 font-semibold text-foreground',
                  isLarge && 'font-display text-2xl lg:text-3xl'
                )}
              >
                {step.title}
              </h3>
              <p
                className={cn(
                  'leading-relaxed text-muted-foreground',
                  isLarge ? 'text-base' : 'text-sm'
                )}
              >
                {step.description}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
