'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const categories = [
  {
    title: 'Weight Loss',
    description: 'Physician-supervised GLP-1 programs with Semaglutide and compounded support.',
    meta: 'Subscription from $299/mo',
    href: '/shop?tab=prescription&category=weight-loss',
  },
  {
    title: "Men's Health",
    description: 'Sildenafil, Vardenafil + Tadalafil — clinically reviewed and discreetly delivered.',
    meta: 'From $149/mo',
    href: '/shop?tab=prescription&category=mens-health',
  },
  {
    title: 'Longevity & Hormones',
    description: 'Oxytocin, Sermorelin — compounded peptide programs for energy and healthy aging.',
    meta: 'From $199/mo',
    href: '/shop?tab=prescription&category=longevity',
  },
  {
    title: 'OTC Wellness',
    description: 'NAD+, Collagen Peptides, Magnesium — pharmaceutical-grade, subscription delivery.',
    meta: 'From $39/mo',
    href: '/shop?tab=otc',
  },
]

export function CareMenu() {
  const reduced = useReducedMotion()

  return (
    <div className="mx-auto max-w-6xl px-6">
      <h2 className="font-display text-4xl font-semibold tracking-tight text-on-deep md:text-5xl">
        What LIVI carries.
      </h2>

      <div className="mt-12 border-t border-white/10">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.title}
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -8% 0px' }}
            transition={{ duration: 0.55, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={cat.href}
              className="group flex flex-col gap-2 border-b border-white/10 py-8 transition-colors duration-200 hover:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-4 md:py-10"
            >
              <div className="flex items-center gap-5">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-on-deep transition-colors duration-200 group-hover:text-orange-400 md:text-3xl">
                  {cat.title}
                </h3>
                <ArrowUpRight
                  className="h-6 w-6 shrink-0 text-on-deep-muted transition-all duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-orange-400"
                  strokeWidth={1.75}
                />
              </div>
              <div className="sm:max-w-md sm:text-right">
                <p className="leading-relaxed text-on-deep-muted">{cat.description}</p>
                <p className="mt-1 text-sm font-medium text-orange-400">{cat.meta}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
