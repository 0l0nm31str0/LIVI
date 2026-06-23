'use client'
import Link from 'next/link'
import { Activity } from 'lucide-react'

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-700">
          <Activity className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Create an account</h1>
        <p className="text-sm text-muted-foreground mb-8">Sign up is available in the full platform. Use the demo login to explore all features.</p>
        <Link href="/login" className="btn-primary w-full justify-center py-2.5">
          Go to sign in
        </Link>
      </div>
    </div>
  )
}
