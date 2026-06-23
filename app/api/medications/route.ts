import { NextRequest, NextResponse } from 'next/server'
import { medicationsDb } from '@/lib/mock-db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')
  const data = q ? medicationsDb.search(q) : medicationsDb.getAll()
  return NextResponse.json({ success: true, data })
}
