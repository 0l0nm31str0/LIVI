import Link from 'next/link'
import { SiteNav } from '@/components/marketing/SiteNav'
import { SiteFooter } from '@/components/marketing/SiteFooter'
import { DeepHero } from '@/components/marketing/DeepHero'
import { JourneyFlow } from '@/components/marketing/JourneyFlow'
import { CareMenu } from '@/components/marketing/CareMenu'
import { PhotoSplit } from '@/components/marketing/PhotoSplit'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { TrustMarquee } from '@/components/shop/TrustMarquee'

export default function LandingPage() {
  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-deep">
        <div className="relative z-10">
          <SiteNav />

          <DeepHero />

          {/* Trust marquee */}
          <div className="relative z-10">
            <TrustMarquee />
          </div>

          <section id="how-it-works" className="py-24 md:py-36">
            <JourneyFlow />
          </section>

          <section className="py-24 md:py-32">
            <div className="mx-auto max-w-6xl px-6">
              <PhotoSplit
                variant="deep"
                imageSrc="/images/marketing/care-lifestyle.webp"
                imageAlt="LIVI longevity products"
                eyebrow="Why LIVI"
                title="Care designed for your longevity."
                quote="I got my prescription reviewed and shipped without ever leaving the app."
                items={[
                  {
                    title: 'Product-first, not clinic-first',
                    description:
                      'Browse treatments, choose your plan, and let our physicians review — no appointments needed.',
                  },
                  {
                    title: 'One connected journey',
                    description: 'Intake, approval, payment, and delivery — all in one place.',
                  },
                  {
                    title: 'Compounded for you',
                    description: 'Medications from 503A-accredited pharmacies, reviewed by licensed physicians.',
                  },
                ]}
              />
            </div>
          </section>

          <section id="treatments" className="py-24 md:py-32">
            <CareMenu />
          </section>

          {/* Final CTA */}
          <section className="px-6 py-32 text-center md:py-44">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
              The Longevity Club
            </p>
            <h2 className="mx-auto max-w-2xl font-display text-4xl font-bold tracking-tight text-on-deep md:text-6xl">
              Own your longevity.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-lg text-on-deep-muted">
              Prescription treatments and OTC wellness, delivered monthly.
            </p>
            <Link href="/shop" className="mt-10 inline-block">
              <button className="h-14 rounded-full bg-orange-500 px-10 text-base font-bold text-white transition-colors hover:bg-orange-600">
                Shop treatments →
              </button>
            </Link>
          </section>

          <SiteFooter />
        </div>
      </div>
    </SmoothScroll>
  )
}
