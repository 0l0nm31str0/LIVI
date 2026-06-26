'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, FileText, Users, Video, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { StatCard } from '@/components/shared/StatCard'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'
import { Button } from '@/components/ui/button'
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
      <PageHeader
        title={`Good day, Dr. ${user?.last_name}.`}
        description="Your patient queue for today."
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Upcoming" value={upcoming.length} icon={Calendar} />
        <StatCard title="Total appointments" value={appointments.length} icon={Users} />
        <StatCard title="Pending Rx" value={pendingRx.length} icon={FileText} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AppCard
          title="Appointment queue"
          action={
            <Link href="/doctor/appointments">
              <Button variant="ghost" size="sm">
                All <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          }
          noPadding
        >
          <div className="divide-y divide-border px-2">
            {appointments.length === 0 ? (
              <p className="px-4 py-6 text-sm text-muted-foreground">No appointments scheduled.</p>
            ) : (
              appointments.slice(0, 4).map((apt) => (
                <div key={apt.id} className="table-row-hover flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{getPatientName(apt.patient_id)}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(apt.appointment_date)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={apt.status} />
                    {apt.status === 'scheduled' && (
                      <a href={apt.zoom_link} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="secondary">
                          <Video className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </AppCard>

        <AppCard
          title="Recent prescriptions"
          action={
            <Link href="/doctor/prescriptions/new">
              <Button size="sm">Write Rx</Button>
            </Link>
          }
          noPadding
        >
          <div className="divide-y divide-border px-2">
            {prescriptions.length === 0 ? (
              <p className="px-4 py-6 text-sm text-muted-foreground">No prescriptions written yet.</p>
            ) : (
              prescriptions.slice(0, 4).map((rx) => (
                <div key={rx.id} className="table-row-hover flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{getPatientName(rx.patient_id)}</p>
                    <p className="text-xs text-muted-foreground">{rx.dosage} x {rx.quantity}</p>
                  </div>
                  <StatusBadge status={rx.status} />
                </div>
              ))
            )}
          </div>
        </AppCard>
      </div>
    </div>
  )
}
