// Beluga Health → LIVI webhook handler
// Payload format: { masterId, event, ...fields } per Beluga webhook documentation

import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { verifyBelugaWebhook } from '@/lib/beluga/client'
import { curexaOrders, CurexaCreateOrderInput } from '@/lib/curexa/client'
import { isDemoMode } from '@/lib/config'
import { updateMarketplaceOrderByBelugaMasterId } from '@/lib/marketplace/orders'

interface BelugaWebhookPayload {
  masterId?: string
  event?: string
  visitOutcome?: string
  docName?: string
  medsPrescribed?: Array<Record<string, unknown>>
  content?: string
  orderId?: string
  info?: Record<string, unknown>
  bookingLink?: string
  labReqPdf?: string
  [key: string]: unknown
}

const LAB_EVENT_LABELS: Record<string, string> = {
  LAB_ORDER_REQUISITION_CREATED: 'Your lab requisition has been created.',
  LAB_ORDER_SHIPPED_TO_PATIENT: 'Your lab kit has shipped.',
  LAB_ORDER_DELIVERED_TO_PATIENT: 'Your lab kit was delivered.',
  LAB_ORDER_SHIPPED_TO_LAB: 'Your sample is on its way to the lab.',
  LAB_ORDER_RECEIVED_BY_LAB: 'The lab has received your sample.',
  LAB_ORDER_RESULTS: 'Your lab results are ready.',
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const sig =
    req.headers.get('x-beluga-signature') ??
    req.headers.get('x-hub-signature-256') ??
    req.headers.get('authorization') ??
    ''

  if (!verifyBelugaWebhook(rawBody, sig)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: BelugaWebhookPayload
  try {
    payload = JSON.parse(rawBody) as BelugaWebhookPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const eventType = payload.event
  if (!eventType) {
    return NextResponse.json({ error: 'Missing event field' }, { status: 400 })
  }

  if (isDemoMode()) {
    // In demo mode: only process marketplace order updates, skip Supabase
    return NextResponse.json({ received: true, demo: true })
  }

  const db = getServerSupabase()

  const { data: logRow } = await db
    .from('webhook_events')
    .insert({ source: 'beluga', event_type: eventType, payload })
    .select('id')
    .single()

  const logId: string | null = logRow?.id ?? null

  try {
    switch (eventType) {
      case 'RX_WRITTEN':
        await handleRxWritten(db, payload)
        // Also update marketplace order if linked
        if (payload.masterId) {
          await updateMarketplaceOrderByBelugaMasterId(payload.masterId, {
            status: 'approved',
          })
        }
        break
      case 'CONSULT_CONCLUDED':
        await updateVisitByMasterId(db, payload.masterId, {
          status: payload.visitOutcome === 'prescribed' ? 'prescribed' : 'active',
        })
        if (payload.masterId && payload.visitOutcome === 'prescribed') {
          await updateMarketplaceOrderByBelugaMasterId(payload.masterId, { status: 'approved' })
        } else if (payload.masterId) {
          await updateMarketplaceOrderByBelugaMasterId(payload.masterId, { status: 'under_review' })
        }
        break
      case 'CONSULT_CANCELED':
        await updateVisitByMasterId(db, payload.masterId, { status: 'cancelled' })
        if (payload.masterId) {
          await updateMarketplaceOrderByBelugaMasterId(payload.masterId, { status: 'denied' })
        }
        break
      case 'DOCTOR_CHAT':
        await handleIncomingMessage(db, payload, 'doctor')
        break
      case 'CS_MESSAGE':
        await handleIncomingMessage(db, payload, 'system')
        break
      case 'PHARMACY_ORDER_IN_FULFILLMENT':
        await updateVisitByMasterId(db, payload.masterId, { curexa_order_status: 'in_progress' })
        break
      case 'PHARMACY_ORDER_SHIPPED':
        await updateVisitByMasterId(db, payload.masterId, {
          status: 'shipped',
          curexa_order_status: 'shipped',
          tracking_number: payload.info?.tracking as string | undefined ?? null,
          carrier: payload.info?.carrier as string | undefined ?? null,
        })
        if (payload.masterId) {
          await updateMarketplaceOrderByBelugaMasterId(payload.masterId, {
            status: 'shipped',
            tracking_number: payload.info?.tracking as string | undefined,
          })
        }
        break
      case 'PHARMACY_ORDER_DELIVERED':
        await updateVisitByMasterId(db, payload.masterId, {
          status: 'delivered',
          curexa_order_status: 'completed',
        })
        if (payload.masterId) {
          await updateMarketplaceOrderByBelugaMasterId(payload.masterId, { status: 'delivered' })
        }
        break
      case 'LAB_ORDER_REQUISITION_CREATED':
      case 'LAB_ORDER_SHIPPED_TO_PATIENT':
      case 'LAB_ORDER_DELIVERED_TO_PATIENT':
      case 'LAB_ORDER_SHIPPED_TO_LAB':
      case 'LAB_ORDER_RECEIVED_BY_LAB':
      case 'LAB_ORDER_RESULTS':
        await handleLabEvent(db, eventType, payload)
        break
    }

    if (logId) await db.from('webhook_events').update({ processed: true }).eq('id', logId)
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : String(e)
    console.error(`Beluga webhook error [${eventType}]:`, errMsg)
    if (logId) await db.from('webhook_events').update({ error: errMsg }).eq('id', logId)
  }

  return NextResponse.json({ received: true })
}

async function updateVisitByMasterId(
  db: ReturnType<typeof import('@/lib/supabase').getServerSupabase>,
  masterId: string | undefined,
  fields: Record<string, unknown>
) {
  if (!masterId) return
  await db
    .from('visits')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('beluga_master_id', masterId)
}

async function findVisitByMasterId(
  db: ReturnType<typeof import('@/lib/supabase').getServerSupabase>,
  masterId: string | undefined
) {
  if (!masterId) return null
  const { data } = await db.from('visits').select('*').eq('beluga_master_id', masterId).single()
  return data
}

async function handleRxWritten(
  db: ReturnType<typeof import('@/lib/supabase').getServerSupabase>,
  payload: BelugaWebhookPayload
) {
  const masterId = payload.masterId
  const visit = await findVisitByMasterId(db, masterId)
  if (!visit) {
    console.error('[RX_WRITTEN] Visit not found for masterId:', masterId)
    return
  }

  const meds = payload.medsPrescribed ?? []
  const primary = meds[0] ?? {}
  const rx = {
    medication_name: primary.name as string,
    strength: primary.strength as string,
    quantity: Number(primary.quantity ?? 30),
    refills: Number(primary.refills ?? 0),
    medId: primary.medId as string,
    rxId: primary.rxId as string,
    docName: payload.docName,
    medsPrescribed: meds,
  }

  const { data: patient } = await db
    .from('patient_profiles')
    .select('*')
    .eq('livi_user_id', visit.patient_id)
    .single()

  if (!patient) {
    await db.from('visits').update({
      status: 'prescribed',
      rx_written: true,
      prescription_data: rx,
      updated_at: new Date().toISOString(),
    }).eq('id', visit.id)
    return
  }

  const docParts = String(payload.docName ?? '').split(' ')
  const prescriberFirst = docParts[0] ?? 'Doctor'
  const prescriberLast = docParts.slice(1).join(' ') || 'Beluga'

  const curexaPayload: CurexaCreateOrderInput = {
    patient_id: patient.email,
    patient_first_name: patient.first_name,
    patient_last_name: patient.last_name,
    patient_dob: patient.date_of_birth ?? '',
    patient_email: patient.email,
    patient_phone: patient.phone ?? '',
    patient_address: patient.address_line1 ?? '',
    patient_city: patient.city ?? '',
    patient_state: patient.state ?? '',
    patient_zip: patient.zip ?? '',
    patient_gender: patient.gender ?? 'U',
    patient_known_allergies: String(visit.questionnaire?.allergies ?? 'None'),
    patient_other_medications: String(visit.questionnaire?.current_medications ?? 'None'),

    medication_name: String(primary.name ?? 'Prescription'),
    dosage: String(primary.strength ?? ''),
    quantity: Number(primary.quantity ?? 30),
    refills: Number(primary.refills ?? 0),
    days_supply: 30,

    prescriber_first_name: prescriberFirst,
    prescriber_last_name: prescriberLast,
    prescriber_npi: process.env.PRESCRIBER_NPI ?? '',

    shipping_address: patient.address_line1 ?? '',
    shipping_city: patient.city ?? '',
    shipping_state: patient.state ?? '',
    shipping_zip: patient.zip ?? '',

    livi_visit_id: visit.id,
    livi_rx_id: String(primary.rxId ?? primary.medId ?? ''),
  }

  let curexaOrderId: string | null = null
  let curexaStatus: string | null = null

  try {
    const order = await curexaOrders.create(curexaPayload)
    curexaOrderId = order.order_id
    curexaStatus = 'new'
    console.log('[RX_WRITTEN] Curexa order created:', curexaOrderId)
  } catch (e) {
    console.error('[RX_WRITTEN] Failed to create Curexa order:', e)
  }

  await db.from('visits').update({
    status: 'prescribed',
    rx_written: true,
    prescription_data: rx,
    curexa_order_id: curexaOrderId,
    curexa_order_status: curexaStatus,
    updated_at: new Date().toISOString(),
  }).eq('id', visit.id)
}

async function handleLabEvent(
  db: ReturnType<typeof import('@/lib/supabase').getServerSupabase>,
  eventType: string,
  payload: BelugaWebhookPayload
) {
  const visit = await findVisitByMasterId(db, payload.masterId)
  if (!visit) {
    console.error(`[${eventType}] Visit not found for masterId:`, payload.masterId)
    return
  }

  const labData: Record<string, unknown> = {
    ...(visit.lab_data as Record<string, unknown> | null ?? {}),
    orderId: payload.orderId ?? null,
    lastEvent: eventType,
    lastEventAt: new Date().toISOString(),
  }
  if (payload.info?.carrier) labData.carrier = payload.info.carrier
  if (payload.info?.tracking) labData.tracking = payload.info.tracking
  if (payload.bookingLink) labData.bookingLink = payload.bookingLink
  // The requisition PDF arrives base64-encoded; keep a flag rather than
  // persisting megabytes of PDF in the row.
  if (payload.labReqPdf) labData.hasRequisitionPdf = true

  await db.from('visits').update({
    lab_status: eventType,
    lab_data: labData,
    updated_at: new Date().toISOString(),
  }).eq('id', visit.id)

  const label = LAB_EVENT_LABELS[eventType]
  if (label) {
    const extra =
      payload.info?.tracking
        ? ` Tracking: ${payload.info.carrier ?? ''} ${payload.info.tracking}`.trimEnd()
        : payload.bookingLink
          ? ` Book a follow-up: ${payload.bookingLink}`
          : ''
    await db.from('visit_messages').insert({
      visit_id: visit.id,
      sender_name: 'LIVI Labs',
      sender_type: 'system',
      message: `${label}${extra}`,
      source: 'beluga',
    })
  }
}

async function handleIncomingMessage(
  db: ReturnType<typeof import('@/lib/supabase').getServerSupabase>,
  payload: BelugaWebhookPayload,
  kind: 'doctor' | 'system'
) {
  const visit = await findVisitByMasterId(db, payload.masterId)
  if (!visit || !payload.content) return

  await db.from('visit_messages').insert({
    visit_id: visit.id,
    sender_name: kind === 'doctor' ? (payload.docName ?? 'Doctor') : 'LIVI Support',
    sender_type: kind === 'doctor' ? 'doctor' : 'system',
    message: payload.content,
    source: 'beluga',
  })
}
