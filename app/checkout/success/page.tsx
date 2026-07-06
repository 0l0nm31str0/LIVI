'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

function SuccessContent() {
  const params = useSearchParams()
  const router = useRouter()
  const orderId = params.get('orderId')
  const demo = params.get('demo')

  useEffect(() => {
    // If real Stripe session, advance the order status
    const sessionId = params.get('session_id')
    if (sessionId && orderId) {
      // Stripe webhook will handle the status update; no client action needed
    }
    // Demo: auto-advance to under_review after 2s
    if (demo && orderId) {
      const t = setTimeout(async () => {
        await fetch(`/api/marketplace/orders/${orderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'under_review' }),
        })
      }, 2000)
      return () => clearTimeout(t)
    }
  }, [orderId, demo, params])

  return (
    <div className="min-h-screen bg-[#F6F3EE] flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#E85A2B]/10">
          <CheckCircle className="h-10 w-10 text-[#E85A2B]" />
        </div>

        <div className="mb-4">
          <Image
            src="/images/assets/Transparent-02.png"
            alt="LIVI"
            width={32}
            height={32}
            className="mx-auto h-8 w-auto mb-4"
          />
        </div>

        <h1 className="font-display text-3xl font-bold text-foreground">Order confirmed!</h1>
        <p className="mt-3 text-muted-foreground">
          Your order has been received. {demo ? 'A physician will review your intake shortly.' : 'Check your email for confirmation.'}
        </p>

        {orderId && (
          <div className="mt-6 rounded-xl border border-border bg-white p-4 text-left">
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 shrink-0 text-[#E85A2B] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">What happens next</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>1. A licensed physician reviews your case</li>
                  <li>2. Prescription issued if approved</li>
                  <li>3. Compounded medication shipped discreetly</li>
                  <li>4. Delivered to your door in 5–7 business days</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <Link href="/patient/dashboard">
            <Button size="lg" className="w-full bg-[#E85A2B] hover:bg-[#d14f25] text-white border-0">
              Go to dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          {orderId && (
            <Link href={`/patient/orders/${orderId}`}>
              <Button variant="outline" size="lg" className="w-full">
                View order status
              </Button>
            </Link>
          )}
          <Link href="/shop">
            <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
              Continue shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
