import { NextRequest, NextResponse } from 'next/server'
import { pharmaciesDb } from '@/lib/mock-db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const city = searchParams.get('city') ?? undefined
  const state = searchParams.get('state') ?? undefined
  const data = pharmaciesDb.search(city, state)
  return NextResponse.json({ success: true, data })
}
