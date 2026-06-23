'use client'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { getStoredAuth } from '@/lib/auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate)

  useEffect(() => {
    hydrate(getStoredAuth())
  }, [hydrate])

  return <>{children}</>
}
