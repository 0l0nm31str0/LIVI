'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { AlertBanner } from '@/components/shared/AlertBanner'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
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
  const [success, setSuccess] = useState(false)

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
    if (d.success) { setRx(d.data); setSuccess(true) }
    setConfirming(false)
  }

  if (!rx) return <div className="flex justify-center py-16"><LoadingSpinner className="h-8 w-8 text-primary-700" /></div>

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Prescription Details</h2>
          <p className="font-mono text-xs text-muted-foreground mt-1">{rx.id}</p>
        </div>
        <StatusBadge status={rx.status} />
      </div>

      {success && <AlertBanner variant="success" title="Availability confirmed" message="Patient has been notified that their medication is ready." className="mb-4" />}

      <div className="card mb-4">
        <div className="card-header"><h3 className="text-sm font-semibold">Prescription Info</h3></div>
        <div className="card-body">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-xs text-muted-foreground">Medication</p><p className="font-medium">{MED_NAMES[rx.medication_id] ?? rx.medication_id}</p></div>
            <div><p className="text-xs text-muted-foreground">Dosage</p><p className="font-medium">{rx.dosage}</p></div>
            <div><p className="text-xs text-muted-foreground">Quantity</p><p className="font-medium">{rx.quantity}</p></div>
            <div><p className="text-xs text-muted-foreground">Refills</p><p className="font-medium">{rx.refills}</p></div>
            <div className="col-span-2"><p className="text-xs text-muted-foreground">Instructions</p><p>{rx.special_instructions}</p></div>
            <div><p className="text-xs text-muted-foreground">Prescribed</p><p>{formatDate(rx.prescribed_date)}</p></div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header"><h3 className="text-sm font-semibold">Patient (Privacy Protected)</h3></div>
        <div className="card-body text-sm">
          <p><span className="text-muted-foreground text-xs">Patient name:</span> <span className="font-medium">Patient J.***</span></p>
          <p className="mt-1"><span className="text-muted-foreground text-xs">Contact:</span> <span className="font-medium">+1-555-0***</span></p>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="text-sm font-semibold">Inventory Check</h3></div>
        <div className="card-body space-y-4">
          <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-green-700">{MED_NAMES[rx.medication_id] ?? rx.medication_id} - In Stock (Mock)</p>
          </div>

          {rx.status === 'sent_to_pharmacy' ? (
            <button onClick={handleConfirm} disabled={confirming} className="btn-primary w-full justify-center py-2.5">
              {confirming ? <LoadingSpinner className="text-white" /> : <><CheckCircle className="h-4 w-4" /> Confirm Availability</>}
            </button>
          ) : (
            <p className="text-sm text-muted-foreground">Status: <StatusBadge status={rx.status} /></p>
          )}
        </div>
      </div>
    </div>
  )
}
