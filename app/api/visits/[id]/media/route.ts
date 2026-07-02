import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { belugaMedia, BelugaError } from '@/lib/beluga/client'
import { ok, err } from '@/lib/api-response'

// POST /api/visits/:id/media
// Body: { images?: [{ data: base64jpeg }], pdf?: base64 }
// Forwards patient ID photos / documents to Beluga for the visit.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json(err('Invalid JSON'), { status: 400 })

  const { images, pdf } = body as {
    images?: Array<{ data: string }>
    pdf?: string
  }
  if ((!images || images.length === 0) && !pdf) {
    return NextResponse.json(err('images or pdf is required'), { status: 400 })
  }

  const db = getServerSupabase()
  const { data: visit, error } = await db
    .from('visits')
    .select('id,beluga_visit_id')
    .eq('id', params.id)
    .single()

  if (error || !visit) return NextResponse.json(err('Visit not found'), { status: 404 })
  if (!visit.beluga_visit_id) {
    return NextResponse.json(err('Visit has no Beluga visitId yet'), { status: 409 })
  }

  try {
    const results: Record<string, unknown> = {}
    if (images && images.length > 0) {
      results.images = await belugaMedia.submitImages(visit.beluga_visit_id, images)
    }
    if (pdf) {
      results.pdf = await belugaMedia.submitPdf(visit.beluga_visit_id, pdf)
    }
    return NextResponse.json(ok(results), { status: 201 })
  } catch (e) {
    if (e instanceof BelugaError) {
      return NextResponse.json(err(`Beluga error: ${e.message}`), {
        status: e.status >= 400 && e.status < 500 ? e.status : 502,
      })
    }
    return NextResponse.json(err('Internal error'), { status: 500 })
  }
}
