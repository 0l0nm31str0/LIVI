import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { curexaOrders } from '@/lib/curexa/client'
import { ok, err } from '@/lib/api-response'

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = getServerSupabase()
  const { data: visit } = await db
    .from('visits')
    .select('id,curexa_order_id,status')
    .eq('id', params.id)
    .single()

  if (!visit) return NextResponse.json(err('Visit not found'), { status: 404 })

  if (visit.curexa_order_id) {
    try {
      await curexaOrders.cancel(visit.curexa_order_id)
    } catch (e) {
      console.warn('Curexa cancel failed (continuing):', e)
    }
  }

  await db.from('visits').update({
    status: 'cancelled',
    curexa_order_status: visit.curexa_order_id ? 'cancelled' : null,
    updated_at: new Date().toISOString(),
  }).eq('id', params.id)

  return NextResponse.json(ok({ cancelled: true }))
}
