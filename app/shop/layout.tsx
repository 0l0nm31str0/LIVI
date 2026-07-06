import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { SiteFooter } from '@/components/marketing/SiteFooter'

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F6F3EE]">
      {/* Shop nav */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-[#F6F3EE]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/assets/Transparent-02.png"
              alt="LIVI"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <span className="font-display text-xl font-semibold text-foreground">LIVI</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/shop?tab=prescription" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Rx Treatments
            </Link>
            <Link href="/shop?tab=otc" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              OTC Wellness
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/patient/dashboard">
              <Button size="sm" className="bg-[#E85A2B] hover:bg-[#d14f25] text-white border-0">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <SiteFooter />
    </div>
  )
}
