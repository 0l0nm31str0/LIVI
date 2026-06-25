import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { curexaOrders } from '@/lib/curexa/client'
import { ok, err } from '@/lib/api-response'

// GET /api/orders?patient_id=xxx
// Returns all visits that have a Curexa order, with fresh status from Curexa.
export async function GET(req: NextRequest) {
  const patientId = req.nextUrl.searchParams.get('patient_id')
  if (!patientId) return NextResponse.json(err('patient_id is required'), { status: 400 })

  const db = getServerSupabase()
  const { data: visits, error } = await db
    .from('visits')
    .select('id,status,curexa_order_id,curexa_order_status,tracking_number,tracking_url,carrier,estimated_delivery,prescription_data,created_at,updated_at')
    .eq('patient_id', patientId)
    .not('curexa_order_id', 'is', null)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json(err(error.message), { status: 500 })

  // Optionally refresh status from Curexa for active orders
  const activeStatuses = ['new', 'processing', 'payment_required', 'in_progress', 'shipped', 'out_for_delivery']
  const refreshed = await Promise.all(
    (visits ?? []).map(async (v) => {
      if (v.curexa_order_id && activeStatuses.includes(v.curexa_order_status ?? '')) {
        try {
          const status = await curexaOrders.status(v.curexa_order_id)
          if (status.status !== v.curexa_order_status) {
            await db.from('visits').update({
              curexa_order_status: status.status,
              tracking_number: status.tracking_number,
              tracking_url: status.tracking_url,
              carrier: status.carrier,
              estimated_delivery: status.estimated_delivery,
            }).eq('id', v.id)
            return { ...v, ...status }
          }
        } catch {
          // Non-fatal: return cached data
        }
      }
      return v
    })
  )

  return NextResponse.json(ok(refreshed))
}
