'use client'
import { useAuthStore } from '@/stores/auth-store'
import { MOCK_PHARMACIES } from '@/lib/mock-data'
import { Building2 } from 'lucide-react'

export default function PharmacyProfilePage() {
  const user = useAuthStore((s) => s.user)
  const pharmacy = MOCK_PHARMACIES.find(p => p.manager_id === user?.id)

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-xl font-bold text-foreground">Pharmacy Profile</h2>

      {pharmacy ? (
        <div className="card">
          <div className="card-header flex items-center gap-2"><Building2 className="h-4 w-4 text-primary-700" /><h3 className="text-sm font-semibold">{pharmacy.name}</h3></div>
          <div className="card-body grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-xs text-muted-foreground">Address</p><p className="font-medium">{pharmacy.address}</p></div>
            <div><p className="text-xs text-muted-foreground">City, State</p><p className="font-medium">{pharmacy.city}, {pharmacy.state} {pharmacy.zip_code}</p></div>
            <div><p className="text-xs text-muted-foreground">Phone</p><p className="font-medium">{pharmacy.phone}</p></div>
            <div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium">{pharmacy.email}</p></div>
            <div><p className="text-xs text-muted-foreground">NPI Number</p><p className="font-mono text-xs font-medium">{pharmacy.npi_number}</p></div>
            <div><p className="text-xs text-muted-foreground">LegitScript ID</p><p className="font-mono text-xs font-medium">{pharmacy.legit_script_id}</p></div>
            <div><p className="text-xs text-muted-foreground">Manager</p><p className="font-medium">{user?.first_name} {user?.last_name}</p></div>
            <div><p className="text-xs text-muted-foreground">Status</p><span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">{pharmacy.is_active ? 'Active' : 'Inactive'}</span></div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No pharmacy profile found.</p>
      )}
    </div>
  )
}
