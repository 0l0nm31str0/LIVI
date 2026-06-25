import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { curexaOrders } from '@/lib/curexa/client'
import { ok, err } from '@/lib/api-response'

// GET /api/orders/[id] - get order by LIVI visit ID, with fresh Curexa status
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

  if (error || !visit?.curexa_order_id) {
    return NextResponse.json(err('Order not found'), { status: 404 })
  }

  // Refresh from Curexa
  try {
    const status = await curexaOrders.status(visit.curexa_order_id)
    await db.from('visits').update({
      curexa_order_status: status.status,
      tracking_number: status.tracking_number,
      carrier: status.carrier,
    }).eq('id', visit.id)
    return NextResponse.json(ok({ ...visit, curexa_order_status: status.status, tracking_number: status.tracking_number, carrier: status.carrier, status_details: status.status_details }))
  } catch {
    return NextResponse.json(ok(visit))
  }
}

// POST /api/orders/[id]/cancel
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = getServerSupabase()
  const { data: visit } = await db.from('visits').select('curexa_order_id').eq('id', params.id).single()
  if (!visit?.curexa_order_id) return NextResponse.json(err('Order not found'), { status: 404 })

  try {
    await curexaOrders.cancel(visit.curexa_order_id)
    await db.from('visits').update({ curexa_order_status: 'cancelled' }).eq('id', params.id)
    return NextResponse.json(ok({ cancelled: true }))
  } catch (e) {
    return NextResponse.json(err(e instanceof Error ? e.message : 'Cancel failed'), { status: 500 })
  }
}
