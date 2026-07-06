'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CheckCircle, Loader2, CreditCard, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { AddressForm } from '@/components/checkout/AddressForm'
import { CheckoutSummary } from '@/components/checkout/CheckoutSummary'
import { toast } from '@/hooks/use-toast'
import { useAuthStore } from '@/stores/auth-store'
import type { MarketplaceOrder, ShippingAddress } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

const STEPS = ['Selected', 'Intake', 'Checkout', 'Review', 'Delivered']

export default function PrescriptionCheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const orderId = params.orderId as string

  const [order, setOrder] = useState<MarketplaceOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [address, setAddress] = useState<Partial<ShippingAddress>>({})
  const [email, setEmail] = useState(user?.email ?? '')

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/marketplace/orders/${orderId}`)
      const json = await res.json()
      if (json.success) {
        setOrder(json.data)
        if (json.data.shipping_address?.line1) setAddress(json.data.shipping_address)
      }
    } finally {
      setLoading(false)
    }
  }, [orderId])

  useEffect(() => { fetchOrder() }, [fetchOrder])

  // Gate: redirect to intake if not complete
  useEffect(() => {
    if (!order) return
    if (order.status === 'intake_pending') {
      router.replace(`/intake/${orderId}`)
    }
  }, [order, orderId, router])

  async function handlePay(e: React.FormEvent) {
    e.preventDefault()
    if (!address.line1 || !address.city || !address.state || !address.zip) {
      toast({ variant: 'destructive', title: 'Please complete your shipping address.' })
      return
    }
    setPaying(true)

    try {
      // Save address to order
      await fetch(`/api/marketplace/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipping_address: address,
          patient_email: email || user?.email,
          status: 'checkout_pending',
        }),
      })

      // Create Stripe/mock checkout session
      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error ?? 'Checkout failed')

      // Redirect to Stripe or demo success
      window.location.href = json.data.url
    } catch (e) {
      toast({ variant: 'destructive', title: e instanceof Error ? e.message : 'Something went wrong' })
    } finally {
      setPaying(false)
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
        <p className="text-muted-foreground">Order not found. <Link href="/shop" className="text-[#E85A2B] underline">Back to shop</Link></p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F3EE]">
      <header className="border-b border-border/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/assets/Transparent-02.png" alt="LIVI" width={28} height={28} className="h-7 w-auto" />
            <span className="font-display text-lg font-semibold text-foreground">LIVI</span>
          </Link>
          <div className="ml-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" /> Secure checkout
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Stepper */}
        <div className="mb-10">
          <div className="flex items-center">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      i < 2 ? 'bg-[#E85A2B] text-white' : i === 2 ? 'bg-[#E85A2B] text-white ring-4 ring-[#E85A2B]/20' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {i < 2 ? <CheckCircle className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`mt-1.5 text-xs whitespace-nowrap ${i === 2 ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{step}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 mt-[-10px] ${i < 2 ? 'bg-[#E85A2B]' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Form */}
          <form onSubmit={handlePay} className="space-y-6">
            {/* Contact */}
            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="mb-4 font-semibold text-foreground">Contact</h2>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Shipping */}
            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="mb-4 font-semibold text-foreground">Shipping address</h2>
              <AddressForm value={address} onChange={setAddress} />
            </div>

            {/* Payment */}
            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="mb-4 font-semibold text-foreground">Payment</h2>
              <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-6 text-center">
                <CreditCard className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Demo mode: Stripe Checkout will appear here when credentials are configured.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Click &ldquo;Complete order&rdquo; to simulate payment.</p>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-[#E85A2B] hover:bg-[#d14f25] text-white border-0 py-6 text-base"
              disabled={paying}
            >
              {paying ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Complete order'}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              By completing your order, you agree to our{' '}
              <Link href="#" className="underline">Terms of Service</Link> and{' '}
              <Link href="#" className="underline">Privacy Policy</Link>.
            </p>
          </form>

          {/* Summary */}
          <div>
            <CheckoutSummary order={order} />
          </div>
        </div>
      </div>
    </div>
  )
}
