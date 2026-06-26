'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Video, CheckCircle, Calendar } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/utils'
import { MOCK_USERS } from '@/lib/mock-data'
import type { Appointment } from '@/types'

export default function DoctorAppointmentsPage() {
  const user = useAuthStore((s) => s.user)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [completing, setCompleting] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    fetch(`/api/appointments?doctor_id=${user.id}`).then(r => r.json()).then(d => setAppointments(d.data ?? []))
  }, [user])

  function getPatientName(id: string) {
    const u = MOCK_USERS.find(u => u.id === id)
    return u ? `${u.first_name} ${u.last_name}` : id
  }

  async function markComplete(id: string) {
    setCompleting(id)
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' }),
    })
    const d = await res.json()
    if (d.success) {
      setAppointments(prev => prev.map(a => a.id === id ? d.data : a))
    }
    setCompleting(null)
  }

  return (
    <div className="page-enter">
      <PageHeader
        title="Appointments"
        description="All scheduled and past patient appointments."
      />
      <AppCard noPadding>
        {appointments.length === 0 ? (
          <div className="p-6"><EmptyState icon={Calendar} title="No appointments" description="Your schedule is clear." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Notes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {appointments.map(apt => (
                  <tr key={apt.id} className="table-row-hover">
                    <td className="px-6 py-4 font-medium text-foreground">{getPatientName(apt.patient_id)}</td>
                    <td className="px-6 py-4">{formatDateTime(apt.appointment_date)}</td>
                    <td className="px-6 py-4 max-w-xs truncate text-muted-foreground">{apt.notes}</td>
                    <td className="px-6 py-4"><StatusBadge status={apt.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {apt.status === 'scheduled' && (
                          <>
                            <a href={apt.zoom_link} target="_blank" rel="noreferrer">
                              <Button size="sm" variant="secondary">
                                <Video className="h-3.5 w-3.5" /> Join
                              </Button>
                            </a>
                            <Button size="sm" variant="secondary" onClick={() => markComplete(apt.id)} disabled={completing === apt.id}>
                              <CheckCircle className="h-3.5 w-3.5" /> Complete
                            </Button>
                          </>
                        )}
                        <Link href={`/doctor/appointments/${apt.id}`} className="text-xs font-medium text-primary hover:underline">Details</Link>
                      </div>
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
