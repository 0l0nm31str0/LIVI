'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Video, FileText, ChevronRight, ChevronLeft } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { AlertBanner } from '@/components/shared/AlertBanner'
import { toast } from '@/hooks/use-toast'
import { PageHeader } from '@/components/app/PageHeader'
import { StepIndicator } from '@/components/app/StepIndicator'
import { AppCard } from '@/components/app/AppCard'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
        <div className="rounded-full bg-accent-light p-5 mb-5">
          <CheckCircle className="h-12 w-12 text-sage" />
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
    <div className="max-w-2xl page-enter">
      <PageHeader
        title="Start a visit"
        description="Complete your profile and describe your symptoms. A doctor will review your case."
      />

      <StepIndicator
        steps={STEP_ORDER.map(s => STEP_LABELS[s])}
        currentStep={currentIdx}
        className="mb-6"
      />

      <AppCard noPadding>
        <div className="p-6">
        <div key={step} className="animate-fade-in">
        {/* STEP 1: Profile */}
        {step === 'profile' && (
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-foreground">Your Profile</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Used to create your clinical record and match prescriptions.</p>
            </div>

            {/* Visit type selector */}
            <div>
              <Label className="mb-1.5 block">Visit Type</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'async', icon: FileText, title: 'Async Consultation', desc: 'Doctor reviews & responds within 24h' },
                  { value: 'sync',  icon: Video,     title: 'Video Call',         desc: 'Live telemedicine appointment' },
                ].map(({ value, icon: Icon, title, desc }) => {
                  const selected = visitType === value
                  return (
                    <div
                      key={value}
                      className={cn(
                        'rounded-xl',
                        selected && 'ring-2 ring-coral ring-offset-2 ring-offset-surface'
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setVisitType(value as 'async' | 'sync')}
                        className={cn(
                          'w-full rounded-[10px] border p-4 text-left transition-colors',
                          selected
                            ? 'border-ink bg-accent-light'
                            : 'border-border hover:border-ink/30'
                        )}
                      >
                        <Icon className={cn('mb-2 h-5 w-5', selected ? 'text-sage' : 'text-muted-foreground')} />
                        <p className="text-sm font-semibold text-foreground">{title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5 block">Date of Birth <span className="text-destructive">*</span></Label>
                <Input type="date" value={dob} onChange={e => setDob(e.target.value)} required />
              </div>
              <div>
                <Label className="mb-1.5 block">Phone <span className="text-destructive">*</span></Label>
                <Input type="tel" placeholder="(555) 000-0000" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div>
                <Label className="mb-1.5 block">Gender <span className="text-destructive">*</span></Label>
                <Select value={gender || undefined} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other / Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="mb-1.5 block">Street Address <span className="text-destructive">*</span></Label>
              <Input placeholder="123 Main St" value={address} onChange={e => setAddress(e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <Label className="mb-1.5 block">City</Label>
                <Input placeholder="San Francisco" value={city} onChange={e => setCity(e.target.value)} />
              </div>
              <div>
                <Label className="mb-1.5 block">State</Label>
                <Input placeholder="CA" maxLength={2} value={state} onChange={e => setState(e.target.value.toUpperCase())} />
              </div>
              <div>
                <Label className="mb-1.5 block">ZIP</Label>
                <Input placeholder="94105" value={zip} onChange={e => setZip(e.target.value)} />
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
              <Label className="mb-1.5 block">What brings you in today? <span className="text-destructive">*</span></Label>
              <Textarea
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
              <Label className="mb-1.5 block">Describe your symptoms</Label>
              <Textarea rows={3} placeholder="Pain, swelling, redness, fever, fatigue…" value={symptoms} onChange={e => setSymptoms(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5 block">How long have you had this?</Label>
                <Input placeholder="e.g. 3 days, 2 weeks" value={duration} onChange={e => setDuration(e.target.value)} />
              </div>
              <div>
                <Label className="mb-1.5 block">Severity</Label>
                <Select value={severity} onValueChange={setSeverity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild — noticeable but not limiting</SelectItem>
                    <SelectItem value="moderate">Moderate — affecting daily activities</SelectItem>
                    <SelectItem value="severe">Severe — very limiting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="mb-1.5 block">Known allergies (medications, foods, etc.)</Label>
              <Input placeholder="e.g. Penicillin, sulfa drugs, shellfish" value={allergies} onChange={e => setAllergies(e.target.value)} />
            </div>

            <div>
              <Label className="mb-1.5 block">Current medications</Label>
              <Textarea rows={2} placeholder="List any medications, supplements, or vitamins you’re taking…" value={currentMeds} onChange={e => setCurrentMeds(e.target.value)} />
            </div>

            <div>
              <Label className="mb-1.5 block">Existing medical conditions</Label>
              <Input placeholder="e.g. Diabetes, hypertension, asthma" value={conditions} onChange={e => setConditions(e.target.value)} />
            </div>

            {(gender === 'female' || gender === 'other') && (
              <div>
                <Label className="mb-1.5 block">Are you currently pregnant or breastfeeding?</Label>
                <Select value={pregnant || undefined} onValueChange={setPregnant}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="pregnant">Yes, pregnant</SelectItem>
                    <SelectItem value="breastfeeding">Yes, breastfeeding</SelectItem>
                    <SelectItem value="unknown">Unknown / prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label className="mb-1.5 block">Anything else you’d like the doctor to know?</Label>
              <Textarea rows={2} placeholder="Additional context, previous treatments, etc.…" value={additionalNotes} onChange={e => setAdditionalNotes(e.target.value)} />
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

            <div className="rounded-xl bg-accent-light/60 border border-primary-100 p-4 text-sm">
              <p className="font-medium mb-1 text-foreground">What happens next?</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>A licensed physician reviews your submission</li>
                <li>They may follow up with questions via the messaging thread</li>
                <li>If appropriate, they write you a prescription</li>
                <li>Your medication ships directly to your door via Curexa Pharmacy</li>
              </ol>
            </div>

            {error && <AlertBanner variant="error" title="Submission Failed" message={error} />}
          </div>
        )}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={back}
            disabled={currentIdx === 0}
            className={currentIdx === 0 ? 'invisible' : ''}
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>

          {step !== 'review' ? (
            <Button
              type="button"
              onClick={next}
              disabled={step === 'complaint' && !chiefComplaint.trim()}
            >
              Continue <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} disabled={loading}>
              {loading ? <LoadingSpinner className="text-white" /> : 'Submit visit request'}
            </Button>
          )}
        </div>
        </div>
      </AppCard>
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
