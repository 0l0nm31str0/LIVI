'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { MOCK_DOCTORS } from '@/lib/mock-data'

const TIME_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']

export default function BookAppointmentPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const [doctorId, setDoctorId] = useState('user-002')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split('T')[0]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setError('')
    setLoading(true)
    const appointmentDate = `${date}T${time}:00.000Z`
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient_id: user.id, doctor_id: doctorId, appointment_date: appointmentDate, notes }),
    })
    const d = await res.json()
    setLoading(false)
    if (d.success) {
      setSuccess(true)
      setTimeout(() => router.push('/patient/dashboard'), 2000)
    } else {
      setError(d.error?.message ?? 'Failed to book appointment')
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="rounded-full bg-green-100 p-4 mb-4"><CheckCircle className="h-10 w-10 text-green-600" /></div>
        <h2 className="text-xl font-bold text-foreground mb-1">Appointment booked!</h2>
        <p className="text-sm text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Book an Appointment</h2>
        <p className="mt-1 text-sm text-muted-foreground">Schedule a telemedicine consultation with a licensed physician.</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="form-label">Select Doctor</label>
          <select className="form-select" value={doctorId} onChange={e => setDoctorId(e.target.value)}>
            {MOCK_DOCTORS.map(d => (
              <option key={d.id} value={d.id} disabled={!d.available}>
                Dr. {d.first_name} {d.last_name} - {d.specialty}{!d.available ? ' (Unavailable)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Appointment Date</label>
          <input type="date" className="form-input" value={date} min={minDateStr} onChange={e => setDate(e.target.value)} required />
        </div>

        <div>
          <label className="form-label">Time Slot</label>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map(slot => (
              <button type="button" key={slot} onClick={() => setTime(slot)}
                className={`rounded-md border py-2 text-sm font-medium transition-colors ${time === slot ? 'border-primary-700 bg-primary-700 text-white' : 'border-border bg-white text-foreground hover:bg-muted'}`}>
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="form-label">Chief Complaint</label>
          <textarea className="form-textarea" rows={3} placeholder="Describe what you're experiencing..." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button type="submit" disabled={loading || !date || !time} className="btn-primary w-full justify-center py-2.5">
          {loading ? <LoadingSpinner className="text-white" /> : <><Calendar className="h-4 w-4" /> Confirm Booking</>}
        </button>
      </form>
    </div>
  )
}
