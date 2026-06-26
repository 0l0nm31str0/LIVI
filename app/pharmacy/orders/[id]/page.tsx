'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Truck } from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { AlertBanner } from '@/components/shared/AlertBanner'
import { toast } from '@/hooks/use-toast'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Order, OrderStatus } from '@/types'

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  payment_confirmed: 'preparing',
  preparing: 'shipped',
  shipped: 'delivered',
}

const STATUS_LABELS: Partial<Record<OrderStatus, string>> = {
  payment_confirmed: 'Start preparing',
  preparing: 'Mark as shipped',
  shipped: 'Mark as delivered',
}

export default function PharmacyOrderDetailPage() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [updating, setUpdating] = useState(false)
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
    if (d.success) {
      setOrder(d.data)
      toast({
        title: 'Order status updated',
        description: 'Patient has been notified.',
      })
    } else {
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: d.error?.message ?? 'Could not update order status. Please try again.',
      })
    }
    setUpdating(false)
  }

  if (!order) return <div className="flex justify-center py-16"><LoadingSpinner className="h-8 w-8 text-primary" /></div>

  const nextStatus = NEXT_STATUS[order.status]

  return (
    <div className="max-w-2xl page-enter">
      <PageHeader
        title="Order details"
        description={order.id}
        action={<StatusBadge status={order.status} />}
      />

      <AppCard title="Order summary" className="mb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-xs text-muted-foreground">Order Date</p><p className="font-medium">{formatDate(order.order_date)}</p></div>
          <div><p className="text-xs text-muted-foreground">Amount</p><p className="font-medium">{formatCurrency(order.total_amount)}</p></div>
          <div><p className="text-xs text-muted-foreground">Payment Method</p><p className="font-medium capitalize">{order.payment_method.replace('_', ' ')}</p></div>
          <div><p className="text-xs text-muted-foreground">Shipping Address</p><p className="font-medium text-xs">{order.shipping_address}</p></div>
        </div>
      </AppCard>

      {nextStatus && (
        <AppCard title="Update fulfillment">
          <div className="space-y-4">
            {nextStatus === 'shipped' && (
              <div>
                <Label className="mb-1.5 block">Tracking number</Label>
                <Input placeholder="1Z999AA10123456784" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} />
              </div>
            )}
            <Button onClick={handleUpdate} disabled={updating}>
              {updating ? <LoadingSpinner className="text-white" /> : <><Truck className="h-4 w-4" /> {STATUS_LABELS[order.status]}</>}
            </Button>
          </div>
        </AppCard>
      )}

      {order.status === 'delivered' && (
        <AlertBanner variant="success" title="Order fulfilled and delivered" message={`Tracking: ${order.tracking_number}`} />
      )}
    </div>
  )
}
