'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, ArrowRight, Truck, ShoppingBag, RefreshCw, ClipboardList } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { StatCard } from '@/components/shared/StatCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatRelative } from '@/lib/utils'
import { formatPrice, getProductBySlug } from '@/lib/products/catalog'
import type { MarketplaceOrder } from '@/types'

export default function PatientDashboard() {
  const user = useAuthStore((s) => s.user)
  const [orders, setOrders] = useState<MarketplaceOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetch(`/api/marketplace/orders?patient_id=${user.id}`)
      .then((r) => r.json())
      .then((d) => { setOrders(d.data ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  async function advanceOrder(orderId: string) {
    const res = await fetch(`/api/marketplace/orders/${orderId}/advance`, { method: 'POST' })
    const json = await res.json()
    if (json.success) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? json.data : o)))
    }
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const pendingIntake = orders.filter((o) => o.status === 'intake_pending')
  const pendingCheckout = orders.filter((o) => o.status === 'intake_complete' || o.status === 'checkout_pending')
  const active = orders.filter((o) => !['delivered', 'cancelled', 'denied', 'cart'].includes(o.status))
  const inTransit = orders.filter((o) => o.status === 'shipped')

  return (
    <div>
      <PageHeader
        title={`${greeting}, ${user?.first_name}.`}
        description="Your treatments, orders, and deliveries in one place."
        action={
          <Link href="/shop">
            <Button className="bg-[#E85A2B] hover:bg-[#d14f25] text-white border-0">
              <ShoppingBag className="h-4 w-4" />
              Shop treatments
            </Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Active treatments" value={active.length} icon={Package} />
        <StatCard title="Orders in transit" value={inTransit.length} icon={Truck} />
        <StatCard title="Total orders" value={orders.length} icon={ShoppingBag} />
      </div>

      {/* Pending intake banner */}
      {pendingIntake.length > 0 && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <ClipboardList className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-amber-900">
                {pendingIntake.length} order{pendingIntake.length > 1 ? 's' : ''} awaiting intake
              </p>
              <p className="mt-0.5 text-sm text-amber-700">Complete your medical intake to proceed to checkout.</p>
            </div>
            <Link href={`/intake/${pendingIntake[0].id}`}>
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white border-0">Complete intake</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Pending checkout banner */}
      {pendingCheckout.length > 0 && (
        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <ShoppingBag className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-blue-900">
                {pendingCheckout.length} order{pendingCheckout.length > 1 ? 's' : ''} ready for checkout
              </p>
              <p className="mt-0.5 text-sm text-blue-700">Your intake is complete. Proceed to payment.</p>
            </div>
            <Link href={`/checkout/prescription/${pendingCheckout[0].id}`}>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white border-0">Checkout</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Orders list */}
      <AppCard
        title="Your orders"
        action={
          <Link href="/patient/orders">
            <Button size="sm" variant="secondary">View all</Button>
          </Link>
        }
        className="mb-6"
        noPadding
      >
        {loading ? (
          <div className="space-y-3 p-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No orders yet"
            description="Browse treatments and place your first order."
            action={
              <Link href="/shop">
                <Button>Shop treatments</Button>
              </Link>
            }
          />
        ) : (
          <div className="divide-y divide-border">
            {orders.slice(0, 5).map((order) => (
              <OrderRow key={order.id} order={order} onAdvance={advanceOrder} />
            ))}
          </div>
        )}
      </AppCard>
    </div>
  )
}

function OrderRow({ order, onAdvance }: { order: MarketplaceOrder; onAdvance: (id: string) => void }) {
  const product = getProductBySlug(order.product_slug)

  return (
    <div className="flex items-start justify-between gap-4 px-6 py-4">
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E85A2B]/10">
          <Package className="h-5 w-5 text-[#E85A2B]" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground line-clamp-1">
            {product?.name ?? order.product_slug}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatPrice(order.amount_cents)} · {order.plan_interval} · {formatRelative(order.created_at)}
          </p>
          {order.tracking_number && (
            <p className="mt-1 flex items-center gap-1 text-xs text-[#E85A2B]">
              <Truck className="h-3 w-3" />
              {order.tracking_number}
            </p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <StatusBadge status={order.status} />
        <div className="flex gap-2">
          {/* Demo advance button */}
          {!['delivered', 'cancelled', 'denied'].includes(order.status) && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => onAdvance(order.id)}
              title="Simulate next step (demo)"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Simulate
            </Button>
          )}
          <Link href={`/patient/orders/${order.id}`}>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </div>
  )
}
