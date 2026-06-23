'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { MapPin, Truck, CheckCircle } from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Order } from '@/types'

const STATUS_STEPS = ['payment_confirmed', 'preparing', 'shipped', 'delivered']

export default function OrderDetailPage() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetch(`/api/orders/${params.id}`).then(r => r.json()).then(d => { if (d.success) setOrder(d.data) })
  }, [params.id])

  if (!order) return <div className="flex justify-center py-16"><LoadingSpinner className="h-8 w-8 text-primary-700" /></div>

  const currentStep = STATUS_STEPS.indexOf(order.status)

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Order Details</h2>
          <p className="font-mono text-xs text-muted-foreground mt-1">{order.id}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="card mb-4">
        <div className="card-header"><h3 className="text-sm font-semibold text-foreground">Order Progress</h3></div>
        <div className="card-body">
          <div className="flex items-center gap-0">
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className="flex flex-1 items-center">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i <= currentStep ? 'bg-primary-700 text-white' : 'bg-muted text-muted-foreground'}`}>
                  {i < currentStep ? <CheckCircle className="h-4 w-4" /> : i + 1}
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 ${i < currentStep ? 'bg-primary-700' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Payment</span><span>Preparing</span><span>Shipped</span><span>Delivered</span>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header"><h3 className="text-sm font-semibold text-foreground">Order Summary</h3></div>
        <div className="card-body">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-xs text-muted-foreground">Order Date</p><p className="font-medium">{formatDate(order.order_date)}</p></div>
            <div><p className="text-xs text-muted-foreground">Total Amount</p><p className="font-medium">{formatCurrency(order.total_amount)}</p></div>
            <div><p className="text-xs text-muted-foreground">Payment Method</p><p className="font-medium capitalize">{order.payment_method.replace('_', ' ')}</p></div>
            <div><p className="text-xs text-muted-foreground">Prescription</p><p className="font-mono text-xs">{order.prescription_id}</p></div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="text-sm font-semibold text-foreground">Shipping</h3></div>
        <div className="card-body space-y-3">
          <div className="flex gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div><p className="text-xs text-muted-foreground mb-0.5">Delivery address</p><p className="text-sm">{order.shipping_address}</p></div>
          </div>
          {order.tracking_number ? (
            <div className="flex gap-3">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Tracking number</p>
                <p className="font-mono text-sm font-medium text-primary-700">{order.tracking_number}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Tracking number will appear once shipped.</p>
          )}
        </div>
      </div>
    </div>
  )
}
