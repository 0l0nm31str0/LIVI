'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, ShoppingBag, CheckCircle, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { StatCard } from '@/components/shared/StatCard'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { MOCK_PHARMACIES } from '@/lib/mock-data'
import type { Prescription, Order } from '@/types'

const MED_NAMES: Record<string, string> = {
  'med-001': 'Lisinopril 10mg', 'med-002': 'Metformin 500mg', 'med-003': 'Dextromethorphan HBr',
  'med-004': 'Amoxicillin 500mg', 'med-005': 'Atorvastatin 20mg', 'med-006': 'Omeprazole 20mg',
}

export default function PharmacyDashboard() {
  const user = useAuthStore((s) => s.user)
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  const pharmacy = MOCK_PHARMACIES.find(p => p.manager_id === user?.id)

  useEffect(() => {
    if (!pharmacy) return
    fetch(`/api/prescriptions?pharmacy_id=${pharmacy.id}`).then(r => r.json()).then(d => setPrescriptions(d.data ?? []))
    fetch(`/api/orders?pharmacy_id=${pharmacy.id}`).then(r => r.json()).then(d => setOrders(d.data ?? []))
  }, [pharmacy])

  const pending = prescriptions.filter(p => p.status !== 'fulfilled')
  const pendingOrders = orders.filter(o => o.status !== 'delivered')
  const fulfilledToday = orders.filter(o => o.status === 'delivered')

  return (
    <div>
      <PageHeader
        title={pharmacy?.name ?? 'Pharmacy dashboard'}
        description="Manage incoming prescriptions and patient orders."
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Incoming Rx" value={pending.length} icon={FileText} />
        <StatCard title="Pending orders" value={pendingOrders.length} icon={ShoppingBag} />
        <StatCard title="Fulfilled" value={fulfilledToday.length} icon={CheckCircle} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AppCard
          title="Incoming prescriptions"
          action={
            <Link href="/pharmacy/prescriptions">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          }
          noPadding
        >
          <div className="divide-y divide-border">
            {prescriptions.length === 0 ? (
              <p className="px-6 py-6 text-sm text-muted-foreground">No prescriptions in queue.</p>
            ) : (
              prescriptions.slice(0, 4).map((rx) => (
                <Link
                  key={rx.id}
                  href={`/pharmacy/prescriptions/${rx.id}`}
                  className="table-row-hover flex items-center justify-between px-6 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{MED_NAMES[rx.medication_id] ?? rx.medication_id}</p>
                    <p className="text-xs text-muted-foreground">{rx.dosage} x {rx.quantity} — {formatDate(rx.prescribed_date)}</p>
                  </div>
                  <StatusBadge status={rx.status} />
                </Link>
              ))
            )}
          </div>
        </AppCard>

        <AppCard
          title="Active orders"
          action={
            <Link href="/pharmacy/orders">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          }
          noPadding
        >
          <div className="divide-y divide-border">
            {orders.length === 0 ? (
              <p className="px-6 py-6 text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              orders.slice(0, 4).map((order) => (
                <Link
                  key={order.id}
                  href={`/pharmacy/orders/${order.id}`}
                  className="table-row-hover flex items-center justify-between px-6 py-3"
                >
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{order.id}</p>
                    <p className="text-sm font-medium text-foreground">${order.total_amount.toFixed(2)}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </Link>
              ))
            )}
          </div>
        </AppCard>
      </div>
    </div>
  )
}
