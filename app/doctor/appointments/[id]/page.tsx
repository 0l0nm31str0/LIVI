'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Video, Heart, Pill, FileText } from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { AlertBanner } from '@/components/shared/AlertBanner'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatDateTime } from '@/lib/utils'
import { MOCK_MEDICAL_HISTORY, MOCK_USERS } from '@/lib/mock-data'
import type { Appointment } from '@/types'

export default function DoctorAppointmentDetailPage() {
  const params = useParams()
  const [apt, setApt] = useState<Appointment | null>(null)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    fetch(`/api/appointments/${params.id}`).then(r => r.json()).then(d => { if (d.success) setApt(d.data) })
  }, [params.id])

  async function markComplete() {
    if (!apt) return
    setCompleting(true)
    const res = await fetch(`/api/appointments/${apt.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' }),
    })
    const d = await res.json()
    if (d.success) setApt(d.data)
    setCompleting(false)
  }

  if (!apt) return <div className="flex justify-center py-16"><LoadingSpinner className="h-8 w-8 text-primary-700" /></div>

  const patient = MOCK_USERS.find(u => u.id === apt.patient_id)
  const history = MOCK_MEDICAL_HISTORY.find(h => h.patient_id === apt.patient_id)

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Appointment Details</h2>
        <StatusBadge status={apt.status} />
      </div>

      {history?.allergies && (
        <AlertBanner variant="error" title={`ALLERGY ALERT: ${history.allergies}`} message="Review allergies carefully before prescribing." />
      )}

      <div className="card">
        <div className="card-header flex items-center gap-2"><Heart className="h-4 w-4 text-destructive" /><h3 className="text-sm font-semibold">Patient Record</h3></div>
        <div className="card-body space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-xs text-muted-foreground">Patient</p><p className="font-medium">{patient ? `${patient.first_name} ${patient.last_name}` : apt.patient_id}</p></div>
            <div><p className="text-xs text-muted-foreground">Appointment</p><p className="font-medium">{formatDateTime(apt.appointment_date)}</p></div>
            <div className="col-span-2"><p className="text-xs text-muted-foreground">Presenting complaint</p><p>{apt.notes}</p></div>
          </div>
          {history && (
            <>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Conditions</p>
                <div className="flex flex-wrap gap-2">
                  {history.conditions.map(c => <span key={c} className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700">{c}</span>)}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1"><Pill className="h-3.5 w-3.5" />Current Medications</p>
                <ul className="space-y-1">
                  {history.current_medications.map(m => <li key={m} className="text-sm flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary-700 shrink-0" />{m}</li>)}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="text-sm font-semibold">Actions</h3></div>
        <div className="card-body flex flex-wrap gap-3">
          {apt.status === 'scheduled' && (
            <>
              <a href={apt.zoom_link} target="_blank" rel="noreferrer" className="btn-accent">
                <Video className="h-4 w-4" /> Join Video Call
              </a>
              <button onClick={markComplete} disabled={completing} className="btn-secondary">
                {completing ? <LoadingSpinner /> : 'Mark as Complete'}
              </button>
            </>
          )}
          <Link href={`/doctor/prescriptions/new?appointment_id=${apt.id}&patient_id=${apt.patient_id}`} className="btn-primary">
            <FileText className="h-4 w-4" /> Write Prescription
          </Link>
        </div>
      </div>
    </div>
  )
}
