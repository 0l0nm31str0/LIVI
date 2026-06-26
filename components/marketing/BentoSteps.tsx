'use client'

import dynamic from 'next/dynamic'
import { Calendar, FileText, Package, Stethoscope } from 'lucide-react'
import { StaticBentoFallback } from '@/components/motion/static-fallbacks'
import type { BentoStep } from '@/components/motion/ScrollBento'

const ScrollBento = dynamic(
  () => import('@/components/motion/ScrollBento').then((m) => m.ScrollBento),
  {
    ssr: false,
    loading: () => <StaticBentoFallback steps={[]} />,
  }
)

const steps: BentoStep[] = [
  {
    icon: Stethoscope,
    title: 'Tell us how you feel',
    description:
      'Complete a short health questionnaire from home. No waiting rooms, no phone trees — just a clear path to care.',
  },
  {
    icon: Calendar,
    title: 'Meet your physician',
    description: 'A licensed doctor reviews your case and consults via video or async messaging.',
  },
  {
    icon: FileText,
    title: 'Receive your prescription',
    description: 'If appropriate, your prescription is issued digitally and routed to pharmacy.',
  },
  {
    icon: Package,
    title: 'Get it delivered',
    description: 'Track your order from the pharmacy to your door.',
  },
]

interface BentoStepsProps {
  title?: string
  description?: string
}

export function BentoSteps({
  title = 'How it works',
  description = 'Four steps from symptom to doorstep.',
}: BentoStepsProps) {
  return (
    <div>
      <div className="mb-12 max-w-xl">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {title}
        </h2>
        <p className="mt-3 text-muted-foreground">{description}</p>
      </div>
      <ScrollBento steps={steps} />
    </div>
  )
}
