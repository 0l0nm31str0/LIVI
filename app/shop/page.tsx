import { Suspense } from 'react'
import { ShopContent } from './ShopContent'

export const metadata = {
  title: 'Shop — LIVI Longevity Club',
  description: 'Browse prescription treatments and wellness products.',
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  )
}
