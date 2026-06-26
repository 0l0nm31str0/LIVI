'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface KineticHeroProps {
  eyebrow: string
  headline: string
  subhead: string
  children?: React.ReactNode
  showcase?: React.ReactNode
  className?: string
}

export function KineticHero({ eyebrow, headline, subhead, children, showcase, className }: KineticHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const panelY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 48])
  const panelOpacity = useTransform(scrollYProgress, [0, 0.5], [1, reducedMotion ? 1 : 0.6])

  const words = headline.split(' ')

  return (
    <div ref={containerRef} className={cn('grid items-center gap-12 lg:grid-cols-2 lg:gap-16', className)}>
      <div>
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-accent-light">
          {eyebrow}
        </p>
        <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-on-ink sm:text-5xl lg:text-6xl text-balance">
          {reducedMotion ? (
            headline
          ) : (
            words.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                className="inline-block mr-[0.25em]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            ))
          )}
        </h1>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-on-ink-muted text-pretty">
          {subhead}
        </p>
        {children && <div className="mt-8">{children}</div>}
      </div>

      {showcase && (
        <motion.div
          style={reducedMotion ? undefined : { y: panelY, opacity: panelOpacity }}
          className="flex justify-center lg:justify-end"
        >
          {showcase}
        </motion.div>
      )}
    </div>
  )
}
