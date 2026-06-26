import Link from 'next/link'
import { SiteNav } from '@/components/marketing/SiteNav'
import { SiteFooter } from '@/components/marketing/SiteFooter'
import { Section } from '@/components/marketing/Section'
import { BentoSteps } from '@/components/marketing/BentoSteps'
import { PhotoSplit } from '@/components/marketing/PhotoSplit'
import { LandingHero } from '@/components/marketing/LandingHero'
import { ServicesStrip } from '@/components/marketing/ServicesStrip'
import { Button } from '@/components/ui/button'

const trustLabels = [
  'HIPAA compliant',
  'Licensed physicians',
  'Pharmacy network',
  'Board-certified care',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="bg-ink">
        <SiteNav />

        <Section variant="ink" className="pb-16 pt-8 md:pb-24 md:pt-12">
          <LandingHero />
        </Section>
      </div>

      <div className="border-y border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-5">
          {trustLabels.map((label, i) => (
            <span key={label} className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
              {i > 0 && <span className="hidden h-4 w-px bg-border sm:block" aria-hidden />}
              {label}
            </span>
          ))}
        </div>
      </div>

      <Section id="how-it-works" variant="canvas">
        <BentoSteps />
      </Section>

      <Section variant="default" className="bg-surface">
        <PhotoSplit
          imageSrc="/images/marketing/lifestyle-wellness.svg"
          imageAlt="Person receiving care at home"
          eyebrow="Why LIVI"
          title="Care designed around your life."
          quote="I got a prescription and delivery update in the same app — no calling three different places."
          items={[
            {
              title: 'Care on your schedule',
              description: 'Book consultations when it works for you — evenings, weekends, from anywhere.',
            },
            {
              title: 'One connected journey',
              description: 'Visit, prescription, and delivery live in a single place.',
            },
            {
              title: 'Built for trust',
              description: 'HIPAA-compliant infrastructure with board-certified physicians.',
            },
          ]}
        />
      </Section>

      <Section id="services" variant="canvas" className="cv-auto">
        <ServicesStrip />
      </Section>

      <Section variant="ink" className="text-center cv-auto">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-on-ink md:text-4xl text-balance">
          Ready when you are.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-on-ink-muted">
          Create an account and start your first visit in minutes.
        </p>
        <Link href="/login">
          <Button size="lg" className="mt-8">Get started</Button>
        </Link>
      </Section>

      <SiteFooter />
    </div>
  )
}
