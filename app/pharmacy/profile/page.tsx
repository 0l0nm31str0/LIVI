'use client'
import { useAuthStore } from '@/stores/auth-store'
import { MOCK_PHARMACIES } from '@/lib/mock-data'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'

export default function PharmacyProfilePage() {
  const user = useAuthStore((s) => s.user)
  const pharmacy = MOCK_PHARMACIES.find(p => p.manager_id === user?.id)

  return (
    <div className="max-w-2xl space-y-6 page-enter">
      <PageHeader title="Pharmacy profile" />

      {pharmacy ? (
        <AppCard title={pharmacy.name}>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-xs text-muted-foreground">Address</p><p className="font-medium">{pharmacy.address}</p></div>
            <div><p className="text-xs text-muted-foreground">City, State</p><p className="font-medium">{pharmacy.city}, {pharmacy.state} {pharmacy.zip_code}</p></div>
            <div><p className="text-xs text-muted-foreground">Phone</p><p className="font-medium">{pharmacy.phone}</p></div>
            <div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium">{pharmacy.email}</p></div>
            <div><p className="text-xs text-muted-foreground">NPI Number</p><p className="font-mono text-xs font-medium">{pharmacy.npi_number}</p></div>
            <div><p className="text-xs text-muted-foreground">LegitScript ID</p><p className="font-mono text-xs font-medium">{pharmacy.legit_script_id}</p></div>
            <div><p className="text-xs text-muted-foreground">Manager</p><p className="font-medium">{user?.first_name} {user?.last_name}</p></div>
            <div><p className="text-xs text-muted-foreground">Status</p>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${pharmacy.is_active ? 'bg-accent-light text-primary-700' : 'bg-muted/10 text-muted-foreground'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${pharmacy.is_active ? 'bg-primary' : 'bg-muted'}`} />
                {pharmacy.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </AppCard>
      ) : (
        <p className="text-sm text-muted-foreground">No pharmacy profile found.</p>
      )}
    </div>
  )
}
