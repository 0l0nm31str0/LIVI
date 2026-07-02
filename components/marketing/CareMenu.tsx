'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const services = [
  {
    title: 'Async visits',
    description: 'Message-based consultations when you need answers, not appointments.',
    meta: 'Reviewed within hours',
  },
  {
    title: 'Video consults',
    description: 'Face-to-face with a licensed physician, from wherever you are.',
    meta: 'Evenings & weekends',
  },
  {
    title: 'Rx delivery',
    description: 'Prescriptions filled by our pharmacy network and shipped to your door.',
    meta: 'Tracked end-to-end',
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
        {services.map((service, i) => (
          <motion.div
            key={service.title}
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -8% 0px' }}
            transition={{ duration: 0.55, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/signup"
              className="group flex flex-col gap-2 border-b border-white/10 py-8 transition-colors duration-200 hover:bg-white/[0.04] focus-visible:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-4 md:py-10"
            >
              <div className="flex items-center gap-5">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-on-deep transition-colors duration-200 group-hover:text-current-bright md:text-3xl">
                  {service.title}
                </h3>
                <ArrowUpRight
                  className="h-6 w-6 shrink-0 text-on-deep-muted transition-all duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-current-bright"
                  strokeWidth={1.75}
                />
              </div>
              <div className="sm:max-w-md sm:text-right">
                <p className="leading-relaxed text-on-deep-muted">{service.description}</p>
                <p className="mt-1 text-sm font-medium text-ember">{service.meta}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
