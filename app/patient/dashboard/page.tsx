'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, FileText, ShoppingBag, ArrowRight, Video } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { StatCard } from '@/components/shared/StatCard'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDate, formatDateTime } from '@/lib/utils'
import type { Appointment, Prescription, Order } from '@/types'

export default function PatientDashboard() {
  const user = useAuthStore((s) => s.user)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (!user) return
    fetch(`/api/appointments?patient_id=${user.id}`).then(r => r.json()).then(d => setAppointments(d.data ?? []))
    fetch(`/api/prescriptions?patient_id=${user.id}`).then(r => r.json()).then(d => setPrescriptions(d.data ?? []))
    fetch(`/api/orders?patient_id=${user.id}`).then(r => r.json()).then(d => setOrders(d.data ?? []))
  }, [user])

  const upcoming = appointments.filter(a => a.status === 'scheduled')
  const activePrescriptions = prescriptions.filter(p => p.status !== 'fulfilled')
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">{greeting}, {user?.first_name}.</h2>
        <p className="mt-1 text-sm text-muted-foreground">Here&apos;s what&apos;s happening with your health today.</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Upcoming Appointments" value={upcoming.length} icon={Calendar} />
        <StatCard title="Active Prescriptions" value={activePrescriptions.length} icon={FileText} iconColor="text-accent" iconBg="bg-blue-50" />
        <StatCard title="Total Orders" value={orders.length} icon={ShoppingBag} iconColor="text-amber-600" iconBg="bg-amber-50" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Upcoming Appointment</h3>
            <Link href="/patient/appointments/new" className="text-xs font-medium text-primary-700 hover:underline flex items-center gap-1">
              Book new <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="card-body">
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
            ) : (
              upcoming.map(apt => (
                <div key={apt.id} className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <Calendar className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{formatDateTime(apt.appointment_date)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{apt.notes}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={apt.status} />
                    <a href={apt.zoom_link} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline">
                      <Video className="h-3 w-3" /> Join call
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Prescriptions</h3>
            <Link href="/patient/prescriptions" className="text-xs font-medium text-primary-700 hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="card-body divide-y divide-border">
            {prescriptions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No prescriptions yet.</p>
            ) : (
              prescriptions.slice(0, 3).map(rx => (
                <Link key={rx.id} href={`/patient/prescriptions/${rx.id}`}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0 hover:bg-primary-50 -mx-2 px-2 rounded transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{rx.medication_id.replace('med-00', 'Medication #')}</p>
                    <p className="text-xs text-muted-foreground">{rx.dosage} x {rx.quantity} — {formatDate(rx.prescribed_date)}</p>
                  </div>
                  <StatusBadge status={rx.status} />
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="card lg:col-span-2">
          <div className="card-header flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Recent Orders</h3>
            <Link href="/patient/orders" className="text-xs font-medium text-primary-700 hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">No orders yet.</td></tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id} className="table-row-hover">
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{order.id}</td>
                      <td className="px-6 py-4">{formatDate(order.order_date)}</td>
                      <td className="px-6 py-4 font-medium">${order.total_amount.toFixed(2)}</td>
                      <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                      <td className="px-6 py-4">
                        <Link href={`/patient/orders/${order.id}`} className="text-xs font-medium text-primary-700 hover:underline">View</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/patient/appointments/new" className="btn-primary">
          <Calendar className="h-4 w-4" /> Book Appointment
        </Link>
        <Link href="/patient/prescriptions" className="btn-secondary">
          <FileText className="h-4 w-4" /> My Prescriptions
        </Link>
        <Link href="/patient/orders" className="btn-secondary">
          <ShoppingBag className="h-4 w-4" /> Track Orders
        </Link>
      </div>
    </div>
  )
}
