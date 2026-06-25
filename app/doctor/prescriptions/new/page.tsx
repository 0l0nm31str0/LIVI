'use client'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { AlertBanner } from '@/components/shared/AlertBanner'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatRelative } from '@/lib/utils'
import type { Medication, Visit } from '@/types'

export default function WritePrescriptionPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><LoadingSpinner className="h-8 w-8 text-primary-700" /></div>}>
      <WritePrescriptionForm />
    </Suspense>
  )
}

function WritePrescriptionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const user = useAuthStore((s) => s.user)

  // Pre-selected visit from query param
  const [visitId, setVisitId] = useState(searchParams.get('visit_id') ?? '')
  const [visits, setVisits] = useState<Visit[]>([])
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null)

  // Medication search
  const [medSearch, setMedSearch] = useState('')
  const [medications, setMedications] = useState<Medication[]>([])
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null)

  // Rx fields
  const [dosage, setDosage] = useState('')
  const [quantity, setQuantity] = useState(30)
  const [refills, setRefills] = useState(0)
  const [daysSupply, setDaysSupply] = useState(30)
  const [instructions, setInstructions] = useState('')
  const [allergyWarning, setAllergyWarning] = useState('')

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Load visits awaiting prescription (status = 'active')
  useEffect(() => {
    // In a real doctor flow, you'd fetch visits assigned to this doctor.
    // For now we fetch all active visits from the API.
    fetch('/api/visits?status=active')
      .then(r => r.json())
      .then(d => setVisits((d.data ?? []).filter((v: Visit) => v.status === 'active' && !v.rx_written)))
      .catch(() => {})
  }, [])

  // Medication search
  useEffect(() => {
    if (medSearch.length < 2) { setMedications([]); return }
    const t = setTimeout(() => {
      fetch(`/api/medications?q=${medSearch}`).then(r => r.json()).then(d => setMedications(d.data ?? []))
    }, 300)
    return () => clearTimeout(t)
  }, [medSearch])

  function selectMed(med: Medication) {
    setSelectedMed(med)
    setMedSearch(med.name)
    setMedications([])
    setDosage(med.strength)
    // Check allergy against questionnaire
    if (selectedVisit?.questionnaire?.allergies) {
      const allergyText = String(selectedVisit.questionnaire.allergies).toLowerCase()
      const ingredient = med.active_ingredient.toLowerCase()
      const words = allergyText.split(/[\s,()]+/).filter(w => w.length > 3)
      if (words.some(w => ingredient.includes(w))) {
        setAllergyWarning(`Warning: patient reports allergy to "${selectedVisit.questionnaire.allergies}". ${med.name} may conflict.`)
      } else {
        setAllergyWarning('')
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !selectedMed) return
    const targetMasterId = selectedVisit?.beluga_master_id ?? visitId
    if (!targetMasterId) {
      setError('Please select a visit first.')
      return
    }
    setLoading(true)
    setError('')

    const res = await fetch(`/api/prescriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        beluga_master_id: selectedVisit?.beluga_master_id ?? visitId,
        livi_visit_id: selectedVisit?.id ?? '',
        doctor_id: user.id,
        medication_name: selectedMed.name,
        ndc_code: selectedMed.ndc_code,
        dosage,
        quantity,
        refills,
        days_supply: daysSupply,
        special_instructions: instructions,
      }),
    })
    const d = await res.json()
    setLoading(false)
    if (d.success) {
      setSuccess(true)
      setTimeout(() => router.push('/doctor/dashboard'), 2000)
    } else {
      setError(d.error?.message ?? 'Failed to write prescription')
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="rounded-full bg-secondary-100 p-4 mb-4"><CheckCircle className="h-10 w-10 text-secondary-600" /></div>
        <h2 className="text-xl font-bold text-foreground mb-1">Prescription sent!</h2>
        <p className="text-sm text-muted-foreground">The prescription has been submitted to Beluga. Curexa will be notified automatically.</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Write Prescription</h2>
        <p className="mt-1 text-sm text-muted-foreground">Submit a digital prescription via Beluga Health. Curexa Pharmacy will be notified automatically.</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">

        {/* Visit selector */}
        <div>
          <label className="form-label">Patient Visit</label>
          {visits.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-[color:var(--input)] p-4 text-center">
              <AlertCircle className="h-5 w-5 text-muted-foreground/50 mx-auto mb-1" />
              <p className="text-sm text-muted-foreground">No active visits awaiting prescription.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {visits.map(v => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => { setSelectedVisit(v); setVisitId(v.beluga_master_id ?? '') }}
                  className={`w-full text-left rounded-xl border-2 p-4 transition-colors ${
                    selectedVisit?.id === v.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-[color:var(--input)] hover:border-primary-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{v.chief_complaint ?? 'Visit'}</p>
                    <StatusBadge status={v.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {v.patient_email} · {formatRelative(v.created_at)}
                  </p>
                  {v.questionnaire?.allergies ? (
                    <p className="text-xs text-warning-700 mt-1">⚠️ Allergies: {String(v.questionnaire.allergies)}</p>
                  ) : null}
                </button>
              ))}
            </div>
          )}

          {/* Manual visit ID override */}
          <div className="mt-3">
            <label className="form-label text-xs text-muted-foreground">Or enter Beluga Master ID manually</label>
            <input
              className="form-input text-sm"
              placeholder="master-id-uuid"
              value={visitId}
              onChange={e => { setVisitId(e.target.value); setSelectedVisit(null) }}
            />
          </div>
        </div>

        {/* Medication search */}
        <div className="relative">
          <label className="form-label">Medication</label>
          <input
            className="form-input"
            placeholder="Search medications..."
            value={medSearch}
            onChange={e => { setMedSearch(e.target.value); setSelectedMed(null); setAllergyWarning('') }}
            required
          />
          {medications.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-xl border shadow-card-hover" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              {medications.map(m => (
                <button type="button" key={m.id} onClick={() => selectMed(m)}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-sm hover:bg-primary-50 first:rounded-t-xl last:rounded-b-xl">
                  <span className="font-medium text-foreground">{m.name} {m.strength}</span>
                  <span className="text-xs text-muted-foreground capitalize">{m.form}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {allergyWarning && <AlertBanner variant="error" title="Allergy Conflict" message={allergyWarning} />}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Dosage</label>
            <input className="form-input" placeholder="e.g. 10mg" value={dosage} onChange={e => setDosage(e.target.value)} required />
          </div>
          <div>
            <label className="form-label">Quantity</label>
            <input type="number" className="form-input" min={1} value={quantity} onChange={e => setQuantity(+e.target.value)} required />
          </div>
          <div>
            <label className="form-label">Refills (max 11)</label>
            <input type="number" className="form-input" min={0} max={11} value={refills} onChange={e => setRefills(+e.target.value)} />
          </div>
          <div>
            <label className="form-label">Days Supply</label>
            <input type="number" className="form-input" min={1} max={365} value={daysSupply} onChange={e => setDaysSupply(+e.target.value)} />
          </div>
        </div>

        <div>
          <label className="form-label">Special Instructions</label>
          <textarea className="form-textarea" rows={3} placeholder="e.g. Take with food, avoid alcohol..." value={instructions} onChange={e => setInstructions(e.target.value)} />
        </div>

        {error && <AlertBanner variant="error" title="Error" message={error} />}

        <button type="submit" disabled={loading || !selectedMed || !dosage || (!visitId && !selectedVisit)} className="btn-primary w-full justify-center py-2.5">
          {loading ? <LoadingSpinner className="text-white" /> : 'Submit Prescription via Beluga'}
        </button>
      </form>
    </div>
  )
}
