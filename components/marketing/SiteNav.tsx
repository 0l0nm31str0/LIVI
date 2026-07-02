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
        'fixed inset-x-0 top-0 z-[var(--z-nav)] transition-[background-color,border-color,backdrop-filter] duration-300',
        scrolled
          ? 'border-b border-white/10 bg-deep/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-on-deep"
        >
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: 'linear-gradient(135deg, var(--current-bright), var(--current))' }}
            aria-hidden
          />
          LIVI
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-on-deep-muted hover:bg-white/10 hover:text-on-deep"
            >
              Sign in
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Get started</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
