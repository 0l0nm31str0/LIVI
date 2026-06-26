'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { toast } from '@/hooks/use-toast'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import type { Prescription } from '@/types'

const MED_NAMES: Record<string, string> = {
  'med-001': 'Lisinopril', 'med-002': 'Metformin', 'med-003': 'Dextromethorphan HBr',
  'med-004': 'Amoxicillin', 'med-005': 'Atorvastatin', 'med-006': 'Omeprazole',
}

export default function PharmacyPrescriptionDetailPage() {
  const params = useParams()
  const [rx, setRx] = useState<Prescription | null>(null)
  const [confirming, setConfirming] = useState(false)
  useEffect(() => {
    fetch(`/api/prescriptions/${params.id}`).then(r => r.json()).then(d => { if (d.success) setRx(d.data) })
  }, [params.id])

  async function handleConfirm() {
    if (!rx) return
    setConfirming(true)
    const res = await fetch(`/api/prescriptions/${rx.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'pharmacy_confirmed' }),
    })
    const d = await res.json()
    if (d.success) {
      setRx(d.data)
      toast({
        title: 'Availability confirmed',
        description: 'Patient has been notified that their medication is ready.',
      })
    } else {
      toast({
        variant: 'destructive',
        title: 'Confirmation failed',
        description: d.error?.message ?? 'Could not confirm availability. Please try again.',
      })
    }
    setConfirming(false)
  }

  if (!rx) return <div className="flex justify-center py-16"><LoadingSpinner className="h-8 w-8 text-primary" /></div>

  return (
    <div className="max-w-2xl page-enter">
      <PageHeader
        title="Prescription details"
        description={rx.id}
        action={<StatusBadge status={rx.status} />}
      />

      <AppCard title="Prescription info" className="mb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-xs text-muted-foreground">Medication</p><p className="font-medium">{MED_NAMES[rx.medication_id] ?? rx.medication_id}</p></div>
          <div><p className="text-xs text-muted-foreground">Dosage</p><p className="font-medium">{rx.dosage}</p></div>
          <div><p className="text-xs text-muted-foreground">Quantity</p><p className="font-medium">{rx.quantity}</p></div>
          <div><p className="text-xs text-muted-foreground">Refills</p><p className="font-medium">{rx.refills}</p></div>
          <div className="col-span-2"><p className="text-xs text-muted-foreground">Instructions</p><p>{rx.special_instructions}</p></div>
          <div><p className="text-xs text-muted-foreground">Prescribed</p><p>{formatDate(rx.prescribed_date)}</p></div>
        </div>
      </AppCard>

      <AppCard title="Patient (privacy protected)" className="mb-4">
        <div className="text-sm">
          <p><span className="text-muted-foreground text-xs">Patient name:</span> <span className="font-medium">Patient J.***</span></p>
          <p className="mt-1"><span className="text-muted-foreground text-xs">Contact:</span> <span className="font-medium">+1-555-0***</span></p>
        </div>
      </AppCard>

      <AppCard title="Inventory check">
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-accent-light border border-primary-100 p-3">
            <CheckCircle className="h-5 w-5 text-primary shrink-0" />
            <p className="text-sm font-medium text-primary-700">{MED_NAMES[rx.medication_id] ?? rx.medication_id} — In stock</p>
          </div>

          {rx.status === 'sent_to_pharmacy' ? (
            <Button onClick={handleConfirm} disabled={confirming} className="w-full">
              {confirming ? <LoadingSpinner className="text-white" /> : <><CheckCircle className="h-4 w-4" /> Confirm availability</>}
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">Status: <StatusBadge status={rx.status} /></p>
          )}
        </div>
      </AppCard>
    </div>
  )
}
