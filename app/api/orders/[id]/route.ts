import { NextRequest, NextResponse } from 'next/server'
import { ordersDb } from '@/lib/mock-db'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const order = ordersDb.findById(params.id)
  if (!order) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
  return NextResponse.json({ success: true, data: order })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const order = ordersDb.update(params.id, body)
  if (!order) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
  return NextResponse.json({ success: true, data: order })
}
