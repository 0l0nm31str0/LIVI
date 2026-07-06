import { NextRequest, NextResponse } from 'next/server'
import { ALL_PRODUCTS, getProductsByType } from '@/lib/products/catalog'
import type { ProductType } from '@/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') as ProductType | null
  const category = searchParams.get('category')

  let products = type ? getProductsByType(type) : ALL_PRODUCTS
  if (category) products = products.filter((p) => p.category === category)

  return NextResponse.json({ success: true, data: products })
}
