// Curexa Pharmacy → LIVI webhook handler
// Payload format matches order_status.php response per curexa.md

import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { verifyCurexaWebhook, mapCurexaStatus } from '@/lib/curexa/client'

interface CurexaWebhookPayload {
  order_id?: string
  status?: string
  status_details?: string | null
  carrier?: string | null
  tracking_number?: string | null
  body?: string
  message_created_on?: string
  patient_id?: string
  [key: string]: unknown
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const sig =
    req.headers.get('x-curexa-signature') ??
    req.headers.get('authorization') ??
    ''

  if (!verifyCurexaWebhook(rawBody, sig)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: CurexaWebhookPayload
  try {
    payload = JSON.parse(rawBody) as CurexaWebhookPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const db = getServerSupabase()
  const isMessage = Boolean(payload.body && payload.order_id)
  const eventType = isMessage ? 'direct_message' : (payload.status ?? 'unknown')

  const { data: logRow } = await db
    .from('webhook_events')
    .insert({ source: 'curexa', event_type: eventType, payload })
    .select('id')
    .single()

  const logId: string | null = logRow?.id ?? null

  try {
    if (isMessage) {
      await handleDirectMessage(db, payload)
    } else if (payload.order_id && payload.status) {
      await handleOrderStatus(db, payload)
    }

    if (logId) await db.from('webhook_events').update({ processed: true }).eq('id', logId)
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : String(e)
    console.error(`Curexa webhook error [${eventType}]:`, errMsg)
    if (logId) await db.from('webhook_events').update({ error: errMsg }).eq('id', logId)
  }

  return NextResponse.json({ received: true })
}

async function handleOrderStatus(
  db: ReturnType<typeof import('@/lib/supabase').getServerSupabase>,
  payload: CurexaWebhookPayload
) {
  const mapped = mapCurexaStatus(payload.status!)
  const update: Record<string, unknown> = {
    curexa_order_status: mapped.curexa_order_status,
    tracking_number: payload.tracking_number ?? null,
    carrier: payload.carrier ?? null,
    updated_at: new Date().toISOString(),
  }
  if (mapped.visit_status) update.status = mapped.visit_status

  await db.from('visits').update(update).eq('curexa_order_id', payload.order_id!)
}

async function handleDirectMessage(
  db: ReturnType<typeof import('@/lib/supabase').getServerSupabase>,
  payload: CurexaWebhookPayload
) {
  const { data: visit } = await db
    .from('visits')
    .select('id')
    .eq('curexa_order_id', payload.order_id!)
    .single()

  if (!visit) return

  await db.from('visit_messages').insert({
    visit_id: visit.id,
    sender_name: 'Curexa Pharmacy',
    sender_type: 'pharmacy',
    message: payload.body!,
    source: 'curexa',
    created_at: payload.message_created_on ?? new Date().toISOString(),
  })
}
