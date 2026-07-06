import { NextRequest, NextResponse } from 'next/server'
import { isDemoMode } from '@/lib/config'
import { advanceDemoStatus } from '@/lib/marketplace/mock-orders'

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!isDemoMode()) {
    return NextResponse.json({ success: false, error: 'Not available in production' }, { status: 404 })
  }
  const order = advanceDemoStatus(params.id)
  if (!order) {
    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true, data: order })
}
