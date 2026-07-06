'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[var(--z-nav)] transition-[background-color,border-color,backdrop-filter] duration-300',
        scrolled
          ? 'border-b border-white/10 bg-black/70 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/assets/Transparent-03.png"
            alt="LIVI"
            width={72}
            height={28}
            className="h-7 w-auto object-contain"
          />
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/shop?tab=prescription"
            className="text-sm font-medium text-white/75 hover:text-white transition-colors"
          >
            Prescriptions
          </Link>
          <Link
            href="/shop?tab=otc"
            className="text-sm font-medium text-white/75 hover:text-white transition-colors"
          >
            OTC Wellness
          </Link>
          <Link href="/login" className="text-sm font-medium text-white/75 hover:text-white transition-colors">
            Sign in
          </Link>
          <Link
            href="/shop"
            className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Shop now
          </Link>
        </nav>
      </div>
    </header>
  )
}
