// Curexa Pharmacy API client — aligned with curexa.md
// Auth: HTTP Basic (CUREXA_USERNAME:CUREXA_PASSWORD)
// Base URL: https://api.curexa.com
// CRITICAL: patient_id MUST be the patient's email for eScript matching.

import { createHmac, timingSafeEqual } from 'crypto'

const BASE = () => process.env.CUREXA_API_URL ?? 'https://api.curexa.com'

function getAuth(): string {
  const user = process.env.CUREXA_USERNAME
  const pass = process.env.CUREXA_PASSWORD
  if (!user || !pass) throw new Error('CUREXA credentials not configured')
  return 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64')
}

export class CurexaError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: string,
    public readonly endpoint: string
  ) {
    super(`Curexa ${status} @ ${endpoint}: ${body}`)
    this.name = 'CurexaError'
  }
}

async function curexaFetch<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${BASE()}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: getAuth(),
    },
    body: JSON.stringify(body),
  })

  const text = await res.text()
  let parsed: Record<string, unknown> = {}
  if (text) {
    try {
      parsed = JSON.parse(text) as Record<string, unknown>
    } catch {
      if (!res.ok) throw new CurexaError(res.status, text, endpoint)
      throw new CurexaError(res.status, 'Invalid JSON response', endpoint)
    }
  }

  if (parsed.status === 'failed') {
    throw new CurexaError(400, String(parsed.message ?? 'Curexa request failed'), endpoint)
  }

  if (!res.ok) {
    throw new CurexaError(res.status, text || res.statusText, endpoint)
  }

  return parsed as T
}

// ─── Order Types ─────────────────────────────────────────────────────────────

export interface CurexaCreateOrderInput {
  order_id?: string
  patient_id: string
  patient_first_name: string
  patient_last_name: string
  patient_dob: string
  patient_email: string
  patient_phone: string
  patient_address: string
  patient_city: string
  patient_state: string
  patient_zip: string
  patient_gender: string
  patient_known_allergies?: string
  patient_other_medications?: string

  medication_name: string
  medication_ndc?: string
  dosage: string
  quantity: number
  refills: number
  days_supply: number
  special_instructions?: string

  prescriber_first_name: string
  prescriber_last_name: string
  prescriber_npi: string

  shipping_address: string
  shipping_city: string
  shipping_state: string
  shipping_zip: string

  livi_visit_id: string
  livi_rx_id?: string
}

export interface CurexaOrderResponse {
  order_id: string
  status: string
  message?: string
  rx_item_count?: number
  otc_item_count?: number
}

export interface CurexaStatusResponse {
  order_id: string
  status: string
  status_details: string | null
  tracking_number: string | null
  carrier: string | null
}

function toCurexaDob(dob: string): string {
  const slash = dob.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (slash) return `${slash[3]}${slash[1]}${slash[2]}`
  const iso = dob.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (iso) return `${iso[1]}${iso[2]}${iso[3]}`
  const digits = dob.replace(/\D/g, '')
  return digits.length === 8 ? digits : dob
}

function toCurexaGender(g: string): string {
  const lower = g.toLowerCase()
  if (lower === 'm' || lower === 'male') return 'male'
  if (lower === 'f' || lower === 'female') return 'female'
  return 'male'
}

function toCurexaPayload(data: CurexaCreateOrderInput): Record<string, unknown> {
  const orderId = data.order_id ?? `livi-${data.livi_visit_id}-${Date.now()}`
  const prescriber = `${data.prescriber_first_name} ${data.prescriber_last_name}`.trim() || 'Prescriber'
  const phone = data.patient_phone.replace(/\D/g, '')
  const sig = data.special_instructions?.trim() || `Take ${data.dosage} as directed`

  return {
    order_id: orderId,
    patient_id: data.patient_id,
    patient_first_name: data.patient_first_name,
    patient_last_name: data.patient_last_name,
    patient_dob: toCurexaDob(data.patient_dob),
    patient_gender: toCurexaGender(data.patient_gender),
    patient_known_allergies: data.patient_known_allergies ?? 'None',
    patient_other_medications: data.patient_other_medications ?? 'None',
    shipping_method: process.env.CUREXA_SHIPPING_METHOD ?? 'usps_first',
    carrier: process.env.CUREXA_CARRIER ?? 'usps',
    address_to_name: `${data.patient_first_name} ${data.patient_last_name}`.trim(),
    address_to_street1: data.shipping_address,
    address_to_street2: '',
    address_to_city: data.shipping_city,
    address_to_state: data.shipping_state.toUpperCase().slice(0, 2),
    address_to_zip: data.shipping_zip,
    address_to_country: 'US',
    address_to_phone: phone.length > 0 ? phone : '0000000000',
    rx_items: [
      {
        rx_id: data.livi_rx_id ?? null,
        medication_name: data.medication_name,
        quantity_dispensed: data.quantity,
        days_supply: data.days_supply,
        prescribing_doctor: prescriber,
        medication_sig: sig,
        non_child_resistant_acknowledgment: 'true',
        is_refill: data.refills > 0 ? 'true' : 'false',
      },
    ],
  }
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export const curexaOrders = {
  create(data: CurexaCreateOrderInput) {
    return curexaFetch<CurexaOrderResponse>('/orders.php', toCurexaPayload(data))
  },

  status(orderId: string) {
    return curexaFetch<CurexaStatusResponse>('/order_status.php', { order_id: orderId })
  },

  cancel(orderId: string) {
    return curexaFetch<{ order_id: string; status: string; msg?: string }>('/cancel_order.php', {
      order_id: orderId,
    })
  },
}

// ─── Messaging ───────────────────────────────────────────────────────────────

export const curexaMessaging = {
  send(orderId: string, message: string, patientId?: string) {
    const now = new Date()
    const stamp = now.toISOString().slice(0, 19).replace('T', ' ')
    return curexaFetch<{ message: string }>('/messaging.php', {
      order_id: orderId,
      body: message,
      message_created_on: stamp,
      message_type: 1,
      user_id: 'livi-patient',
      patient_id: patientId ?? '',
      message_priority: 2,
    })
  },
}

// ─── Webhook signature verification ──────────────────────────────────────────

export function verifyCurexaWebhook(rawBody: string, signature: string): boolean {
  const secret = process.env.CUREXA_WEBHOOK_SECRET
  if (!secret) return true
  if (!signature) return false
  try {
    const expected = createHmac('sha256', secret).update(rawBody).digest('hex')
    const sigBuf = Buffer.from(signature.replace(/^sha256=/, ''), 'hex')
    const expBuf = Buffer.from(expected, 'hex')
    if (sigBuf.length !== expBuf.length) return false
    return timingSafeEqual(sigBuf, expBuf)
  } catch {
    return false
  }
}

// Map Curexa webhook/API status → LIVI visit status fields
export function mapCurexaStatus(status: string): {
  curexa_order_status: string
  visit_status?: 'shipped' | 'delivered'
} {
  switch (status) {
    case 'out_for_delivery':
      return { curexa_order_status: 'out_for_delivery', visit_status: 'shipped' }
    case 'completed':
      return { curexa_order_status: 'completed', visit_status: 'delivered' }
    case 'in_progress':
      return { curexa_order_status: 'in_progress' }
    case 'new':
      return { curexa_order_status: 'new' }
    case 'cancelled':
      return { curexa_order_status: 'cancelled' }
    case 'error':
      return { curexa_order_status: 'error' }
    default:
      return { curexa_order_status: status }
  }
}
