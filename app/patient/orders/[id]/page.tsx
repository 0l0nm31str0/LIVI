'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Truck, CheckCircle, RefreshCw, Package } from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'
import { Button } from '@/components/ui/button'
import { formatDate, formatPrice } from '@/lib/utils'
import { getProductBySlug } from '@/lib/products/catalog'
import type { MarketplaceOrder } from '@/types'

const RX_STEPS = ['Selected', 'Intake', 'Paid', 'Under Review', 'Shipped', 'Delivered']
const OTC_STEPS = ['Selected', 'Paid', 'Processing', 'Shipped', 'Delivered']

function getStepIndex(order: MarketplaceOrder): number {
  const flow = order.product_type === 'prescription' ? RX_STEPS : OTC_STEPS
  const statusToStep: Record<string, number> = order.product_type === 'prescription'
    ? { cart: 0, intake_pending: 1, intake_complete: 1, checkout_pending: 1, paid: 2, under_review: 3, approved: 3, processing: 3, shipped: 4, delivered: 5 }
    : { cart: 0, checkout_pending: 0, paid: 1, processing: 2, shipped: 3, delivered: 4 }
  return statusToStep[order.status] ?? 0
}

export default function OrderDetailPage() {
  const params = useParams()
  const [order, setOrder] = useState<MarketplaceOrder | null>(null)
  const [advancing, setAdvancing] = useState(false)

  const fetchOrder = useCallback(async () => {
    const res = await fetch(`/api/marketplace/orders/${params.id}`)
    const json = await res.json()
    if (json.success) setOrder(json.data)
  }, [params.id])

  useEffect(() => { fetchOrder() }, [fetchOrder])

  async function advanceOrder() {
    setAdvancing(true)
    try {
      const res = await fetch(`/api/marketplace/orders/${params.id}/advance`, { method: 'POST' })
      const json = await res.json()
      if (json.success) setOrder(json.data)
    } finally {
      setAdvancing(false)
    }
  }

  if (!order) {
    return <div className="flex justify-center py-16"><LoadingSpinner className="h-8 w-8 text-primary" /></div>
  }

  const product = getProductBySlug(order.product_slug)
  const steps = order.product_type === 'prescription' ? RX_STEPS : OTC_STEPS
  const currentStep = getStepIndex(order)
  const isDone = ['delivered', 'cancelled', 'denied'].includes(order.status)

  return (
    <div className="max-w-2xl page-enter">
      <PageHeader
        title="Order details"
        description={order.id}
        action={<StatusBadge status={order.status} />}
      />

      {/* Progress stepper */}
      <AppCard title="Order progress" className="mb-4">
        <div className="flex items-center gap-0">
          {steps.map((step, i) => (
            <div key={step} className="flex flex-1 items-center">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                i <= currentStep ? 'bg-[#E85A2B] text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {i < currentStep ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 flex-1 ${i < currentStep ? 'bg-[#E85A2B]' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between">
          {steps.map((step) => (
            <span key={step} className="text-xs text-muted-foreground text-center" style={{ width: `${100 / steps.length}%` }}>{step}</span>
          ))}
        </div>

        {/* Demo advance button */}
        {!isDone && (
          <div className="mt-4 pt-4 border-t border-border">
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={advanceOrder}
              disabled={advancing}
            >
              {advancing ? <LoadingSpinner className="h-3 w-3" /> : <RefreshCw className="h-3 w-3 mr-1.5" />}
              Simulate next step (demo)
            </Button>
          </div>
        )}
      </AppCard>

      {/* Order summary */}
      <AppCard title="Order summary" className="mb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-xs text-muted-foreground">Product</p><p className="font-medium">{product?.name ?? order.product_slug}</p></div>
          <div><p className="text-xs text-muted-foreground">Date</p><p className="font-medium">{formatDate(order.created_at)}</p></div>
          <div><p className="text-xs text-muted-foreground">Plan</p><p className="font-medium capitalize">{order.plan_interval}</p></div>
          <div><p className="text-xs text-muted-foreground">Amount</p><p className="font-medium font-semibold">{formatPrice(order.amount_cents)}</p></div>
          <div><p className="text-xs text-muted-foreground">Type</p><p className="font-medium capitalize">{order.product_type}</p></div>
          <div><p className="text-xs text-muted-foreground">Auto-renew</p><p className="font-medium">{order.auto_renew ? 'Yes' : 'No'}</p></div>
        </div>
      </AppCard>

      {/* Shipping */}
      <AppCard title="Shipping">
        <div className="space-y-3">
          {order.shipping_address?.line1 ? (
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Delivery address</p>
                <p className="text-sm">
                  {order.shipping_address.line1}
                  {order.shipping_address.line2 ? `, ${order.shipping_address.line2}` : ''}
                  <br />
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Shipping address not yet provided.</p>
          )}
          {order.tracking_number ? (
            <div className="flex gap-3">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Tracking number</p>
                <p className="font-mono text-sm font-medium text-[#E85A2B]">{order.tracking_number}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground/50" />
              Tracking number will appear once shipped.
            </p>
          )}
        </div>
      </AppCard>

      {/* Visit link for Rx */}
      {order.visit_id && (
        <div className="mt-4">
          <Link href={`/patient/visits/${order.visit_id}`}>
            <Button variant="outline" size="sm">View clinical visit details</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
