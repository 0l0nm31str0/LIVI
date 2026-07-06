'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'
import { Button } from '@/components/ui/button'
import { formatDate, formatPrice } from '@/lib/utils'
import { getProductBySlug } from '@/lib/products/catalog'
import type { MarketplaceOrder } from '@/types'
import { cn } from '@/lib/utils'

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'prescription', label: 'Prescription' },
  { id: 'otc', label: 'OTC' },
] as const

type FilterTab = typeof FILTER_TABS[number]['id']

export default function PatientOrdersPage() {
  const user = useAuthStore((s) => s.user)
  const [orders, setOrders] = useState<MarketplaceOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')

  useEffect(() => {
    if (!user) return
    fetch(`/api/marketplace/orders?patient_id=${user.id}`)
      .then((r) => r.json())
      .then((d) => { setOrders(d.data ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  const filtered = activeFilter === 'all' ? orders : orders.filter((o) => o.product_type === activeFilter)

  return (
    <div className="page-enter">
      <PageHeader
        title="My orders"
        description="Track all your treatments and wellness products."
        action={
          <Link href="/shop">
            <Button className="bg-[#E85A2B] hover:bg-[#d14f25] text-white border-0">
              <ShoppingBag className="h-4 w-4" />
              Shop
            </Button>
          </Link>
        }
      />

      {/* Filter tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-muted/50 p-1 w-fit">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={cn(
              'rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-150',
              activeFilter === tab.id ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AppCard noPadding>
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={ShoppingBag}
              title="No orders yet"
              description="Place your first order from the shop."
              action={<Link href="/shop"><Button>Browse shop</Button></Link>}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((order) => {
                  const product = getProductBySlug(order.product_slug)
                  return (
                    <tr key={order.id} className="table-row-hover">
                      <td className="px-6 py-4 font-medium">{product?.name ?? order.product_slug}</td>
                      <td className="px-6 py-4 text-muted-foreground">{formatDate(order.created_at)}</td>
                      <td className="px-6 py-4 capitalize text-muted-foreground">{order.plan_interval}</td>
                      <td className="px-6 py-4 font-semibold">{formatPrice(order.amount_cents)}</td>
                      <td className="px-6 py-4">
                        <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', order.product_type === 'prescription' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700')}>
                          {order.product_type === 'prescription' ? 'Rx' : 'OTC'}
                        </span>
                      </td>
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
    </div>
  )
}
