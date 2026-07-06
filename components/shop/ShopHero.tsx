import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface ShopHeroProps {
  tab?: string
}

export function ShopHero({ tab = 'prescription' }: ShopHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0B1210]">
      <Image
        src="/images/assets/3.png"
        alt="LIVI Longevity"
        width={1200}
        height={480}
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        priority
      />
      <div className="relative z-10 px-8 py-16 md:px-16 md:py-20">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#E85A2B]">
          The Longevity Club
        </p>
        <h1 className="font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
          {tab === 'otc' ? 'Wellness Essentials' : 'Prescription Treatments'}
        </h1>
        <p className="mt-4 max-w-xl text-base text-white/70">
          {tab === 'otc'
            ? 'Science-backed supplements shipped to your door — no prescription required.'
            : 'Compounded medications reviewed by US-licensed physicians. Select, intake, checkout, delivered.'}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/shop?tab=${tab === 'otc' ? 'prescription' : 'otc'}`}>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent">
              {tab === 'otc' ? 'View Rx treatments' : 'View OTC products'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
