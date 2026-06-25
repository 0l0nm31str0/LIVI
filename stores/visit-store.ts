'use client'
import { create } from 'zustand'
import type { Visit, VisitMessage } from '@/types'

interface VisitStore {
  visits: Visit[]
  activeVisit: Visit | null
  messages: VisitMessage[]
  loading: boolean
  error: string | null

  fetchVisits: (patientId: string) => Promise<void>
  fetchVisit: (visitId: string) => Promise<void>
  fetchMessages: (visitId: string) => Promise<void>
  sendMessage: (visitId: string, message: string) => Promise<void>
  createVisit: (data: CreateVisitPayload) => Promise<Visit | null>
  clearError: () => void
}

export interface CreateVisitPayload {
  patient_id: string
  patient_email: string
  visit_type: 'async' | 'sync'
  chief_complaint: string
  questionnaire: Record<string, unknown>
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
}

export const useVisitStore = create<VisitStore>((set, get) => ({
  visits: [],
  activeVisit: null,
  messages: [],
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  async fetchVisits(patientId: string) {
    set({ loading: true })
    try {
      const res = await fetch(`/api/visits?patient_id=${patientId}`)
      const d = await res.json()
      set({ visits: d.data ?? [], loading: false })
    } catch (e) {
      set({ error: String(e), loading: false })
    }
  },

  async fetchVisit(visitId: string) {
    set({ loading: true })
    try {
      const res = await fetch(`/api/visits/${visitId}`)
      const d = await res.json()
      set({ activeVisit: d.data ?? null, loading: false })
    } catch (e) {
      set({ error: String(e), loading: false })
    }
  },

  async fetchMessages(visitId: string) {
    try {
      const res = await fetch(`/api/visits/${visitId}/messages`)
      const d = await res.json()
      set({ messages: d.data ?? [] })
    } catch (e) {
      set({ error: String(e) })
    }
  },

  async sendMessage(visitId: string, message: string) {
    try {
      await fetch(`/api/visits/${visitId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      await get().fetchMessages(visitId)
    } catch (e) {
      set({ error: String(e) })
    }
  },

  async createVisit(data: CreateVisitPayload) {
    set({ loading: true, error: null })
    try {
      const res = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const d = await res.json()
      if (!d.success) throw new Error(d.error?.message ?? 'Failed to create visit')
      const visit = d.data as Visit
      set(s => ({ visits: [visit, ...s.visits], activeVisit: visit, loading: false }))
      return visit
    } catch (e) {
      set({ error: String(e), loading: false })
      return null
    }
  },
}))
