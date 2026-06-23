'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Truck } from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { AlertBanner } from '@/components/shared/AlertBanner'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Order, OrderStatus } from '@/types'

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  payment_confirmed: 'preparing',
  preparing: 'shipped',
  shipped: 'delivered',
}

const STATUS_LABELS: Partial<Record<OrderStatus, string>> = {
  payment_confirmed: 'Start Preparing',
  preparing: 'Mark as Shipped',
  shipped: 'Mark as Delivered',
}

export default function PharmacyOrderDetailPage() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [updating, setUpdating] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetch(`/api/orders/${params.id}`).then(r => r.json()).then(d => {
      if (d.success) {
        setOrder(d.data)
        setTrackingNumber(d.data.tracking_number ?? '')
      }
    })
  }, [params.id])

  async function handleUpdate() {
    if (!order) return
    const next = NEXT_STATUS[order.status]
    if (!next) return
    setUpdating(true)
    const body: Partial<Order> = { status: next }
    if (next === 'shipped') body.tracking_number = trackingNumber || `1Z${Date.now()}`
    const res = await fetch(`/api/orders/${order.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const d = await res.json()
    if (d.success) { setOrder(d.data); setSuccess(true) }
    setUpdating(false)
  }

  if (!order) return <div className="flex justify-center py-16"><LoadingSpinner className="h-8 w-8 text-primary-700" /></div>

  const nextStatus = NEXT_STATUS[order.status]

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Order Details</h2>
          <p className="font-mono text-xs text-muted-foreground mt-1">{order.id}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {success && <AlertBanner variant="success" title="Order status updated" message="Patient has been notified." className="mb-4" />}

      <div className="card mb-4">
        <div className="card-header"><h3 className="text-sm font-semibold">Order Summary</h3></div>
        <div className="card-body grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-xs text-muted-foreground">Order Date</p><p className="font-medium">{formatDate(order.order_date)}</p></div>
          <div><p className="text-xs text-muted-foreground">Amount</p><p className="font-medium">{formatCurrency(order.total_amount)}</p></div>
          <div><p className="text-xs text-muted-foreground">Payment Method</p><p className="font-medium capitalize">{order.payment_method.replace('_', ' ')}</p></div>
          <div><p className="text-xs text-muted-foreground">Shipping Address</p><p className="font-medium text-xs">{order.shipping_address}</p></div>
        </div>
      </div>

      {nextStatus && (
        <div className="card">
          <div className="card-header"><h3 className="text-sm font-semibold">Update Fulfillment</h3></div>
          <div className="card-body space-y-4">
            {nextStatus === 'shipped' && (
              <div>
                <label className="form-label">Tracking Number</label>
                <input className="form-input" placeholder="1Z999AA10123456784" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} />
              </div>
            )}
            <button onClick={handleUpdate} disabled={updating} className="btn-primary">
              {updating ? <LoadingSpinner className="text-white" /> : <><Truck className="h-4 w-4" /> {STATUS_LABELS[order.status]}</>}
            </button>
          </div>
        </div>
      )}

      {order.status === 'delivered' && (
        <AlertBanner variant="success" title="Order fulfilled and delivered" message={`Tracking: ${order.tracking_number}`} />
      )}
    </div>
  )
}
