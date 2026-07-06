'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CheckCircle, ClipboardList, Loader2, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { getProductBySlug } from '@/lib/products/catalog'
import { toast } from '@/hooks/use-toast'
import type { MarketplaceOrder } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

const STEPS = ['Selected', 'Intake', 'Checkout', 'Review', 'Delivered']

export default function IntakePage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.orderId as string

  const [order, setOrder] = useState<MarketplaceOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/marketplace/orders/${orderId}`)
      const json = await res.json()
      if (json.success) setOrder(json.data)
    } finally {
      setLoading(false)
    }
  }, [orderId])

  useEffect(() => { fetchOrder() }, [fetchOrder])

  // If already past intake, redirect to checkout
  useEffect(() => {
    if (!order) return
    if (order.status === 'intake_complete' || order.status === 'checkout_pending') {
      router.replace(`/checkout/prescription/${orderId}`)
    }
  }, [order, orderId, router])

  async function completeIntake() {
    setCompleting(true)
    try {
      const res = await fetch(`/api/marketplace/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'intake_complete',
          intake_completed_at: new Date().toISOString(),
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error ?? 'Failed to complete intake')
      toast({ title: 'Intake complete! Proceeding to checkout.' })
      router.push(`/checkout/prescription/${orderId}`)
    } catch (e) {
      toast({ variant: 'destructive', title: e instanceof Error ? e.message : 'Something went wrong' })
    } finally {
      setCompleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner className="h-8 w-8 text-[#E85A2B]" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Order not found.</p>
          <Link href="/shop" className="mt-2 inline-block text-sm text-[#E85A2B] underline">Back to shop</Link>
        </div>
      </div>
    )
  }

  const product = getProductBySlug(order.product_slug)
  const currentStep = 1 // Intake step

  return (
    <div className="min-h-screen bg-[#F6F3EE]">
      {/* Header */}
      <header className="border-b border-border/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/assets/Transparent-02.png" alt="LIVI" width={28} height={28} className="h-7 w-auto" />
            <span className="font-display text-lg font-semibold text-foreground">LIVI</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* Progress stepper */}
        <div className="mb-10">
          <div className="flex items-center">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      i < currentStep
                        ? 'bg-[#E85A2B] text-white'
                        : i === currentStep
                        ? 'bg-[#E85A2B] text-white ring-4 ring-[#E85A2B]/20'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {i < currentStep ? <CheckCircle className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`mt-1.5 text-xs whitespace-nowrap ${i === currentStep ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                    {step}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 mt-[-10px] ${i < currentStep ? 'bg-[#E85A2B]' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_340px]">
          {/* Intake card */}
          <div className="rounded-2xl border border-border bg-white p-8">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E85A2B]/10">
              <ClipboardList className="h-6 w-6 text-[#E85A2B]" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">Medical intake</h1>
            <p className="mt-2 text-muted-foreground">
              {product?.name ? `For ${product.name} — ` : ''}
              Medical intake is hosted securely by Beluga Health, our clinical partner.
            </p>

            {/* Demo mode placeholder */}
            <div className="mt-6 rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-center">
              <ShieldCheck className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="font-medium text-foreground">Medical intake hosted by Beluga Health</p>
              <p className="mt-1 text-sm text-muted-foreground">
                In production, a Beluga-hosted intake form appears here. Your responses go directly to the physician — LIVI never stores medical intake answers.
              </p>
              <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800 text-left">
                <strong>Demo mode active:</strong> Click &ldquo;Complete intake&rdquo; to simulate finishing the medical questionnaire and proceed to checkout.
              </div>
            </div>

            <Button
              size="lg"
              className="mt-8 w-full bg-[#E85A2B] hover:bg-[#d14f25] text-white border-0 py-6 text-base"
              onClick={completeIntake}
              disabled={completing}
            >
              {completing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Complete intake'}
            </Button>
          </div>

          {/* Product summary */}
          <div className="space-y-4">
            {product && (
              <div className="rounded-2xl border border-border bg-white p-5">
                <div className="relative mb-4 aspect-video overflow-hidden rounded-xl bg-[#F6F3EE]">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                <h3 className="font-semibold text-foreground">{product.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-white p-5 space-y-3">
              <h4 className="text-sm font-semibold text-foreground">What happens next</h4>
              {['Complete this intake form', 'Secure checkout', 'Physician reviews your case', 'Prescription issued', 'Delivered to your door'].map((step, i) => (
                <div key={step} className="flex items-start gap-3 text-sm">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E85A2B]/10 text-xs font-bold text-[#E85A2B]">{i + 1}</div>
                  <span className={i === 0 ? 'font-medium text-[#E85A2B]' : 'text-muted-foreground'}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
