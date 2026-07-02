import { NextRequest, NextResponse } from 'next/server'
import { pharmaciesDb } from '@/lib/mock-db'
import { belugaPharmacies, BelugaError } from '@/lib/beluga/client'

// GET /api/pharmacies?city=&state=&zip=&name=
// When Beluga is configured, searches the live retail pharmacy list
// (zip or name is the minimum criterion per Beluga docs); otherwise
// falls back to the local directory.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const city = searchParams.get('city') ?? undefined
  const state = searchParams.get('state') ?? undefined
  const zip = searchParams.get('zip') ?? undefined
  const name = searchParams.get('name') ?? undefined

  if (process.env.BELUGA_API_KEY && (zip || name)) {
    try {
      const res = await belugaPharmacies.search({
        name: name ?? '',
        city,
        state,
        zip,
      })
      return NextResponse.json({ success: true, data: res.data ?? [], source: 'beluga' })
    } catch (e) {
      if (!(e instanceof BelugaError)) throw e
      console.error('Beluga pharmacy search failed, using local directory:', e.message)
    }
  }

  const data = pharmaciesDb.search(city, state)
  return NextResponse.json({ success: true, data, source: 'local' })
}
