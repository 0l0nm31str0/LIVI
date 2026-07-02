'use client'

// Pointer-tracked 3D tilt. Transform-only (GPU compositing), spring-settled,
// disabled for reduced motion and coarse pointers.

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface Tilt3DProps {
  children: React.ReactNode
  className?: string
  /** Max tilt in degrees. */
  max?: number
  /** Perspective distance in px. */
  perspective?: number
}

export function Tilt3D({ children, className, max = 7, perspective = 900 }: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const sx = useSpring(mx, { stiffness: 160, damping: 20, mass: 0.6 })
  const sy = useSpring(my, { stiffness: 160, damping: 20, mass: 0.6 })

  const rotateY = useTransform(sx, [0, 1], [-max, max])
  const rotateX = useTransform(sy, [0, 1], [max, -max])

  function onPointerMove(e: React.PointerEvent) {
    if (reduced || e.pointerType !== 'mouse' || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width)
    my.set((e.clientY - rect.top) / rect.height)
  }

  function onPointerLeave() {
    mx.set(0.5)
    my.set(0.5)
  }

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      ref={ref}
      className={cn('will-change-transform', className)}
      style={{ perspective }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
        {children}
      </motion.div>
    </div>
  )
}
