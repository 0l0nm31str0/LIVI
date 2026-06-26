'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

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
        'sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300',
        scrolled
          ? 'border-b border-white/10 bg-ink shadow-elevated'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className={cn(
            'font-display text-xl font-semibold tracking-tight transition-colors',
            scrolled ? 'text-on-ink' : 'text-on-ink'
          )}
        >
          LIVI
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-on-ink-muted hover:bg-white/10 hover:text-on-ink"
            >
              Sign in
            </Button>
          </Link>
          <Link href="/login">
            <Button size="sm">Get started</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
