import { NextRequest, NextResponse } from 'next/server'
import { medicationsDb } from '@/lib/mock-db'
import { compressData } from '@/lib/compression'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')
  const useCompression = searchParams.get('compress') === 'true'

  const data = q ? medicationsDb.search(q) : medicationsDb.getAll()
  const payload = { success: true, data }

  if (useCompression) {
    const jsonStr = JSON.stringify(payload)
    if (Buffer.byteLength(jsonStr, 'utf-8') > 1000) {
      const result = await compressData(payload)
      return NextResponse.json({
        success: true,
        data: result.compressed,
        meta: { compressed: true, compressionRatio: result.metadata.ratio },
      })
    }
  }

  return NextResponse.json(payload)
}
