'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Video, FileText, ChevronRight, ChevronLeft } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { AlertBanner } from '@/components/shared/AlertBanner'

type Step = 'profile' | 'complaint' | 'questionnaire' | 'review'

const STEP_ORDER: Step[] = ['profile', 'complaint', 'questionnaire', 'review']

const STEP_LABELS: Record<Step, string> = {
  profile: 'Your Profile',
  complaint: 'Chief Complaint',
  questionnaire: 'Health Questions',
  review: 'Review & Submit',
}

export default function BookVisitPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)

  const [step, setStep] = useState<Step>('profile')
  const [visitType, setVisitType] = useState<'async' | 'sync'>('async')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Profile
  const [dob, setDob] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')

  // Complaint
  const [chiefComplaint, setChiefComplaint] = useState('')

  // Questionnaire
  const [symptoms, setSymptoms] = useState('')
  const [duration, setDuration] = useState('')
  const [severity, setSeverity] = useState('moderate')
  const [allergies, setAllergies] = useState('')
  const [currentMeds, setCurrentMeds] = useState('')
  const [conditions, setConditions] = useState('')
  const [pregnant, setPregnant] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')

  const currentIdx = STEP_ORDER.indexOf(step)

  function next() {
    if (currentIdx < STEP_ORDER.length - 1) setStep(STEP_ORDER[currentIdx + 1])
  }
  function back() {
    if (currentIdx > 0) setStep(STEP_ORDER[currentIdx - 1])
  }

  async function handleSubmit() {
    if (!user) return
    setLoading(true)
    setError('')

    const res = await fetch('/api/visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient_id: user.id,
        patient_email: user.email,
        visit_type: visitType,
        chief_complaint: chiefComplaint,
        questionnaire: {
          symptoms,
          duration,
          severity,
          allergies,
          current_medications: currentMeds,
          existing_conditions: conditions,
          pregnant,
          additional_notes: additionalNotes,
        },
        profile: {
          first_name: user.first_name,
          last_name: user.last_name,
          date_of_birth: dob,
          phone,
          gender,
          address_line1: address,
          city,
          state,
          zip,
        },
      }),
    })

    const d = await res.json()
    setLoading(false)

    if (d.success) {
      setSuccess(true)
      setTimeout(() => router.push('/patient/dashboard'), 2500)
    } else {
      setError(d.error?.message ?? 'Failed to create visit. Please try again.')
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-secondary-100 p-5 mb-5">
          <CheckCircle className="h-12 w-12 text-secondary-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Visit request submitted!</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          A licensed physician will review your case and follow up within 24 hours.
          You’ll be notified by email.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">Redirecting to your dashboard…</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Start a Visit</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete your profile and describe your symptoms. A doctor will review your case.
        </p>
      </div>

      {/* Step indicator */}
      <div className="mb-6 flex items-center gap-2">
        {STEP_ORDER.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
              i < currentIdx ? 'bg-secondary-600 text-white' :
              i === currentIdx ? 'bg-primary-600 text-white' :
              'bg-muted/20 text-muted-foreground'
            }`}>
              {i < currentIdx ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-medium hide-mobile ${
              i === currentIdx ? 'text-foreground' : 'text-muted-foreground'
            }`}>{STEP_LABELS[s]}</span>
            {i < STEP_ORDER.length - 1 && <div className="h-px w-6 bg-border" />}
          </div>
        ))}
      </div>

      <div className="card p-6">
        {/* STEP 1: Profile */}
        {step === 'profile' && (
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-foreground">Your Profile</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Used to create your clinical record and match prescriptions.</p>
            </div>

            {/* Visit type selector */}
            <div>
              <label className="form-label">Visit Type</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'async', icon: FileText, title: 'Async Consultation', desc: 'Doctor reviews & responds within 24h' },
                  { value: 'sync',  icon: Video,     title: 'Video Call',         desc: 'Live telemedicine appointment' },
                ].map(({ value, icon: Icon, title, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setVisitType(value as 'async' | 'sync')}
                    className={`rounded-xl border-2 p-4 text-left transition-colors ${
                      visitType === value
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-[color:var(--input)] hover:border-primary-200'
                    }`}
                  >
                    <Icon className={`h-5 w-5 mb-2 ${ visitType === value ? 'text-primary-600' : 'text-muted-foreground' }`} />
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Date of Birth <span className="text-destructive">*</span></label>
                <input type="date" className="form-input" value={dob} onChange={e => setDob(e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Phone <span className="text-destructive">*</span></label>
                <input type="tel" className="form-input" placeholder="(555) 000-0000" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Gender <span className="text-destructive">*</span></label>
                <select className="form-select" value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="">Select…</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other / Prefer not to say</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Street Address <span className="text-destructive">*</span></label>
              <input className="form-input" placeholder="123 Main St" value={address} onChange={e => setAddress(e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="form-label">City</label>
                <input className="form-input" placeholder="San Francisco" value={city} onChange={e => setCity(e.target.value)} />
              </div>
              <div>
                <label className="form-label">State</label>
                <input className="form-input" placeholder="CA" maxLength={2} value={state} onChange={e => setState(e.target.value.toUpperCase())} />
              </div>
              <div>
                <label className="form-label">ZIP</label>
                <input className="form-input" placeholder="94105" value={zip} onChange={e => setZip(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Chief Complaint */}
        {step === 'complaint' && (
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-foreground">Chief Complaint</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Briefly describe the primary reason for your visit.</p>
            </div>
            <div>
              <label className="form-label">What brings you in today? <span className="text-destructive">*</span></label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="e.g. I’ve had a persistent sore throat and mild fever for 3 days..."
                value={chiefComplaint}
                onChange={e => setChiefComplaint(e.target.value)}
              />
              <p className="form-hint">Be as specific as possible. This is the first thing the doctor will read.</p>
            </div>
          </div>
        )}

        {/* STEP 3: Questionnaire */}
        {step === 'questionnaire' && (
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-foreground">Health Questions</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Help your doctor understand your situation fully.</p>
            </div>

            <div>
              <label className="form-label">Describe your symptoms</label>
              <textarea className="form-textarea" rows={3} placeholder="Pain, swelling, redness, fever, fatigue…" value={symptoms} onChange={e => setSymptoms(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">How long have you had this?</label>
                <input className="form-input" placeholder="e.g. 3 days, 2 weeks" value={duration} onChange={e => setDuration(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Severity</label>
                <select className="form-select" value={severity} onChange={e => setSeverity(e.target.value)}>
                  <option value="mild">Mild — noticeable but not limiting</option>
                  <option value="moderate">Moderate — affecting daily activities</option>
                  <option value="severe">Severe — very limiting</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Known allergies (medications, foods, etc.)</label>
              <input className="form-input" placeholder="e.g. Penicillin, sulfa drugs, shellfish" value={allergies} onChange={e => setAllergies(e.target.value)} />
            </div>

            <div>
              <label className="form-label">Current medications</label>
              <textarea className="form-textarea" rows={2} placeholder="List any medications, supplements, or vitamins you’re taking…" value={currentMeds} onChange={e => setCurrentMeds(e.target.value)} />
            </div>

            <div>
              <label className="form-label">Existing medical conditions</label>
              <input className="form-input" placeholder="e.g. Diabetes, hypertension, asthma" value={conditions} onChange={e => setConditions(e.target.value)} />
            </div>

            {(gender === 'female' || gender === 'other') && (
              <div>
                <label className="form-label">Are you currently pregnant or breastfeeding?</label>
                <select className="form-select" value={pregnant} onChange={e => setPregnant(e.target.value)}>
                  <option value="">Select…</option>
                  <option value="no">No</option>
                  <option value="pregnant">Yes, pregnant</option>
                  <option value="breastfeeding">Yes, breastfeeding</option>
                  <option value="unknown">Unknown / prefer not to say</option>
                </select>
              </div>
            )}

            <div>
              <label className="form-label">Anything else you’d like the doctor to know?</label>
              <textarea className="form-textarea" rows={2} placeholder="Additional context, previous treatments, etc.…" value={additionalNotes} onChange={e => setAdditionalNotes(e.target.value)} />
            </div>
          </div>
        )}

        {/* STEP 4: Review */}
        {step === 'review' && (
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-foreground">Review Your Visit</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Confirm the details before submitting.</p>
            </div>

            <div className="rounded-xl border border-[color:var(--border)] divide-y divide-border text-sm">
              <ReviewRow label="Visit Type" value={visitType === 'async' ? 'Async Consultation (24h response)' : 'Video Call'} />
              <ReviewRow label="Chief Complaint" value={chiefComplaint} />
              <ReviewRow label="Symptoms" value={symptoms || '—'} />
              <ReviewRow label="Duration" value={duration || '—'} />
              <ReviewRow label="Severity" value={severity} />
              <ReviewRow label="Allergies" value={allergies || 'None reported'} />
              <ReviewRow label="Current Medications" value={currentMeds || 'None reported'} />
              <ReviewRow label="Existing Conditions" value={conditions || 'None reported'} />
              <ReviewRow label="Shipping Address" value={[address, city, state, zip].filter(Boolean).join(', ') || '—'} />
            </div>

            <div className="rounded-xl bg-primary-50 border border-primary-200 p-4 text-sm text-primary-900">
              <p className="font-semibold mb-1">What happens next?</p>
              <ol className="list-decimal list-inside space-y-1 text-primary-800">
                <li>A licensed physician reviews your submission</li>
                <li>They may follow up with questions via the messaging thread</li>
                <li>If appropriate, they write you a prescription</li>
                <li>Your medication ships directly to your door via Curexa Pharmacy</li>
              </ol>
            </div>

            {error && <AlertBanner variant="error" title="Submission Failed" message={error} />}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            disabled={currentIdx === 0}
            className="btn-secondary disabled:opacity-0 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>

          {step !== 'review' ? (
            <button
              type="button"
              onClick={next}
              disabled={step === 'complaint' && !chiefComplaint.trim()}
              className="btn-primary"
            >
              Continue <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? <LoadingSpinner className="text-white" /> : 'Submit Visit Request'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 px-4 py-3">
      <span className="w-40 shrink-0 text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  )
}
