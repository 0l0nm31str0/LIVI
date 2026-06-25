// Beluga Health → LIVI webhook handler
//
// Events handled:
//   RX_WRITTEN        → create Curexa order, update visit to 'prescribed'
//   CONSULT_CONCLUDED → update visit status to 'active'
//   CONSULT_CANCELED  → update visit status to 'cancelled'
//   DOCTOR_CHAT       → save message to visit_messages
//   CS_MESSAGE        → save message to visit_messages

import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { verifyBelugaWebhook } from '@/lib/beluga/client'
import { curexaOrders, CurexaCreateOrderInput } from '@/lib/curexa/client'

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const sig = req.headers.get('x-beluga-signature') ?? ''

  if (!verifyBelugaWebhook(rawBody, sig)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: { type: string; data: Record<string, unknown> }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const db = getServerSupabase()

  // Log event and capture the row id for later update
  const { data: logRow } = await db
    .from('webhook_events')
    .insert({ source: 'beluga', event_type: event.type, payload: event.data })
    .select('id')
    .single()

  const logId: string | null = logRow?.id ?? null

  try {
    switch (event.type) {
      case 'RX_WRITTEN':
        await handleRxWritten(db, event.data)
        break

      case 'CONSULT_CONCLUDED':
        await db
          .from('visits')
          .update({ status: 'active', updated_at: new Date().toISOString() })
          .eq('beluga_visit_id', event.data.visit_id as string)
        break

      case 'CONSULT_CANCELED':
        await db
          .from('visits')
          .update({ status: 'cancelled', updated_at: new Date().toISOString() })
          .eq('beluga_visit_id', event.data.visit_id as string)
        break

      case 'DOCTOR_CHAT':
      case 'CS_MESSAGE':
        await handleIncomingMessage(db, event.data, event.type)
        break
    }

    if (logId) await db.from('webhook_events').update({ processed: true }).eq('id', logId)
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : String(e)
    console.error(`Beluga webhook error [${event.type}]:`, errMsg)
    if (logId) await db.from('webhook_events').update({ error: errMsg }).eq('id', logId)
  }

  return NextResponse.json({ received: true })
}

async function handleRxWritten(
  db: ReturnType<typeof import('@/lib/supabase').getServerSupabase>,
  data: Record<string, unknown>
) {
  const belugaVisitId = data.visit_id as string
  const rx = data.prescription as Record<string, unknown>

  const { data: visit } = await db
    .from('visits')
    .select('*')
    .eq('beluga_visit_id', belugaVisitId)
    .single()

  if (!visit) {
    console.error('[RX_WRITTEN] Visit not found for beluga_visit_id:', belugaVisitId)
    return
  }

  const { data: patient } = await db
    .from('patient_profiles')
    .select('*')
    .eq('livi_user_id', visit.patient_id)
    .single()

  if (!patient) {
    console.error('[RX_WRITTEN] Patient profile not found for:', visit.patient_id)
    await db
      .from('visits')
      .update({ status: 'prescribed', rx_written: true, prescription_data: rx })
      .eq('id', visit.id)
    return
  }

  // patient_id MUST be the patient's email for eScript cross-matching with Curexa
  const curexaPayload: CurexaCreateOrderInput = {
    patient_id: patient.email,
    patient_first_name: patient.first_name,
    patient_last_name: patient.last_name,
    patient_dob: formatDob(patient.date_of_birth),
    patient_email: patient.email,
    patient_phone: patient.phone ?? '',
    patient_address: patient.address_line1 ?? '',
    patient_city: patient.city ?? '',
    patient_state: patient.state ?? '',
    patient_zip: patient.zip ?? '',
    patient_gender: mapGender(patient.gender),

    medication_name: rx.medication_name as string,
    medication_ndc: rx.ndc_code as string | undefined,
    dosage: rx.dosage as string,
    quantity: rx.quantity as number,
    refills: rx.refills as number,
    days_supply: (rx.days_supply as number) ?? 30,
    special_instructions: rx.special_instructions as string | undefined,

    prescriber_first_name: (data.doctor_first_name as string) ?? '',
    prescriber_last_name: (data.doctor_last_name as string) ?? '',
    prescriber_npi: (data.doctor_npi as string) ?? process.env.PRESCRIBER_NPI ?? '',
    prescriber_address: process.env.PRESCRIBER_ADDRESS ?? '',
    prescriber_city: process.env.PRESCRIBER_CITY ?? '',
    prescriber_state: process.env.PRESCRIBER_STATE ?? '',
    prescriber_zip: process.env.PRESCRIBER_ZIP ?? '',
    prescriber_phone: process.env.PRESCRIBER_PHONE ?? '',

    shipping_address: patient.address_line1 ?? '',
    shipping_city: patient.city ?? '',
    shipping_state: patient.state ?? '',
    shipping_zip: patient.zip ?? '',

    livi_visit_id: visit.id,
    livi_rx_id: rx.id as string,
  }

  let curexaOrderId: string | null = null
  let curexaStatus: string | null = null

  try {
    const order = await curexaOrders.create(curexaPayload)
    curexaOrderId = order.order_id
    curexaStatus = order.status ?? 'new'
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

async function handleIncomingMessage(
  db: ReturnType<typeof import('@/lib/supabase').getServerSupabase>,
  data: Record<string, unknown>,
  eventType: string
) {
  const belugaVisitId = data.visit_id as string
  const { data: visit } = await db
    .from('visits')
    .select('id')
    .eq('beluga_visit_id', belugaVisitId)
    .single()

  if (!visit) return

  const isDoctor = eventType === 'DOCTOR_CHAT'
  await db.from('visit_messages').insert({
    visit_id: visit.id,
    sender_id: (data.sender_id as string) ?? null,
    sender_name: isDoctor ? ((data.doctor_name as string) ?? 'Doctor') : 'LIVI Support',
    sender_type: isDoctor ? 'doctor' : 'system',
    message: data.message as string,
    source: 'beluga',
    external_id: (data.message_id as string) ?? null,
    created_at: (data.created_at as string) ?? new Date().toISOString(),
  })
}

function formatDob(dob: string | null): string {
  if (!dob) return ''
  // Convert YYYY-MM-DD to MM/DD/YYYY for Curexa
  const parts = dob.split('-')
  if (parts.length === 3) return `${parts[1]}/${parts[2]}/${parts[0]}`
  return dob
}

function mapGender(g: string | null): string {
  if (!g) return 'U'
  const lower = g.toLowerCase()
  if (lower === 'male' || lower === 'm') return 'M'
  if (lower === 'female' || lower === 'f') return 'F'
  return 'U'
}
