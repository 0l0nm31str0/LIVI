'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Video } from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/utils'
import type { Appointment } from '@/types'

export default function AppointmentDetailPage() {
  const params = useParams()
  const [apt, setApt] = useState<Appointment | null>(null)

  useEffect(() => {
    fetch(`/api/appointments/${params.id}`).then(r => r.json()).then(d => { if (d.success) setApt(d.data) })
  }, [params.id])

  if (!apt) return <div className="flex justify-center py-16"><LoadingSpinner className="h-8 w-8 text-primary" /></div>

  return (
    <div className="max-w-2xl page-enter">
      <PageHeader title="Appointment details" action={<StatusBadge status={apt.status} />} />

      <AppCard title="Appointment info" className="mb-4">
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-muted-foreground">Date and Time</p><p className="font-medium">{formatDateTime(apt.appointment_date)}</p></div>
            <div><p className="text-xs text-muted-foreground">Status</p><StatusBadge status={apt.status} /></div>
            <div className="col-span-2"><p className="text-xs text-muted-foreground">Notes</p><p>{apt.notes}</p></div>
          </div>
        </div>
      </AppCard>

      {apt.status === 'scheduled' && (
        <AppCard title="Join your consultation">
          <p className="text-sm text-muted-foreground mb-4">Your video call will open in a new tab. Make sure your camera and microphone are ready.</p>
          <a href={apt.zoom_link} target="_blank" rel="noreferrer">
            <Button>
              <Video className="h-4 w-4" /> Join video call
            </Button>
          </a>
        </AppCard>
      )}
    </div>
  )
}
