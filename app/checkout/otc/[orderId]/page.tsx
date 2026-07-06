'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2, CreditCard, Lock } from 'lucide-react'
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

export default function OtcCheckoutPage() {
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

  async function handlePay(e: React.FormEvent) {
    e.preventDefault()
    if (!address.line1 || !address.city || !address.state || !address.zip) {
      toast({ variant: 'destructive', title: 'Please complete your shipping address.' })
      return
    }
    setPaying(true)

    try {
      await fetch(`/api/marketplace/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipping_address: address,
          patient_email: email || user?.email,
          status: 'checkout_pending',
        }),
      })

      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error ?? 'Checkout failed')
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
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Checkout</h1>
          <p className="mt-1 text-sm text-muted-foreground">No prescription required for this product.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <form onSubmit={handlePay} className="space-y-6">
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

            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="mb-4 font-semibold text-foreground">Shipping address</h2>
              <AddressForm value={address} onChange={setAddress} />
            </div>

            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="mb-4 font-semibold text-foreground">Payment</h2>
              <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-6 text-center">
                <CreditCard className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Demo mode: Stripe Checkout will appear here when credentials are configured.
                </p>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-[#E85A2B] hover:bg-[#d14f25] text-white border-0 py-6 text-base"
              disabled={paying}
            >
              {paying ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Place order'}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              By placing your order, you agree to our{' '}
              <Link href="#" className="underline">Terms of Service</Link>.
            </p>
          </form>

          <div>
            <CheckoutSummary order={order} />
          </div>
        </div>
      </div>
    </div>
  )
}
