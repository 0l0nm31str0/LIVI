// Beluga Health API client
// Auth: Bearer token via BELUGA_API_KEY env var
// All functions are server-side only.

const BASE = () => process.env.BELUGA_API_URL ?? 'https://api.belugahealth.com/v1'

function getKey(): string {
  const key = process.env.BELUGA_API_KEY
  if (!key) throw new Error('BELUGA_API_KEY is not configured')
  return key
}

async function belugaFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${BASE()}${path}`
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${getKey()}`,
      ...(init.headers as Record<string, string>),
    },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new BelugaError(res.status, body, path)
  }

  const text = await res.text()
  return text ? (JSON.parse(text) as T) : ({} as T)
}

export class BelugaError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: string,
    public readonly endpoint: string
  ) {
    super(`Beluga ${status} @ ${endpoint}: ${body}`)
    this.name = 'BelugaError'
  }
}

// ─── Patient ─────────────────────────────────────────────────────────────────

export interface BelugaCreatePatientInput {
  external_id: string       // LIVI user ID
  email: string
  first_name: string
  last_name: string
  date_of_birth: string     // YYYY-MM-DD
  phone: string
  gender: string
  address: {
    line1: string
    city: string
    state: string
    zip: string
  }
}

export interface BelugaPatientResponse {
  id: string
  external_id: string
  email: string
  first_name: string
  last_name: string
  created_at: string
}

export const belugaPatients = {
  create(data: BelugaCreatePatientInput) {
    return belugaFetch<BelugaPatientResponse>('/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  get(belugaPatientId: string) {
    return belugaFetch<BelugaPatientResponse>(`/patients/${belugaPatientId}`)
  },

  findByExternalId(liviUserId: string) {
    return belugaFetch<{ patients: BelugaPatientResponse[] }>(
      `/patients?external_id=${encodeURIComponent(liviUserId)}`
    )
  },
}

// ─── Visits ──────────────────────────────────────────────────────────────────

export interface BelugaCreateVisitInput {
  patient_id: string              // Beluga patient ID
  visit_type: string              // 'async' | 'sync'
  questionnaire: Record<string, unknown>
  scheduled_at?: string           // ISO-8601 for sync visits
}

export interface BelugaVisitResponse {
  id: string
  patient_id: string
  doctor_id: string | null
  status: string
  visit_type: string
  questionnaire: Record<string, unknown>
  zoom_link: string | null
  created_at: string
  updated_at: string
}

export const belugaVisits = {
  create(data: BelugaCreateVisitInput) {
    return belugaFetch<BelugaVisitResponse>('/visits', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  get(visitId: string) {
    return belugaFetch<BelugaVisitResponse>(`/visits/${visitId}`)
  },

  list(params: Record<string, string> = {}) {
    const qs = new URLSearchParams(params).toString()
    return belugaFetch<{ visits: BelugaVisitResponse[]; total: number }>(
      `/visits${qs ? '?' + qs : ''}`
    )
  },
}

// ─── Prescriptions ───────────────────────────────────────────────────────────

export interface BelugaCreateRxInput {
  medication_name: string
  ndc_code?: string
  dosage: string
  quantity: number
  refills: number
  days_supply: number
  special_instructions?: string
  pharmacy_npi?: string
}

export interface BelugaRxResponse {
  id: string
  visit_id: string
  patient_id: string
  doctor_id: string
  doctor_first_name: string
  doctor_last_name: string
  doctor_npi: string
  medication_name: string
  ndc_code: string
  dosage: string
  quantity: number
  refills: number
  days_supply: number
  special_instructions: string
  written_at: string
}

export const belugaRx = {
  write(visitId: string, data: BelugaCreateRxInput) {
    return belugaFetch<BelugaRxResponse>(`/visits/${visitId}/prescriptions`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  list(visitId: string) {
    return belugaFetch<{ prescriptions: BelugaRxResponse[] }>(
      `/visits/${visitId}/prescriptions`
    )
  },

  get(visitId: string, rxId: string) {
    return belugaFetch<BelugaRxResponse>(`/visits/${visitId}/prescriptions/${rxId}`)
  },
}

// ─── Messaging ───────────────────────────────────────────────────────────────

export interface BelugaMessageResponse {
  id: string
  visit_id: string
  sender_id: string
  sender_type: 'patient' | 'doctor' | 'system'
  message: string
  created_at: string
}

export const belugaMessaging = {
  send(visitId: string, message: string, sender_type: 'patient' | 'doctor') {
    return belugaFetch<BelugaMessageResponse>(`/visits/${visitId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message, sender_type }),
    })
  },

  list(visitId: string) {
    return belugaFetch<{ messages: BelugaMessageResponse[] }>(
      `/visits/${visitId}/messages`
    )
  },
}

// ─── Webhook Signature Verification ─────────────────────────────────────────

import { createHmac, timingSafeEqual } from 'crypto'

export function verifyBelugaWebhook(rawBody: string, signature: string): boolean {
  const secret = process.env.BELUGA_WEBHOOK_SECRET
  if (!secret) return true // Skip verification if secret not configured
  try {
    const expected = createHmac('sha256', secret).update(rawBody).digest('hex')
    const sigBuf = Buffer.from(signature.replace('sha256=', ''), 'hex')
    const expBuf = Buffer.from(expected, 'hex')
    if (sigBuf.length !== expBuf.length) return false
    return timingSafeEqual(sigBuf, expBuf)
  } catch {
    return false
  }
}
