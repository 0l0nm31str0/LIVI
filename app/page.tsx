import Link from 'next/link'
import { SiteNav } from '@/components/marketing/SiteNav'
import { SiteFooter } from '@/components/marketing/SiteFooter'
import { DeepHero } from '@/components/marketing/DeepHero'
import { JourneyFlow } from '@/components/marketing/JourneyFlow'
import { CareMenu } from '@/components/marketing/CareMenu'
import { PhotoSplit } from '@/components/marketing/PhotoSplit'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { FluidCurrent } from '@/components/three/FluidCurrent'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-deep">
        {/* The current — one WebGL layer behind the whole page.
            Scroll velocity stirs it; page depth brightens it. */}
        <div className="fixed inset-0" aria-hidden>
          <FluidCurrent className="absolute inset-0" intensity={1} />
        </div>

        <div className="relative z-10">
          <SiteNav />

          <DeepHero />

          <section id="how-it-works" className="py-24 md:py-36">
            <JourneyFlow />
          </section>

          <section className="py-24 md:py-32">
            <div className="mx-auto max-w-6xl px-6">
              <PhotoSplit
                variant="deep"
                imageSrc="/images/marketing/care-lifestyle.webp"
                imageAlt="Person receiving care at home"
                eyebrow="Why LIVI"
                title="Care designed around your life."
                quote="I got a prescription and delivery update in the same app — no calling three different places."
                items={[
                  {
                    title: 'Care on your schedule',
                    description:
                      'Book consultations when it works for you — evenings, weekends, from anywhere.',
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
            </div>
          </section>

          <section id="services" className="py-24 md:py-32">
            <CareMenu />
          </section>

          {/* CTA rides the brightest water — the shader peaks at scroll end */}
          <section className="px-6 py-32 text-center md:py-44">
            <h2 className="mx-auto max-w-2xl font-display text-4xl font-semibold tracking-tight text-on-deep md:text-6xl">
              Ready when you are.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-lg text-on-deep-muted">
              Create an account and start your first visit in minutes.
            </p>
            <Link href="/signup" className="mt-10 inline-block">
              <Button size="lg" className="h-12 px-8 text-base">
                Start your visit
              </Button>
            </Link>
          </section>

          <SiteFooter />
        </div>
      </div>
    </SmoothScroll>
  )
}
