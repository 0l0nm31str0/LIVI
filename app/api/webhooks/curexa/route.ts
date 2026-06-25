// Curexa Pharmacy → LIVI webhook handler
//
// Handles order lifecycle events:
//   order status changes → update visit.curexa_order_status
//   shipped             → save tracking number + carrier
//   completed           → mark visit as 'delivered'
//   direct_message      → save pharmacy message to visit_messages

import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { verifyCurexaWebhook } from '@/lib/curexa/client'
import type { CurexaOrderStatus } from '@/types'

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

  await db.from('webhook_events').insert({
    source: 'curexa',
    event_type: event.type,
    payload: event.data,
  })

  const orderId = event.data.order_id as string
  if (!orderId) return NextResponse.json({ received: true })

  try {
    switch (event.type) {
      case 'order.processing':
      case 'order.payment_required':
      case 'order.in_progress': {
        const status = event.type.replace('order.', '') as CurexaOrderStatus
        await db
          .from('visits')
          .update({ curexa_order_status: status, updated_at: new Date().toISOString() })
          .eq('curexa_order_id', orderId)
        break
      }

      case 'order.shipped': {
        await db.from('visits').update({
          status: 'shipped',
          curexa_order_status: 'shipped',
          tracking_number: event.data.tracking_number as string ?? null,
          tracking_url: event.data.tracking_url as string ?? null,
          carrier: event.data.carrier as string ?? null,
          estimated_delivery: event.data.estimated_delivery as string ?? null,
          updated_at: new Date().toISOString(),
        }).eq('curexa_order_id', orderId)
        break
      }

      case 'order.out_for_delivery': {
        await db.from('visits').update({
          curexa_order_status: 'out_for_delivery',
          updated_at: new Date().toISOString(),
        }).eq('curexa_order_id', orderId)
        break
      }

      case 'order.completed': {
        await db.from('visits').update({
          status: 'delivered',
          curexa_order_status: 'completed',
          updated_at: new Date().toISOString(),
        }).eq('curexa_order_id', orderId)
        break
      }

      case 'order.cancelled': {
        await db.from('visits').update({
          curexa_order_status: 'cancelled',
          updated_at: new Date().toISOString(),
        }).eq('curexa_order_id', orderId)
        break
      }

      case 'order.error': {
        await db.from('visits').update({
          curexa_order_status: 'error',
          updated_at: new Date().toISOString(),
        }).eq('curexa_order_id', orderId)
        break
      }

      case 'direct_message': {
        // Pharmacy → patient message
        const { data: visit } = await db
          .from('visits')
          .select('id')
          .eq('curexa_order_id', orderId)
          .single()

        if (visit) {
          await db.from('visit_messages').insert({
            visit_id: visit.id,
            sender_id: 'curexa',
            sender_name: 'Pharmacy',
            sender_type: 'pharmacy',
            message: event.data.message as string,
            source: 'curexa',
            external_id: event.data.message_id as string ?? null,
            created_at: event.data.created_at as string ?? new Date().toISOString(),
          })
        }
        break
      }
    }

    await db
      .from('webhook_events')
      .update({ processed: true })
      .eq('source', 'curexa')
      .eq('event_type', event.type)
      .order('received_at', { ascending: false })
      .limit(1)
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : String(e)
    console.error(`Curexa webhook error [${event.type}]:`, errMsg)
  }

  return NextResponse.json({ received: true })
}
