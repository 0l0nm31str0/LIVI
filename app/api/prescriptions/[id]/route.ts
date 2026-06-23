import { NextRequest, NextResponse } from 'next/server'
import { prescriptionsDb } from '@/lib/mock-db'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const rx = prescriptionsDb.findById(params.id)
  if (!rx) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
  return NextResponse.json({ success: true, data: rx })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const rx = prescriptionsDb.update(params.id, body)
  if (!rx) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
  return NextResponse.json({ success: true, data: rx })
}
