'use client'
import { create } from 'zustand'
import type { AuthUser } from '@/types'
import { storeAuth, clearAuth } from '@/lib/auth'

interface AuthStore {
  user: AuthUser | null
  isAuthenticated: boolean
  setUser: (user: AuthUser) => void
  logout: () => void
  hydrate: (user: AuthUser | null) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => {
    storeAuth(user)
    set({ user, isAuthenticated: true })
  },
  logout: () => {
    clearAuth()
    set({ user: null, isAuthenticated: false })
  },
  hydrate: (user) => {
    set({ user, isAuthenticated: !!user })
  },
}))
