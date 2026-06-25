import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { belugaVisits } from '@/lib/beluga/client'
import { ok, err } from '@/lib/api-response'

// GET /api/visits/[id]
// Returns the LIVI visit record, optionally refreshed from Beluga.
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = getServerSupabase()
  const { data: visit, error } = await db
    .from('visits')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !visit) {
    return NextResponse.json(err('Visit not found'), { status: 404 })
  }

  // Optionally refresh status from Beluga
  if (visit.beluga_visit_id) {
    try {
      const bv = await belugaVisits.get(visit.beluga_visit_id)
      const belugaStatus = mapBelugaStatus(bv.status)
      if (belugaStatus !== visit.status && visit.status !== 'prescribed' && visit.status !== 'shipped' && visit.status !== 'delivered') {
        await db
          .from('visits')
          .update({ status: belugaStatus, zoom_link: bv.zoom_link ?? visit.zoom_link })
          .eq('id', params.id)
        visit.status = belugaStatus
        visit.zoom_link = bv.zoom_link ?? visit.zoom_link
      }
    } catch (e) {
      console.warn('Could not refresh from Beluga:', e)
    }
  }

  return NextResponse.json(ok(visit))
}

function mapBelugaStatus(s: string): string {
  switch (s) {
    case 'draft': return 'draft'
    case 'submitted': return 'submitted'
    case 'pending_review': return 'under_review'
    case 'active': return 'active'
    case 'completed': return 'active'
    default: return s
  }
}
