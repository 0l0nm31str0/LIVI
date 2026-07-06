'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, AlertTriangle, Loader2, FlaskConical, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SubscriptionSelector } from '@/components/shop/SubscriptionSelector'
import { getProductBySlug, formatPrice, type Product, type SubscriptionPlan } from '@/lib/products/catalog'
import { useAuthStore } from '@/stores/auth-store'
import { toast } from '@/hooks/use-toast'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const user = useAuthStore((s) => s.user)

  const slug = params.slug as string
  const product = getProductBySlug(slug)

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [autoRenew, setAutoRenew] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (product) {
      setSelectedPlan(product.plans[0])
    }
  }, [product])

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Link href="/shop" className="mt-4 inline-block text-sm text-[#E85A2B] underline">
          Back to shop
        </Link>
      </div>
    )
  }

  async function handleContinue() {
    if (!selectedPlan || !product) return
    setLoading(true)

    try {
      const res = await fetch('/api/marketplace/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: user?.id ?? null,
          patient_email: user?.email ?? 'demo@livi.com',
          product_slug: product.slug,
          product_type: product.type,
          plan_interval: selectedPlan.interval,
          auto_renew: autoRenew,
          amount_cents: selectedPlan.priceCents,
          status: product.type === 'prescription' ? 'intake_pending' : 'checkout_pending',
          shipping_address: {},
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error ?? 'Failed to create order')

      const order = json.data
      if (product.type === 'prescription') {
        router.push(`/intake/${order.id}`)
      } else {
        router.push(`/checkout/otc/${order.id}`)
      }
    } catch (e) {
      toast({ variant: 'destructive', title: e instanceof Error ? e.message : 'Something went wrong' })
    } finally {
      setLoading(false)
    }
  }

  function handlePlanSelect(plan: SubscriptionPlan, ar: boolean) {
    setSelectedPlan(plan)
    setAutoRenew(ar)
  }

  const lowestPlan = selectedPlan ?? product.plans[0]

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Link
        href={`/shop?tab=${product.type}`}
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {product.type === 'prescription' ? 'Rx Treatments' : 'OTC Products'}
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F6F3EE]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute top-4 left-4">
            <Badge
              variant="secondary"
              className={
                product.type === 'prescription'
                  ? 'bg-[#0B1210]/80 text-white border-0'
                  : 'bg-white/80 text-foreground border-0'
              }
            >
              {product.type === 'prescription' ? (
                <><FlaskConical className="h-3 w-3 mr-1" /> Prescription</>
              ) : (
                <><ShoppingBag className="h-3 w-3 mr-1" /> Over the Counter</>
              )}
            </Badge>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div>
            {product.badge && (
              <Badge className="mb-3 bg-[#E85A2B] text-white border-0">{product.badge}</Badge>
            )}
            <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              {product.longDescription}
            </p>
          </div>

          {/* Highlights */}
          <div className="mt-6 space-y-2">
            {product.highlights.map((h) => (
              <div key={h} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 shrink-0 text-[#E85A2B]" />
                <span className="text-foreground">{h}</span>
              </div>
            ))}
          </div>

          {/* Subscription selector */}
          <div className="mt-8">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Select your plan
            </h3>
            <SubscriptionSelector
              plans={product.plans}
              onSelect={handlePlanSelect}
              defaultInterval={product.plans[0]?.interval}
            />
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
              <span className="text-sm text-muted-foreground">
                {lowestPlan.label} · {autoRenew ? 'Auto-renew' : 'One-time'}
              </span>
              <span className="text-xl font-bold text-foreground">
                {formatPrice(lowestPlan.priceCents)}
              </span>
            </div>

            <Button
              size="lg"
              className="w-full bg-[#E85A2B] hover:bg-[#d14f25] text-white border-0 text-base py-6"
              onClick={handleContinue}
              disabled={loading || !selectedPlan}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : product.type === 'prescription' ? (
                'Continue to intake'
              ) : (
                'Add to cart'
              )}
            </Button>

            {product.type === 'prescription' && (
              <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>
                  This is a compounded prescription medication. A licensed physician will review your
                  intake before any prescription is issued. Individual results may vary.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
