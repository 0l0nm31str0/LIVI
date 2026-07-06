'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { getRoleDashboard } from '@/lib/auth'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { AlertBanner } from '@/components/shared/AlertBanner'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthBrandPanel } from '@/components/marketing/AuthBrandPanel'
import type { AuthUser } from '@/types'

// Marketplace MVP: only patient demo shown (doctor/pharmacy hidden)
const demoUsers = [
  { label: 'Patient (Kesh demo)', email: 'marcus@example.com', password: 'password123' },
]

export default function LoginPage() {
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [demoOpen, setDemoOpen] = useState(false)

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
        const message = json.error?.message ?? 'Login failed'
        setError(message)
        toast({ variant: 'destructive', title: message })
      } else {
        const user = json.data as AuthUser
        setUser(user)
        router.push(getRoleDashboard(user.role))
      }
    } catch {
      const message = 'Something went wrong. Please try again.'
      setError(message)
      toast({ variant: 'destructive', title: message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <AuthBrandPanel
        title="Own your longevity."
        description="Sign in to manage your treatments, subscriptions, and deliveries."
      />

      <div className="flex flex-1 items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm page-enter">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="font-display text-xl font-semibold text-foreground">
              LIVI
            </Link>
          </div>

          <Card className="border-border shadow-elevated">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold">Welcome back</CardTitle>
              <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPw ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                      placeholder="Your password"
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

                {error && <AlertBanner variant="error" title={error} />}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full transition-opacity duration-200 disabled:opacity-60"
                >
                  {loading ? <LoadingSpinner className="text-white" /> : 'Sign in'}
                </Button>
              </form>

              <div className="mt-6 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setDemoOpen(!demoOpen)}
                  className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  aria-expanded={demoOpen}
                >
                  Try demo accounts
                  {demoOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                <div className="demo-collapse mt-3" data-open={demoOpen}>
                  <div className="overflow-hidden">
                    <div className="flex flex-col gap-2">
                      {demoUsers.map((u) => (
                        <Button
                          key={u.email}
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="justify-start text-xs"
                          onClick={() => {
                            setEmail(u.email)
                            setPassword(u.password)
                          }}
                        >
                          {u.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-sage hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
