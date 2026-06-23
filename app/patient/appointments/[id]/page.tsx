'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Video } from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatDateTime } from '@/lib/utils'
import type { Appointment } from '@/types'

export default function AppointmentDetailPage() {
  const params = useParams()
  const [apt, setApt] = useState<Appointment | null>(null)

  useEffect(() => {
    fetch(`/api/appointments/${params.id}`).then(r => r.json()).then(d => { if (d.success) setApt(d.data) })
  }, [params.id])

  if (!apt) return <div className="flex justify-center py-16"><LoadingSpinner className="h-8 w-8 text-primary-700" /></div>

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Appointment Details</h2>
        <StatusBadge status={apt.status} />
      </div>

      <div className="card mb-4">
        <div className="card-header"><h3 className="text-sm font-semibold">Appointment Info</h3></div>
        <div className="card-body space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-muted-foreground">Date and Time</p><p className="font-medium">{formatDateTime(apt.appointment_date)}</p></div>
            <div><p className="text-xs text-muted-foreground">Status</p><StatusBadge status={apt.status} /></div>
            <div className="col-span-2"><p className="text-xs text-muted-foreground">Notes</p><p>{apt.notes}</p></div>
          </div>
        </div>
      </div>

      {apt.status === 'scheduled' && (
        <div className="card">
          <div className="card-header"><h3 className="text-sm font-semibold">Join your consultation</h3></div>
          <div className="card-body">
            <p className="text-sm text-muted-foreground mb-4">Your video call will open in a new tab. Make sure your camera and microphone are ready.</p>
            <a href={apt.zoom_link} target="_blank" rel="noreferrer" className="btn-accent">
              <Video className="h-4 w-4" /> Join Video Call
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
