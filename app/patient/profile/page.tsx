'use client'
import { useAuthStore } from '@/stores/auth-store'
import { MOCK_MEDICAL_HISTORY } from '@/lib/mock-data'
import { AlertBanner } from '@/components/shared/AlertBanner'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'
import { Badge } from '@/components/ui/badge'

export default function PatientProfilePage() {
  const user = useAuthStore((s) => s.user)
  const history = MOCK_MEDICAL_HISTORY.find(h => h.patient_id === user?.id)

  return (
    <div className="max-w-2xl space-y-6 page-enter">
      <PageHeader
        title="My profile"
        description="Personal information and medical history."
      />

      <AppCard title="Personal info">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-xs text-muted-foreground">First Name</p><p className="font-medium">{user?.first_name}</p></div>
          <div><p className="text-xs text-muted-foreground">Last Name</p><p className="font-medium">{user?.last_name}</p></div>
          <div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium">{user?.email}</p></div>
          <div><p className="text-xs text-muted-foreground">Role</p><p className="font-medium capitalize">{user?.role}</p></div>
        </div>
      </AppCard>

      {history && (
        <AppCard title="Medical history">
          <div className="space-y-4">
            <AlertBanner variant="warning" title={`Allergies: ${history.allergies}`} />
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Conditions</p>
              <div className="flex flex-wrap gap-2">
                {history.conditions.map(c => (
                  <Badge key={c} variant="secondary" className="bg-accent-light text-primary-700 hover:bg-accent-light">{c}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Current Medications</p>
              <ul className="space-y-1">
                {history.current_medications.map(m => (
                  <li key={m} className="text-sm text-foreground flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            {history.notes && <p className="text-xs text-muted-foreground italic">{history.notes}</p>}
          </div>
        </AppCard>
      )}
    </div>
  )
}
