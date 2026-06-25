// ─── Core User Types ─────────────────────────────────────────────────────────

export type UserRole = 'patient' | 'doctor' | 'pharmacy_manager' | 'admin'

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: UserRole
  phone: string
  date_of_birth: string
  created_at: string
}

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  first_name: string
  last_name: string
}

export interface Doctor extends User {
  specialty?: string
  license_number?: string
  bio?: string
  rating?: number
  available?: boolean
}

export interface MedicalHistory {
  id: string
  patient_id: string
  allergies: string
  conditions: string[]
  current_medications: string[]
  notes: string
  updated_at: string
}

// ─── Legacy Mock Types (kept for backward compat during migration) ────────────

export interface Appointment {
  id: string
  patient_id: string
  doctor_id: string
  appointment_date: string
  status: 'scheduled' | 'completed' | 'cancelled'
  zoom_link: string
  notes: string
  created_at: string
}

export type PrescriptionStatus =
  | 'pending'
  | 'sent_to_pharmacy'
  | 'pharmacy_confirmed'
  | 'ordered'
  | 'fulfilled'

export interface Prescription {
  id: string
  patient_id: string
  doctor_id: string
  appointment_id: string
  medication_id: string
  dosage: string
  quantity: number
  refills: number
  special_instructions: string
  status: PrescriptionStatus
  pharmacy_id: string | null
  prescribed_date: string
  created_at: string
}

export type MedicationForm = 'tablet' | 'capsule' | 'liquid' | 'cream' | 'injection'

export interface Medication {
  id: string
  name: string
  active_ingredient: string
  strength: string
  form: MedicationForm
  ndc_code: string
}

export interface Pharmacy {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip_code: string
  phone: string
  email: string
  npi_number: string
  legit_script_id: string
  manager_id: string
  is_active: boolean
  created_at: string
}

export type OrderStatus =
  | 'pending_payment'
  | 'payment_confirmed'
  | 'preparing'
  | 'shipped'
  | 'delivered'

export type PaymentMethod = 'credit_card' | 'debit_card' | 'insurance'

export interface Order {
  id: string
  prescription_id: string
  patient_id: string
  pharmacy_id: string
  order_date: string
  status: OrderStatus
  total_amount: number
  shipping_address: string
  tracking_number: string | null
  payment_method: PaymentMethod
  stripe_payment_id: string | null
  created_at: string
}

// ─── Beluga Health API Types ──────────────────────────────────────────────────

export interface BelugaPatient {
  id: string
  external_id: string
  email: string
  first_name: string
  last_name: string
  date_of_birth: string
  phone: string
  address: { line1: string; city: string; state: string; zip: string }
  created_at: string
}

export interface BelugaVisit {
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

export interface BelugaRx {
  id: string
  visit_id: string
  patient_id: string
  doctor_id: string
  medication_name: string
  ndc_code: string
  dosage: string
  quantity: number
  refills: number
  days_supply: number
  special_instructions: string
  written_at: string
}

export interface BelugaMessage {
  id: string
  visit_id: string
  sender_id: string
  sender_type: 'patient' | 'doctor' | 'system'
  message: string
  created_at: string
}

// ─── Curexa Pharmacy API Types ────────────────────────────────────────────────

export type CurexaOrderStatus =
  | 'new'
  | 'processing'
  | 'payment_required'
  | 'in_progress'
  | 'shipped'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled'
  | 'error'

export interface CurexaOrder {
  order_id: string
  patient_id: string
  status: CurexaOrderStatus
  tracking_number: string | null
  tracking_url: string | null
  carrier: string | null
  estimated_delivery: string | null
  created_at: string
  updated_at: string
}

// ─── LIVI Unified Visit Model ─────────────────────────────────────────────────

export type VisitStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'active'
  | 'prescribed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface PatientProfile {
  livi_user_id: string
  email: string
  first_name: string
  last_name: string
  date_of_birth?: string
  phone?: string
  gender?: string
  address_line1?: string
  city?: string
  state?: string
  zip?: string
  beluga_patient_id?: string
}

export interface Visit {
  id: string
  patient_id: string
  patient_email: string
  beluga_visit_id: string | null
  beluga_patient_id: string | null
  status: VisitStatus
  visit_type: string
  chief_complaint: string | null
  questionnaire: Record<string, unknown>
  zoom_link: string | null
  rx_written: boolean
  prescription_data: BelugaRx | null
  curexa_order_id: string | null
  curexa_order_status: CurexaOrderStatus | null
  tracking_number: string | null
  tracking_url: string | null
  carrier: string | null
  estimated_delivery: string | null
  created_at: string
  updated_at: string
}

export interface VisitMessage {
  id: string
  visit_id: string
  sender_id: string | null
  sender_name: string
  sender_type: 'patient' | 'doctor' | 'pharmacy' | 'system'
  message: string
  source: 'beluga' | 'curexa' | 'livi'
  external_id: string | null
  created_at: string
}

// ─── Visit Status Labels ──────────────────────────────────────────────────────

export const VISIT_STATUS_LABEL: Record<VisitStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under Review',
  active: 'In Consultation',
  prescribed: 'Prescription Written',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const CUREXA_STATUS_LABEL: Record<CurexaOrderStatus, string> = {
  new: 'Order Received',
  processing: 'Processing',
  payment_required: 'Payment Required',
  in_progress: 'Being Filled',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  completed: 'Delivered',
  cancelled: 'Cancelled',
  error: 'Error',
}
