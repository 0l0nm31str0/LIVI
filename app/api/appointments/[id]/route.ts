import { NextRequest, NextResponse } from 'next/server'
import { appointmentsDb } from '@/lib/mock-db'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const apt = appointmentsDb.findById(params.id)
  if (!apt) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
  return NextResponse.json({ success: true, data: apt })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const apt = appointmentsDb.update(params.id, body)
  if (!apt) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
  return NextResponse.json({ success: true, data: apt })
}
