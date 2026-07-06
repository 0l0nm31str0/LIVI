'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { ProductCategory } from '@/lib/products/catalog'

const RX_CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'weight-loss', label: 'Weight Loss' },
  { id: 'mens-health', label: "Men's Health" },
  { id: 'hormones', label: 'Hormones' },
  { id: 'longevity', label: 'Longevity' },
]

const OTC_CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'longevity', label: 'Longevity' },
  { id: 'wellness', label: 'Wellness' },
]

interface CategoryChipsProps {
  tab: string
}

export function CategoryChips({ tab }: CategoryChipsProps) {
  const router = useRouter()
  const params = useSearchParams()
  const active = params.get('category')
  const categories = tab === 'otc' ? OTC_CATEGORIES : RX_CATEGORIES

  function setCategory(id: string | null) {
    const next = new URLSearchParams(params.toString())
    if (id) {
      next.set('category', id)
    } else {
      next.delete('category')
    }
    router.push(`/shop?${next.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setCategory(null)}
        className={cn(
          'rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150',
          !active
            ? 'border-[#E85A2B] bg-[#E85A2B] text-white'
            : 'border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground'
        )}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setCategory(cat.id)}
          className={cn(
            'rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150',
            active === cat.id
              ? 'border-[#E85A2B] bg-[#E85A2B] text-white'
              : 'border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground'
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
