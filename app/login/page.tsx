'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Activity, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { getRoleDashboard } from '@/lib/auth'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import type { AuthUser } from '@/types'

const demoUsers = [
  { label: 'Patient (Marcus)', email: 'marcus@example.com', password: 'password123' },
  { label: 'Doctor (Dr. Patel)', email: 'dr.patel@example.com', password: 'password123' },
  { label: 'Pharmacy Manager (Sarah)', email: 'sarah@cvs.com', password: 'password123' },
]

export default function LoginPage() {
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const json = await res.json()
      if (!json.success) {
        setError(json.error?.message ?? 'Login failed')
      } else {
        const user = json.data as AuthUser
        setUser(user)
        router.push(getRoleDashboard(user.role))
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function loginAsDemo(demoEmail: string, demoPw: string) {
    setEmail(demoEmail)
    setPassword(demoPw)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-700">
            <Activity className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome to LIVI</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your account</p>
        </div>

        <div className="mb-6 rounded-lg border border-border bg-primary-50 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary-700">Quick demo access</p>
          <div className="flex flex-col gap-2">
            {demoUsers.map((u) => (
              <button
                key={u.email}
                type="button"
                onClick={() => loginAsDemo(u.email, u.password)}
                className="btn-secondary text-xs py-1.5 justify-start"
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleLogin} className="card p-6">
          <div className="mb-4">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="you@example.com"
            />
          </div>
          <div className="mb-6">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input pr-10"
                placeholder="password123"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-md border-l-4 border-destructive bg-red-50 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
            {loading ? <LoadingSpinner className="text-white" /> : 'Sign in'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-primary-700 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
