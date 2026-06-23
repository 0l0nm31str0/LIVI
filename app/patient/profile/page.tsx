'use client'
import { useAuthStore } from '@/stores/auth-store'
import { MOCK_MEDICAL_HISTORY } from '@/lib/mock-data'
import { User, Heart } from 'lucide-react'
import { AlertBanner } from '@/components/shared/AlertBanner'

export default function PatientProfilePage() {
  const user = useAuthStore((s) => s.user)
  const history = MOCK_MEDICAL_HISTORY.find(h => h.patient_id === user?.id)

  return (
    <div className="max-w-2xl space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">My Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">Personal information and medical history.</p>
      </div>

      <div className="card">
        <div className="card-header flex items-center gap-2"><User className="h-4 w-4 text-primary-700" /><h3 className="text-sm font-semibold">Personal Info</h3></div>
        <div className="card-body grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-xs text-muted-foreground">First Name</p><p className="font-medium">{user?.first_name}</p></div>
          <div><p className="text-xs text-muted-foreground">Last Name</p><p className="font-medium">{user?.last_name}</p></div>
          <div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium">{user?.email}</p></div>
          <div><p className="text-xs text-muted-foreground">Role</p><p className="font-medium capitalize">{user?.role}</p></div>
        </div>
      </div>

      {history && (
        <div className="card">
          <div className="card-header flex items-center gap-2"><Heart className="h-4 w-4 text-destructive" /><h3 className="text-sm font-semibold">Medical History</h3></div>
          <div className="card-body space-y-4">
            <AlertBanner variant="warning" title={`Allergies: ${history.allergies}`} />
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Conditions</p>
              <div className="flex flex-wrap gap-2">
                {history.conditions.map(c => (
                  <span key={c} className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">{c}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Current Medications</p>
              <ul className="space-y-1">
                {history.current_medications.map(m => (
                  <li key={m} className="text-sm text-foreground flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-700 shrink-0" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            {history.notes && <p className="text-xs text-muted-foreground italic">{history.notes}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
