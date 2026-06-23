'use client'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { AlertBanner } from '@/components/shared/AlertBanner'
import { MOCK_USERS, MOCK_MEDICAL_HISTORY } from '@/lib/mock-data'
import type { Medication, Pharmacy } from '@/types'

export default function WritePrescriptionPage() {
  return <Suspense fallback={<div className="flex justify-center py-16"><LoadingSpinner className="h-8 w-8 text-primary-700" /></div>}><WritePrescriptionForm /></Suspense>
}

function WritePrescriptionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const user = useAuthStore((s) => s.user)

  const [patientId, setPatientId] = useState(searchParams.get('patient_id') ?? 'user-001')
  const [appointmentId] = useState(searchParams.get('appointment_id') ?? '')
  const [medSearch, setMedSearch] = useState('')
  const [medications, setMedications] = useState<Medication[]>([])
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null)
  const [dosage, setDosage] = useState('')
  const [quantity, setQuantity] = useState(30)
  const [refills, setRefills] = useState(0)
  const [instructions, setInstructions] = useState('')
  const [pharmacyId, setPharmacyId] = useState('')
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [allergyWarning, setAllergyWarning] = useState('')

  useEffect(() => {
    fetch('/api/pharmacies').then(r => r.json()).then(d => setPharmacies(d.data ?? []))
  }, [])

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

    const history = MOCK_MEDICAL_HISTORY.find(h => h.patient_id === patientId)
    if (history) {
      const allergyWords = history.allergies.toLowerCase().split(/[\s,()]+/)
      const ingredient = med.active_ingredient.toLowerCase()
      const conflict = allergyWords.some(w => w.length > 3 && ingredient.includes(w))
      setAllergyWarning(conflict ? `Warning: patient is allergic to "${history.allergies}". ${med.name} may contain conflicting ingredients.` : '')
    }
  }

  const patients = MOCK_USERS.filter(u => u.role === 'patient')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !selectedMed) return
    setLoading(true)
    setError('')

    const res = await fetch('/api/prescriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient_id: patientId,
        doctor_id: user.id,
        appointment_id: appointmentId,
        medication_id: selectedMed.id,
        dosage,
        quantity,
        refills,
        special_instructions: instructions,
        pharmacy_id: pharmacyId || null,
      }),
    })
    const d = await res.json()
    setLoading(false)
    if (d.success) {
      setSuccess(true)
      setTimeout(() => router.push('/doctor/prescriptions'), 2000)
    } else {
      setError(d.error?.message ?? 'Failed to create prescription')
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="rounded-full bg-green-100 p-4 mb-4"><CheckCircle className="h-10 w-10 text-green-600" /></div>
        <h2 className="text-xl font-bold text-foreground mb-1">Prescription sent!</h2>
        <p className="text-sm text-muted-foreground">Patient has been notified. Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Write Prescription</h2>
        <p className="mt-1 text-sm text-muted-foreground">Complete and submit a digital prescription for your patient.</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="form-label">Patient</label>
          <select className="form-select" value={patientId} onChange={e => setPatientId(e.target.value)}>
            {patients.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
          </select>
        </div>

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
            <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-white shadow-card-hover">
              {medications.map(m => (
                <button type="button" key={m.id} onClick={() => selectMed(m)}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-sm hover:bg-primary-50 first:rounded-t-md last:rounded-b-md">
                  <span className="font-medium text-foreground">{m.name} {m.strength}</span>
                  <span className="text-xs text-muted-foreground capitalize">{m.form}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {allergyWarning && <AlertBanner variant="error" title="Allergy Conflict Detected" message={allergyWarning} />}

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
            <label className="form-label">Target Pharmacy</label>
            <select className="form-select" value={pharmacyId} onChange={e => setPharmacyId(e.target.value)}>
              <option value="">Patient selects</option>
              {pharmacies.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="form-label">Special Instructions</label>
          <textarea className="form-textarea" rows={3} placeholder="e.g. Take with food, avoid alcohol..." value={instructions} onChange={e => setInstructions(e.target.value)} />
        </div>

        {error && <AlertBanner variant="error" title="Error" message={error} />}

        <button type="submit" disabled={loading || !selectedMed || !dosage} className="btn-primary w-full justify-center py-2.5">
          {loading ? <LoadingSpinner className="text-white" /> : 'Submit Prescription'}
        </button>
      </form>
    </div>
  )
}
