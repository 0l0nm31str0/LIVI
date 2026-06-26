'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'
import { formatDate, formatCurrency } from '@/lib/utils'
import { MOCK_PHARMACIES } from '@/lib/mock-data'
import type { Order } from '@/types'

export default function PharmacyOrdersPage() {
  const user = useAuthStore((s) => s.user)
  const [orders, setOrders] = useState<Order[]>([])

  const pharmacy = MOCK_PHARMACIES.find(p => p.manager_id === user?.id)

  useEffect(() => {
    if (!pharmacy) return
    fetch(`/api/orders?pharmacy_id=${pharmacy.id}`).then(r => r.json()).then(d => setOrders(d.data ?? []))
  }, [pharmacy])

  return (
    <div className="page-enter">
      <PageHeader
        title="Orders"
        description="Patient medication orders to fulfill."
      />
      <AppCard noPadding>
        {orders.length === 0 ? (
          <div className="p-6"><EmptyState icon={ShoppingBag} title="No orders yet" description="Orders appear here once patients place them." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map(order => (
                  <tr key={order.id} className="table-row-hover">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{order.id}</td>
                    <td className="px-6 py-4">{formatDate(order.order_date)}</td>
                    <td className="px-6 py-4 font-medium">{formatCurrency(order.total_amount)}</td>
                    <td className="px-6 py-4 capitalize text-muted-foreground">{order.payment_method.replace('_', ' ')}</td>
                    <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                    <td className="px-6 py-4">
                      <Link href={`/pharmacy/orders/${order.id}`} className="text-xs font-medium text-primary hover:underline">Manage</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AppCard>
    </div>
  )
}
