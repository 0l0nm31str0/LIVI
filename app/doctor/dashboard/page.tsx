'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, FileText, Users, Video, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { StatCard } from '@/components/shared/StatCard'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDateTime } from '@/lib/utils'
import { MOCK_USERS } from '@/lib/mock-data'
import type { Appointment, Prescription } from '@/types'

export default function DoctorDashboard() {
  const user = useAuthStore((s) => s.user)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])

  useEffect(() => {
    if (!user) return
    fetch(`/api/appointments?doctor_id=${user.id}`).then(r => r.json()).then(d => setAppointments(d.data ?? []))
    fetch(`/api/prescriptions?doctor_id=${user.id}`).then(r => r.json()).then(d => setPrescriptions(d.data ?? []))
  }, [user])

  const upcoming = appointments.filter(a => a.status === 'scheduled')
  const pendingRx = prescriptions.filter(p => p.status === 'pending')

  function getPatientName(id: string) {
    const u = MOCK_USERS.find(u => u.id === id)
    return u ? `${u.first_name} ${u.last_name}` : id
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Good day, Dr. {user?.last_name}.</h2>
        <p className="mt-1 text-sm text-muted-foreground">Here is your patient queue for today.</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Upcoming Appointments" value={upcoming.length} icon={Calendar} />
        <StatCard title="Total Appointments" value={appointments.length} icon={Users} iconColor="text-accent" iconBg="bg-blue-50" />
        <StatCard title="Pending Prescriptions" value={pendingRx.length} icon={FileText} iconColor="text-amber-600" iconBg="bg-amber-50" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Appointment Queue</h3>
            <Link href="/doctor/appointments" className="text-xs font-medium text-primary-700 hover:underline flex items-center gap-1">
              All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="card-body divide-y divide-border">
            {appointments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No appointments scheduled.</p>
            ) : (
              appointments.slice(0, 4).map(apt => (
                <div key={apt.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{getPatientName(apt.patient_id)}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(apt.appointment_date)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={apt.status} />
                    {apt.status === 'scheduled' && (
                      <a href={apt.zoom_link} target="_blank" rel="noreferrer" className="btn-accent text-xs py-1 px-2">
                        <Video className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Recent Prescriptions</h3>
            <Link href="/doctor/prescriptions/new" className="btn-primary text-xs py-1 px-3">
              Write Rx
            </Link>
          </div>
          <div className="card-body divide-y divide-border">
            {prescriptions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No prescriptions written yet.</p>
            ) : (
              prescriptions.slice(0, 4).map(rx => (
                <div key={rx.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{getPatientName(rx.patient_id)}</p>
                    <p className="text-xs text-muted-foreground">{rx.dosage} x {rx.quantity}</p>
                  </div>
                  <StatusBadge status={rx.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
