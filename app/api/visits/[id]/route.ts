import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { belugaVisits } from '@/lib/beluga/client'
import { ok, err } from '@/lib/api-response'

// GET /api/visits/[id]
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

  if (visit.beluga_master_id) {
    try {
      const bv = await belugaVisits.fetch(visit.beluga_master_id)
      const belugaStatus = mapBelugaVisitStatus(String(bv.visitStatus ?? ''))
      const terminal = ['prescribed', 'shipped', 'delivered', 'cancelled']
      if (belugaStatus && !terminal.includes(visit.status)) {
        await db
          .from('visits')
          .update({ status: belugaStatus, updated_at: new Date().toISOString() })
          .eq('id', params.id)
        visit.status = belugaStatus
      }
    } catch (e) {
      console.warn('Could not refresh from Beluga:', e)
    }
  }

  return NextResponse.json(ok(visit))
}

function mapBelugaVisitStatus(s: string): string | null {
  switch (s) {
    case 'pending':
    case 'admin':
    case 'holding':
      return 'under_review'
    case 'active':
      return 'active'
    case 'resolved':
      return 'active'
    case 'canceled':
      return 'cancelled'
    default:
      return null
  }
}
