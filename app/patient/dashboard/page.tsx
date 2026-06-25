'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, Package, MessageSquare, ArrowRight, Truck, Video, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { StatusBadge } from '@/components/shared/StatusBadge'
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
  const messages = visits.reduce((n, v) => n, 0) // placeholder

  return (
    <div>
      {/* Welcome */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">{greeting}, {user?.first_name}.</h2>
        <p className="mt-1 text-sm text-muted-foreground">Your health journey, all in one place.</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Calendar} label="Active Visits" value={activeVisits.length} color="primary" />
        <StatCard icon={Package} label="Orders In Transit" value={ordersInFlight.length} color="secondary" />
        <StatCard icon={MessageSquare} label="Total Visits" value={visits.length} color="warning" />
      </div>

      {/* Visits */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="text-sm font-semibold text-foreground">Your Visits</h3>
          <Link href="/patient/appointments/new" className="btn-primary text-xs py-1.5 px-3">
            <Calendar className="h-3.5 w-3.5" /> New Visit
          </Link>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center"><div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" /></div>
        ) : visits.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">No visits yet</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">Start a visit to consult with a licensed physician.</p>
            <Link href="/patient/appointments/new" className="btn-primary text-sm">Start a Visit</Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {visits.map(visit => (
              <VisitRow key={visit.id} visit={visit} />
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/patient/appointments/new" className="btn-primary">
          <Calendar className="h-4 w-4" /> Start a Visit
        </Link>
        <Link href="/patient/doctors" className="btn-secondary">
          Find a Doctor
        </Link>
      </div>
    </div>
  )
}

function VisitRow({ visit }: { visit: Visit }) {
  const hasOrder = !!visit.curexa_order_id
  const isShipped = visit.tracking_number != null

  return (
    <Link
      href={`/patient/visits/${visit.id}`}
      className="flex items-start justify-between gap-4 px-6 py-4 hover:bg-primary-50/50 transition-colors"
    >
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
          {visit.visit_type === 'sync'
            ? <Video className="h-5 w-5 text-primary-600" />
            : <Calendar className="h-5 w-5 text-primary-600" />}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground line-clamp-1">
            {visit.chief_complaint ?? 'Visit'}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {visit.visit_type === 'sync' ? 'Video call' : 'Async consultation'} · {formatRelative(visit.created_at)}
          </p>
          {isShipped && visit.tracking_number && (
            <p className="text-xs text-primary-700 mt-1 flex items-center gap-1">
              <Truck className="h-3 w-3" /> Tracking: {visit.tracking_number}
              {visit.carrier && <span className="text-muted-foreground">({visit.carrier})</span>}
            </p>
          )}
          {visit.estimated_delivery && (
            <p className="text-xs text-secondary-700 mt-0.5">Est. delivery: {formatDate(visit.estimated_delivery)}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <StatusBadge status={visit.status} />
        {hasOrder && visit.curexa_order_status && visit.curexa_order_status !== visit.status && (
          <StatusBadge status={visit.curexa_order_status} />
        )}
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </Link>
  )
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType
  label: string
  value: number
  color: 'primary' | 'secondary' | 'warning'
}) {
  const colors = {
    primary:   { bg: 'bg-primary-50',   icon: 'text-primary-600' },
    secondary: { bg: 'bg-secondary-50', icon: 'text-secondary-600' },
    warning:   { bg: 'bg-warning-50',   icon: 'text-warning-700' },
  }[color]

  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colors.bg}`}>
        <Icon className={`h-5 w-5 ${colors.icon}`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}
