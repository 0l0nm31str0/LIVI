import { NextRequest, NextResponse } from 'next/server'
import { pharmaciesDb } from '@/lib/mock-db'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const pharmacy = pharmaciesDb.findById(params.id)
  if (!pharmacy) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
  return NextResponse.json({ success: true, data: pharmacy })
}
