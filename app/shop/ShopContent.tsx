'use client'

import { useSearchParams } from 'next/navigation'
import { ShopHero } from '@/components/shop/ShopHero'
import { MarketplaceTabs } from '@/components/shop/MarketplaceTabs'
import { CategoryChips } from '@/components/shop/CategoryChips'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { TrustMarquee } from '@/components/shop/TrustMarquee'
import { getProductsByType, type ProductCategory } from '@/lib/products/catalog'

export function ShopContent() {
  const params = useSearchParams()
  const tab = params.get('tab') ?? 'prescription'
  const category = params.get('category') as ProductCategory | null

  const type = tab === 'otc' ? 'otc' : 'prescription'
  let products = getProductsByType(type)
  if (category) {
    products = products.filter((p) => p.category === category)
  }

  return (
    <div>
      <TrustMarquee />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <ShopHero tab={tab} />

        <div className="mt-10 space-y-6">
          <MarketplaceTabs />
          <CategoryChips tab={tab} />
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  )
}
