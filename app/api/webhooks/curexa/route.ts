// Curexa Pharmacy → LIVI webhook handler
//
// Events handled:
//   order.processing        → curexa_order_status = 'processing'
//   order.payment_required  → curexa_order_status = 'payment_required'
//   order.in_progress       → curexa_order_status = 'in_progress'
//   order.shipped           → curexa_order_status = 'shipped', save tracking
//   order.out_for_delivery  → curexa_order_status = 'out_for_delivery'
//   order.completed         → visit status = 'delivered'
//   order.cancelled         → curexa_order_status = 'cancelled'
//   order.error             → curexa_order_status = 'error'
//   direct_message          → save pharmacy message to visit_messages

import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { verifyCurexaWebhook } from '@/lib/curexa/client'

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const sig = req.headers.get('x-curexa-signature') ?? ''

  if (!verifyCurexaWebhook(rawBody, sig)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: { type: string; data: Record<string, unknown> }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const db = getServerSupabase()

  const { data: logRow } = await db
    .from('webhook_events')
    .insert({ source: 'curexa', event_type: event.type, payload: event.data })
    .select('id')
    .single()

  const logId: string | null = logRow?.id ?? null

  try {
    const curexaOrderId = event.data.order_id as string

    switch (event.type) {
      case 'order.processing':
        await db
          .from('visits')
          .update({ curexa_order_status: 'processing', updated_at: new Date().toISOString() })
          .eq('curexa_order_id', curexaOrderId)
        break

      case 'order.payment_required':
        await db
          .from('visits')
          .update({ curexa_order_status: 'payment_required', updated_at: new Date().toISOString() })
          .eq('curexa_order_id', curexaOrderId)
        break

      case 'order.in_progress':
        await db
          .from('visits')
          .update({ curexa_order_status: 'in_progress', updated_at: new Date().toISOString() })
          .eq('curexa_order_id', curexaOrderId)
        break

      case 'order.shipped':
        await db.from('visits').update({
          curexa_order_status: 'shipped',
          status: 'shipped',
          tracking_number: (event.data.tracking_number as string) ?? null,
          tracking_url: (event.data.tracking_url as string) ?? null,
          carrier: (event.data.carrier as string) ?? null,
          estimated_delivery: (event.data.estimated_delivery as string) ?? null,
          updated_at: new Date().toISOString(),
        }).eq('curexa_order_id', curexaOrderId)
        break

      case 'order.out_for_delivery':
        await db
          .from('visits')
          .update({ curexa_order_status: 'out_for_delivery', updated_at: new Date().toISOString() })
          .eq('curexa_order_id', curexaOrderId)
        break

      case 'order.completed':
        await db.from('visits').update({
          curexa_order_status: 'completed',
          status: 'delivered',
          updated_at: new Date().toISOString(),
        }).eq('curexa_order_id', curexaOrderId)
        break

      case 'order.cancelled':
        await db.from('visits').update({
          curexa_order_status: 'cancelled',
          updated_at: new Date().toISOString(),
        }).eq('curexa_order_id', curexaOrderId)
        break

      case 'order.error':
        await db.from('visits').update({
          curexa_order_status: 'error',
          updated_at: new Date().toISOString(),
        }).eq('curexa_order_id', curexaOrderId)
        break

      case 'direct_message': {
        const { data: visit } = await db
          .from('visits')
          .select('id')
          .eq('curexa_order_id', curexaOrderId)
          .single()

        if (visit) {
          await db.from('visit_messages').insert({
            visit_id: visit.id,
            sender_id: null,
            sender_name: 'Curexa Pharmacy',
            sender_type: 'pharmacy',
            message: event.data.message as string,
            source: 'curexa',
            external_id: (event.data.message_id as string) ?? null,
            created_at: (event.data.created_at as string) ?? new Date().toISOString(),
          })
        }
        break
      }
    }

    if (logId) await db.from('webhook_events').update({ processed: true }).eq('id', logId)
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : String(e)
    console.error(`Curexa webhook error [${event.type}]:`, errMsg)
    if (logId) await db.from('webhook_events').update({ error: errMsg }).eq('id', logId)
  }

  return NextResponse.json({ received: true })
}
