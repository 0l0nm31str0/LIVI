'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { MapPin, Truck, CheckCircle } from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Order } from '@/types'

const STATUS_STEPS = ['payment_confirmed', 'preparing', 'shipped', 'delivered']

export default function OrderDetailPage() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetch(`/api/orders/${params.id}`).then(r => r.json()).then(d => { if (d.success) setOrder(d.data) })
  }, [params.id])

  if (!order) return <div className="flex justify-center py-16"><LoadingSpinner className="h-8 w-8 text-primary" /></div>

  const currentStep = STATUS_STEPS.indexOf(order.status)

  return (
    <div className="max-w-2xl page-enter">
      <PageHeader
        title="Order details"
        description={order.id}
        action={<StatusBadge status={order.status} />}
      />

      <AppCard title="Order progress" className="mb-4">
        <div className="flex items-center gap-0">
          {STATUS_STEPS.map((step, i) => (
            <div key={step} className="flex flex-1 items-center">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {i < currentStep ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 ${i < currentStep ? 'bg-primary' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>Payment</span><span>Preparing</span><span>Shipped</span><span>Delivered</span>
        </div>
      </AppCard>

      <AppCard title="Order summary" className="mb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-xs text-muted-foreground">Order Date</p><p className="font-medium">{formatDate(order.order_date)}</p></div>
          <div><p className="text-xs text-muted-foreground">Total Amount</p><p className="font-medium">{formatCurrency(order.total_amount)}</p></div>
          <div><p className="text-xs text-muted-foreground">Payment Method</p><p className="font-medium capitalize">{order.payment_method.replace('_', ' ')}</p></div>
          <div><p className="text-xs text-muted-foreground">Prescription</p><p className="font-mono text-xs">{order.prescription_id}</p></div>
        </div>
      </AppCard>

      <AppCard title="Shipping">
        <div className="space-y-3">
          <div className="flex gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div><p className="text-xs text-muted-foreground mb-0.5">Delivery address</p><p className="text-sm">{order.shipping_address}</p></div>
          </div>
          {order.tracking_number ? (
            <div className="flex gap-3">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Tracking number</p>
                <p className="font-mono text-sm font-medium text-primary">{order.tracking_number}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Tracking number will appear once shipped.</p>
          )}
        </div>
      </AppCard>
    </div>
  )
}
