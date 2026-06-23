import type { AuthUser } from '@/types'

const STORAGE_KEY = 'livi_auth'

export function getStoredAuth(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function storeAuth(user: AuthUser) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function clearAuth() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

export function getRoleDashboard(role: string) {
  switch (role) {
    case 'patient': return '/patient/dashboard'
    case 'doctor': return '/doctor/dashboard'
    case 'pharmacy_manager': return '/pharmacy/dashboard'
    default: return '/login'
  }
}
