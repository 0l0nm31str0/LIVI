// Beluga payload helpers — field formats per Shareable Beluga Skeleton API Documentation.

export type BelugaSex = 'Male' | 'Female' | 'Other'

export interface BelugaPatientPreference {
  name: string
  strength: string
  quantity: string
  refills: string
  daysSupply?: string
  medId: string
}

export interface BelugaFormObj {
  consentsSigned: true
  firstName: string
  lastName: string
  dob: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  zip: string
  sex: BelugaSex
  selfReportedMeds: string
  allergies: string
  medicalConditions: string
  patientPreference: BelugaPatientPreference[]
  [key: string]: unknown
}

export function toBelugaDob(iso: string): string {
  const parts = iso.split('-')
  if (parts.length === 3) return `${parts[1]}/${parts[2]}/${parts[0]}`
  return iso
}

export function toBelugaPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 10 ? digits.slice(-10) : digits
}

export function toBelugaSex(gender: string): BelugaSex {
  const g = gender.trim().toLowerCase()
  if (g === 'male' || g === 'm') return 'Male'
  if (g === 'female' || g === 'f') return 'Female'
  return 'Other'
}

export function toBelugaState(state: string): string {
  return state.trim().toUpperCase().slice(0, 2)
}

function nonEmpty(value: unknown, fallback = 'None'): string {
  const s = value == null ? '' : String(value).trim()
  return s || fallback
}

export function defaultPatientPreference(): BelugaPatientPreference {
  return {
    name: process.env.BELUGA_DEFAULT_MED_NAME ?? 'Patient preference pending',
    strength: process.env.BELUGA_DEFAULT_MED_STRENGTH ?? 'N/A',
    quantity: process.env.BELUGA_DEFAULT_MED_QUANTITY ?? '1',
    refills: process.env.BELUGA_DEFAULT_MED_REFILLS ?? '0',
    daysSupply: process.env.BELUGA_DEFAULT_MED_DAYS_SUPPLY ?? '30',
    medId: process.env.BELUGA_DEFAULT_MED_ID ?? 'N/A',
  }
}

export function buildFormObj(input: {
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
  patient_email: string
  questionnaire?: Record<string, unknown>
  chief_complaint?: string
}): BelugaFormObj {
  const q = input.questionnaire ?? {}
  const formObj: BelugaFormObj = {
    consentsSigned: true,
    firstName: input.profile.first_name.trim().slice(0, 100),
    lastName: input.profile.last_name.trim().slice(0, 100),
    dob: toBelugaDob(input.profile.date_of_birth),
    phone: toBelugaPhone(input.profile.phone),
    email: input.patient_email.trim(),
    address: nonEmpty(input.profile.address_line1, 'Address on file'),
    city: nonEmpty(input.profile.city, 'City'),
    state: toBelugaState(nonEmpty(input.profile.state, 'CA')),
    zip: nonEmpty(input.profile.zip, '00000').replace(/\D/g, '').slice(0, 5),
    sex: toBelugaSex(input.profile.gender),
    selfReportedMeds: nonEmpty(q.current_medications ?? q.selfReportedMeds, 'None'),
    allergies: nonEmpty(q.allergies, 'None'),
    medicalConditions: nonEmpty(q.existing_conditions ?? q.medicalConditions, 'None'),
    patientPreference: [defaultPatientPreference()],
  }

  let n = 1
  const pairs: Array<[string, unknown]> = [
    ['Chief complaint', input.chief_complaint],
    ['Symptoms', q.symptoms],
    ['Duration', q.duration],
    ['Severity', q.severity],
    ['Pregnant or nursing', q.pregnant],
    ['Additional notes', q.additional_notes],
  ]

  for (const [question, answer] of pairs) {
    const a = nonEmpty(answer, '')
    if (!a) continue
    formObj[`Q${n}`] = question
    formObj[`A${n}`] = a
    n += 1
  }

  return formObj
}
