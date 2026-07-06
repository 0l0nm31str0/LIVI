'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

const TABS = [
  { id: 'prescription', label: 'Prescription Treatments' },
  { id: 'otc', label: 'OTC Wellness' },
] as const

export function MarketplaceTabs() {
  const router = useRouter()
  const params = useSearchParams()
  const active = params.get('tab') ?? 'prescription'

  function setTab(tab: string) {
    const next = new URLSearchParams(params.toString())
    next.set('tab', tab)
    next.delete('category')
    router.push(`/shop?${next.toString()}`)
  }

  return (
    <div className="flex gap-1 rounded-xl bg-muted/50 p-1">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setTab(tab.id)}
          className={cn(
            'flex-1 rounded-lg px-6 py-2.5 text-sm font-medium transition-all duration-200',
            active === tab.id
              ? 'bg-white text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
