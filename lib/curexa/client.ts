// Curexa Pharmacy API client
// Auth: HTTP Basic (CUREXA_USERNAME:CUREXA_PASSWORD)
// Base URL: https://api.curexa.com
// CRITICAL: patient_id MUST be the patient's email for eScript matching.

const BASE = () => process.env.CUREXA_API_URL ?? 'https://api.curexa.com'

function getAuth(): string {
  const user = process.env.CUREXA_USERNAME
  const pass = process.env.CUREXA_PASSWORD
  if (!user || !pass) throw new Error('CUREXA credentials not configured')
  return 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64')
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

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new CurexaError(res.status, text, endpoint)
  }

  const text = await res.text()
  return text ? (JSON.parse(text) as T) : ({} as T)
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

// ─── Order Types ─────────────────────────────────────────────────────────────

export interface CurexaCreateOrderInput {
  // Patient — patient_id MUST equal patient email for eScript cross-matching
  patient_id: string            // Patient email (CRITICAL: must match eScript)
  patient_first_name: string
  patient_last_name: string
  patient_dob: string           // MM/DD/YYYY format
  patient_email: string         // Same as patient_id
  patient_phone: string
  patient_address: string
  patient_city: string
  patient_state: string
  patient_zip: string
  patient_gender: string        // 'M' | 'F' | 'U'

  // Medication
  medication_name: string
  medication_ndc?: string       // NDC code preferred
  dosage: string
  quantity: number
  refills: number
  days_supply: number
  special_instructions?: string

  // Prescriber
  prescriber_first_name: string
  prescriber_last_name: string
  prescriber_npi: string
  prescriber_dea?: string
  prescriber_address: string
  prescriber_city: string
  prescriber_state: string
  prescriber_zip: string
  prescriber_phone: string

  // Shipping destination
  shipping_address: string
  shipping_city: string
  shipping_state: string
  shipping_zip: string

  // LIVI internal references (passed through for tracking)
  livi_visit_id: string
  livi_rx_id?: string
}

export interface CurexaOrderResponse {
  order_id: string
  status: string
  message?: string
  estimated_delivery?: string
}

export interface CurexaStatusResponse {
  order_id: string
  status: string
  tracking_number: string | null
  tracking_url: string | null
  carrier: string | null
  estimated_delivery: string | null
  updated_at: string
}

export interface CurexaMessageItem {
  id: string
  message: string
  sender: 'patient' | 'pharmacy'
  created_at: string
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export const curexaOrders = {
  create(data: CurexaCreateOrderInput) {
    return curexaFetch<CurexaOrderResponse>('/orders.php', data as unknown as Record<string, unknown>)
  },

  status(orderId: string) {
    return curexaFetch<CurexaStatusResponse>('/order_status.php', { order_id: orderId })
  },

  cancel(orderId: string, reason = 'Cancelled by patient') {
    return curexaFetch<{ success: boolean; message: string }>('/cancel_order.php', {
      order_id: orderId,
      reason,
    })
  },
}

// ─── Messaging ───────────────────────────────────────────────────────────────

export const curexaMessaging = {
  send(orderId: string, message: string, sender: 'patient' | 'pharmacy') {
    return curexaFetch<{ message_id: string; created_at: string }>('/messaging.php', {
      order_id: orderId,
      action: 'send',
      message,
      sender,
    })
  },

  list(orderId: string) {
    return curexaFetch<{ messages: CurexaMessageItem[] }>('/messaging.php', {
      order_id: orderId,
      action: 'list',
    })
  },
}

// ─── Webhook Signature Verification ──────────────────────────────────────────

import { createHmac, timingSafeEqual } from 'crypto'

export function verifyCurexaWebhook(rawBody: string, signature: string): boolean {
  const secret = process.env.CUREXA_WEBHOOK_SECRET
  if (!secret) return true
  try {
    const expected = createHmac('sha256', secret).update(rawBody).digest('hex')
    const sigBuf = Buffer.from(signature, 'hex')
    const expBuf = Buffer.from(expected, 'hex')
    if (sigBuf.length !== expBuf.length) return false
    return timingSafeEqual(sigBuf, expBuf)
  } catch {
    return false
  }
}
