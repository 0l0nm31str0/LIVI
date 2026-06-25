// Internal endpoint: GET /api/visits/status?patient_id=xxx
// Returns counts for each status — used by dashboard stats.
import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { ok, err } from '@/lib/api-response'

export async function GET(req: NextRequest) {
  const patientId = req.nextUrl.searchParams.get('patient_id')
  if (!patientId) return NextResponse.json(err('patient_id required'), { status: 400 })

  const db = getServerSupabase()
  const { data, error } = await db
    .from('visits')
    .select('status')
    .eq('patient_id', patientId)

  if (error) return NextResponse.json(err(error.message), { status: 500 })

  const counts = (data ?? []).reduce((acc: Record<string, number>, v) => {
    acc[v.status] = (acc[v.status] ?? 0) + 1
    return acc
  }, {})

  return NextResponse.json(ok(counts))
}
