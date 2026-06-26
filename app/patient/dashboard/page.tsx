'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, Package, ArrowRight, Truck, Video } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { StatCard } from '@/components/shared/StatCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatRelative, formatDate } from '@/lib/utils'
import type { Visit } from '@/types'

export default function PatientDashboard() {
  const user = useAuthStore((s) => s.user)
  const [visits, setVisits] = useState<Visit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetch(`/api/visits?patient_id=${user.id}`)
      .then(r => r.json())
      .then(d => { setVisits(d.data ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const activeVisits = visits.filter(v => !['cancelled', 'delivered'].includes(v.status))
  const ordersInFlight = visits.filter(v => v.curexa_order_id && !['completed', 'cancelled', 'delivered'].includes(v.curexa_order_status ?? ''))

  return (
    <div>
      <PageHeader
        title={`${greeting}, ${user?.first_name}.`}
        description="Your visits, prescriptions, and deliveries in one place."
        action={
          <Link href="/patient/appointments/new">
            <Button>
              <Calendar className="h-4 w-4" />
              New visit
            </Button>
          </Link>
        }
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Active visits" value={activeVisits.length} icon={Calendar} />
        <StatCard title="Orders in transit" value={ordersInFlight.length} icon={Package} />
        <StatCard title="Total visits" value={visits.length} icon={Calendar} />
      </div>

      <AppCard
        title="Your visits"
        action={
          <Link href="/patient/appointments/new">
            <Button size="sm" variant="secondary">Book visit</Button>
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
        ) : visits.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No visits yet"
            description="Start a visit to consult with a licensed physician."
            action={
              <Link href="/patient/appointments/new">
                <Button>Start a visit</Button>
              </Link>
            }
          />
        ) : (
          <div className="divide-y divide-border">
            {visits.map((visit) => (
              <VisitRow key={visit.id} visit={visit} />
            ))}
          </div>
        )}
      </AppCard>

      <div className="flex flex-wrap gap-3">
        <Link href="/patient/appointments/new">
          <Button>
            <Calendar className="h-4 w-4" />
            Start a visit
          </Button>
        </Link>
        <Link href="/patient/doctors">
          <Button variant="secondary">Find a doctor</Button>
        </Link>
      </div>
    </div>
  )
}

function VisitRow({ visit }: { visit: Visit }) {
  const isShipped = visit.tracking_number != null

  return (
    <Link
      href={`/patient/visits/${visit.id}`}
      className="table-row-hover flex items-start justify-between gap-4 px-6 py-4"
    >
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink">
          {visit.visit_type === 'sync'
            ? <Video className="h-5 w-5 text-on-ink" />
            : <Calendar className="h-5 w-5 text-on-ink" />}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground line-clamp-1">
            {visit.chief_complaint ?? 'Visit'}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {visit.visit_type === 'sync' ? 'Video call' : 'Async'} · {formatRelative(visit.created_at)}
          </p>
          {isShipped && visit.tracking_number && (
            <p className="mt-1 flex items-center gap-1 text-xs text-sage">
              <Truck className="h-3 w-3" />
              {visit.tracking_number}
              {visit.carrier && <span className="text-muted-foreground">({visit.carrier})</span>}
            </p>
          )}
          {visit.estimated_delivery && (
            <p className="mt-0.5 text-xs text-muted-foreground">Est. {formatDate(visit.estimated_delivery)}</p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <StatusBadge status={visit.status} />
        {visit.curexa_order_status && visit.curexa_order_status !== visit.status && (
          <StatusBadge status={visit.curexa_order_status} />
        )}
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </Link>
  )
}
