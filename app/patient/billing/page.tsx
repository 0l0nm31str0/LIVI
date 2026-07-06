'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CreditCard, RefreshCw, Package, ExternalLink } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { formatPrice, getProductBySlug } from '@/lib/products/catalog'
import { formatDate } from '@/lib/utils'
import type { MarketplaceOrder } from '@/types'

export default function BillingPage() {
  const user = useAuthStore((s) => s.user)
  const [orders, setOrders] = useState<MarketplaceOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [openingPortal, setOpeningPortal] = useState(false)

  useEffect(() => {
    if (!user) return
    fetch(`/api/marketplace/orders?patient_id=${user.id}`)
      .then((r) => r.json())
      .then((d) => setOrders(d.data ?? []))
      .finally(() => setLoading(false))
  }, [user])

  const subscriptions = orders.filter((o) => o.auto_renew && ['paid', 'under_review', 'approved', 'processing', 'shipped', 'delivered'].includes(o.status))
  const history = orders.filter((o) => ['paid', 'approved', 'shipped', 'delivered'].includes(o.status))

  async function openPortal() {
    setOpeningPortal(true)
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      const json = await res.json()
      if (json.data?.url) window.location.href = json.data.url
    } finally {
      setOpeningPortal(false)
    }
  }

  return (
    <div className="page-enter space-y-6">
      <PageHeader
        title="Billing"
        description="Manage subscriptions and payment history."
        action={
          <Button variant="secondary" onClick={openPortal} disabled={openingPortal}>
            <ExternalLink className="h-4 w-4" />
            {openingPortal ? 'Loading...' : 'Manage billing'}
          </Button>
        }
      />

      {/* Active subscriptions */}
      <AppCard
        title="Active subscriptions"
        noPadding
      >
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>
        ) : subscriptions.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={RefreshCw}
              title="No active subscriptions"
              description="Start a treatment plan to set up auto-refills."
              action={<Link href="/shop"><Button>Browse treatments</Button></Link>}
            />
          </div>
        ) : (
          <div className="divide-y divide-border">
            {subscriptions.map((order) => {
              const product = getProductBySlug(order.product_slug)
              return (
                <div key={order.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E85A2B]/10">
                      <RefreshCw className="h-5 w-5 text-[#E85A2B]" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{product?.name ?? order.product_slug}</p>
                      <p className="text-sm text-muted-foreground capitalize">{order.plan_interval}ly · Auto-renew</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={order.status} />
                    <p className="font-semibold text-foreground">{formatPrice(order.amount_cents)}</p>
                    <Link href={`/patient/orders/${order.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </AppCard>

      {/* Transaction history */}
      <AppCard title="Transaction history" noPadding>
        {history.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={CreditCard} title="No transactions yet" description="Your payment history will appear here." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {history.map((order) => {
                  const product = getProductBySlug(order.product_slug)
                  return (
                    <tr key={order.id} className="table-row-hover">
                      <td className="px-6 py-4 text-muted-foreground">{formatDate(order.created_at)}</td>
                      <td className="px-6 py-4 font-medium">{product?.name ?? order.product_slug}</td>
                      <td className="px-6 py-4 capitalize text-muted-foreground">{order.plan_interval}</td>
                      <td className="px-6 py-4 font-semibold">{formatPrice(order.amount_cents)}</td>
                      <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                      <td className="px-6 py-4">
                        <Link href={`/patient/orders/${order.id}`} className="text-xs font-medium text-primary hover:underline">View</Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </AppCard>

      {/* Demo note */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
        <strong>Demo mode:</strong> Real billing management via the Stripe Customer Portal is available once <code>STRIPE_SECRET_KEY</code> is configured.
      </div>
    </div>
  )
}
