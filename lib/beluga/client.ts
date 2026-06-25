// Beluga Health API client — aligned with official Beluga documentation.
// Auth: Authorization: Bearer {BELUGA_API_KEY}
// Staging: https://api-staging.belugahealth.com
// Production: https://api.belugahealth.com

import { createHmac, randomUUID, timingSafeEqual } from 'crypto'
import { buildFormObj, type BelugaFormObj } from './transform'

const BASE = () => process.env.BELUGA_API_URL ?? 'https://api-staging.belugahealth.com'

function getKey(): string {
  const key = process.env.BELUGA_API_KEY
  if (!key) throw new Error('BELUGA_API_KEY is not configured')
  return key
}

function visitEndpoint(): string {
  const path = process.env.BELUGA_VISIT_ENDPOINT ?? '/visit/createNoPay'
  return path.startsWith('/') ? path : `/${path}`
}

function chatEndpoint(): string {
  const path = process.env.BELUGA_CHAT_ENDPOINT ?? '/external/receiveChat'
  return path.startsWith('/') ? path : `/${path}`
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

  const text = await res.text()
  let parsed: Record<string, unknown> = {}
  if (text) {
    try {
      parsed = JSON.parse(text) as Record<string, unknown>
    } catch {
      if (!res.ok) throw new BelugaError(res.status, text, path)
      throw new BelugaError(res.status, 'Invalid JSON response', path)
    }
  }

  const bodyStatus = parsed.status
  if (bodyStatus === 400 || bodyStatus === '400') {
    const msg = String(parsed.error ?? parsed.info ?? text)
    throw new BelugaError(400, msg, path)
  }

  if (!res.ok) {
    throw new BelugaError(res.status, text || res.statusText, path)
  }

  return parsed as T
}

// ─── Visit creation (masterId flow — no ID photos) ───────────────────────────

export interface BelugaCreateVisitInput {
  masterId?: string
  patient_email: string
  chief_complaint?: string
  questionnaire?: Record<string, unknown>
  profile: {
    first_name: string
    last_name: string
    date_of_birth: string
    phone: string
    gender: string
    address_line1: string
    city: string
    state: string
    zip: string
  }
  visitType?: string
  pharmacyId?: string
  company?: string
}

export interface BelugaVisitCreateResult {
  masterId: string
  visitId: string | null
  raw: Record<string, unknown>
}

export const belugaVisits = {
  async create(input: BelugaCreateVisitInput): Promise<BelugaVisitCreateResult> {
    const masterId = input.masterId ?? randomUUID()
    const formObj = buildFormObj({
      profile: input.profile,
      patient_email: input.patient_email,
      questionnaire: input.questionnaire,
      chief_complaint: input.chief_complaint,
    })

    const payload = {
      formObj,
      pharmacyId: input.pharmacyId ?? process.env.BELUGA_PHARMACY_ID ?? '',
      masterId,
      company: input.company ?? process.env.BELUGA_COMPANY ?? 'livi',
      visitType: input.visitType ?? process.env.BELUGA_VISIT_TYPE ?? 'weightloss',
    }

    if (!payload.pharmacyId) {
      throw new BelugaError(400, 'BELUGA_PHARMACY_ID is not configured', visitEndpoint())
    }

    const res = await belugaFetch<Record<string, unknown>>(visitEndpoint(), {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    let visitId: string | null = null
    const data = res.data
    if (typeof data === 'string') {
      visitId = data
    } else if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>
      visitId = typeof obj.visitId === 'string' ? obj.visitId : null
    }

    return { masterId, visitId, raw: res }
  },

  fetch(masterId: string) {
    return belugaFetch<Record<string, unknown>>(`/visit/externalFetch/${encodeURIComponent(masterId)}`)
  },
}

// ─── Patient lookup ──────────────────────────────────────────────────────────

export const belugaPatients = {
  fetchByPhone(phone: string) {
    const digits = phone.replace(/\D/g, '').slice(-10)
    return belugaFetch<Record<string, unknown>>(`/patient/externalFetch/${digits}`)
  },
}

// ─── Prescription update / resend ────────────────────────────────────────────

export interface BelugaUpdateVisitInput {
  masterId: string
  patientPreference: Array<{
    name: string
    strength: string
    quantity: string
    refills: string
    daysSupply?: string
    medId: string
  }>
  pharmacyId?: string
}

export const belugaRx = {
  updateVisit(input: BelugaUpdateVisitInput) {
    return belugaFetch<Record<string, unknown>>('/external/updateVisit', {
      method: 'POST',
      body: JSON.stringify({
        patientPreference: input.patientPreference,
        pharmacyId: input.pharmacyId ?? process.env.BELUGA_PHARMACY_ID ?? '',
        masterId: input.masterId,
        apiKey: getKey(),
      }),
    })
  },
}

// ─── Patient chat ─────────────────────────────────────────────────────────────

export const belugaMessaging = {
  sendPatientChat(input: {
    masterId: string
    firstName: string
    lastName: string
    content: string
    isMedia?: boolean
  }) {
    return belugaFetch<Record<string, unknown>>(chatEndpoint(), {
      method: 'POST',
      body: JSON.stringify({
        firstName: input.firstName,
        lastName: input.lastName,
        content: input.content,
        isMedia: input.isMedia ?? false,
        masterId: input.masterId,
      }),
    })
  },
}

// ─── Webhook signature verification ──────────────────────────────────────────

export function verifyBelugaWebhook(rawBody: string, signature: string): boolean {
  const secret = process.env.BELUGA_WEBHOOK_SECRET
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

export type { BelugaFormObj }
