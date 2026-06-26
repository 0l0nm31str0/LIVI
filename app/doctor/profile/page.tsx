'use client'
import { useAuthStore } from '@/stores/auth-store'
import { MOCK_DOCTORS } from '@/lib/mock-data'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Star } from 'lucide-react'

export default function DoctorProfilePage() {
  const user = useAuthStore((s) => s.user)
  const doc = MOCK_DOCTORS.find(d => d.id === user?.id)

  return (
    <div className="max-w-2xl space-y-6 page-enter">
      <PageHeader title="My profile" />

      <AppCard title="Physician info">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-accent-light text-primary text-xl font-bold">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Dr. {user?.first_name} {user?.last_name}</h3>
              <p className="text-sm text-muted-foreground">{doc?.specialty}</p>
              {doc?.rating && (
                <div className="mt-1 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-medium">{doc.rating} rating</span>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t border-border">
            <div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium">{user?.email}</p></div>
            <div><p className="text-xs text-muted-foreground">License</p><p className="font-medium">{doc?.license_number ?? 'N/A'}</p></div>
            <div className="col-span-2"><p className="text-xs text-muted-foreground">Bio</p><p>{doc?.bio}</p></div>
          </div>
        </div>
      </AppCard>
    </div>
  )
}
