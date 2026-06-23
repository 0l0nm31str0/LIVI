import {
  MOCK_USERS,
  MOCK_APPOINTMENTS,
  MOCK_PRESCRIPTIONS,
  MOCK_MEDICATIONS,
  MOCK_PHARMACIES,
  MOCK_ORDERS,
  MOCK_MEDICAL_HISTORY,
  MOCK_DOCTORS,
} from './mock-data'
import type { User, Appointment, Prescription, Medication, Pharmacy, Order, MedicalHistory, Doctor } from '@/types'

const db = {
  users: [...MOCK_USERS] as User[],
  doctors: [...MOCK_DOCTORS] as Doctor[],
  appointments: [...MOCK_APPOINTMENTS] as Appointment[],
  prescriptions: [...MOCK_PRESCRIPTIONS] as Prescription[],
  medications: [...MOCK_MEDICATIONS] as Medication[],
  pharmacies: [...MOCK_PHARMACIES] as Pharmacy[],
  orders: [...MOCK_ORDERS] as Order[],
  medical_history: [...MOCK_MEDICAL_HISTORY] as MedicalHistory[],
}

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export const usersDb = {
  findByEmail: (email: string) => db.users.find((u) => u.email === email) ?? null,
  findById: (id: string) => db.users.find((u) => u.id === id) ?? null,
  getAll: () => db.users,
}

export const doctorsDb = {
  getAll: () => db.doctors,
  findById: (id: string) => db.doctors.find((d) => d.id === id) ?? null,
}

export const appointmentsDb = {
  getAll: () => db.appointments,
  findById: (id: string) => db.appointments.find((a) => a.id === id) ?? null,
  byPatient: (patientId: string) => db.appointments.filter((a) => a.patient_id === patientId),
  byDoctor: (doctorId: string) => db.appointments.filter((a) => a.doctor_id === doctorId),
  create: (data: Omit<Appointment, 'id' | 'created_at'>) => {
    const apt: Appointment = { ...data, id: generateId('apt'), created_at: new Date().toISOString() }
    db.appointments.push(apt)
    return apt
  },
  update: (id: string, data: Partial<Appointment>) => {
    const idx = db.appointments.findIndex((a) => a.id === id)
    if (idx === -1) return null
    db.appointments[idx] = { ...db.appointments[idx], ...data }
    return db.appointments[idx]
  },
}

export const prescriptionsDb = {
  getAll: () => db.prescriptions,
  findById: (id: string) => db.prescriptions.find((p) => p.id === id) ?? null,
  byPatient: (patientId: string) => db.prescriptions.filter((p) => p.patient_id === patientId),
  byDoctor: (doctorId: string) => db.prescriptions.filter((p) => p.doctor_id === doctorId),
  byPharmacy: (pharmacyId: string) => db.prescriptions.filter((p) => p.pharmacy_id === pharmacyId),
  create: (data: Omit<Prescription, 'id' | 'created_at'>) => {
    const rx: Prescription = { ...data, id: generateId('rx'), created_at: new Date().toISOString() }
    db.prescriptions.push(rx)
    return rx
  },
  update: (id: string, data: Partial<Prescription>) => {
    const idx = db.prescriptions.findIndex((p) => p.id === id)
    if (idx === -1) return null
    db.prescriptions[idx] = { ...db.prescriptions[idx], ...data }
    return db.prescriptions[idx]
  },
}

export const medicationsDb = {
  getAll: () => db.medications,
  findById: (id: string) => db.medications.find((m) => m.id === id) ?? null,
  search: (query: string) =>
    db.medications.filter(
      (m) =>
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.active_ingredient.toLowerCase().includes(query.toLowerCase())
    ),
}

export const pharmaciesDb = {
  getAll: () => db.pharmacies.filter((p) => p.is_active),
  findById: (id: string) => db.pharmacies.find((p) => p.id === id) ?? null,
  search: (city?: string, state?: string) =>
    db.pharmacies.filter((p) => {
      if (!p.is_active) return false
      if (city && !p.city.toLowerCase().includes(city.toLowerCase())) return false
      if (state && p.state.toLowerCase() !== state.toLowerCase()) return false
      return true
    }),
  byManager: (managerId: string) => db.pharmacies.find((p) => p.manager_id === managerId) ?? null,
}

export const ordersDb = {
  getAll: () => db.orders,
  findById: (id: string) => db.orders.find((o) => o.id === id) ?? null,
  byPatient: (patientId: string) => db.orders.filter((o) => o.patient_id === patientId),
  byPharmacy: (pharmacyId: string) => db.orders.filter((o) => o.pharmacy_id === pharmacyId),
  create: (data: Omit<Order, 'id' | 'created_at'>) => {
    const order: Order = { ...data, id: generateId('order'), created_at: new Date().toISOString() }
    db.orders.push(order)
    return order
  },
  update: (id: string, data: Partial<Order>) => {
    const idx = db.orders.findIndex((o) => o.id === id)
    if (idx === -1) return null
    db.orders[idx] = { ...db.orders[idx], ...data }
    return db.orders[idx]
  },
}

export const medicalHistoryDb = {
  byPatient: (patientId: string) => db.medical_history.find((h) => h.patient_id === patientId) ?? null,
  update: (patientId: string, data: Partial<MedicalHistory>) => {
    const idx = db.medical_history.findIndex((h) => h.patient_id === patientId)
    if (idx === -1) return null
    db.medical_history[idx] = { ...db.medical_history[idx], ...data, updated_at: new Date().toISOString() }
    return db.medical_history[idx]
  },
}
