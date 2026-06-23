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

export interface MedicalHistory {
  id: string
  patient_id: string
  allergies: string
  conditions: string[]
  current_medications: string[]
  notes: string
  updated_at: string
}

export interface Doctor extends User {
  specialty?: string
  license_number?: string
  bio?: string
  rating?: number
  available?: boolean
}

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  first_name: string
  last_name: string
}
