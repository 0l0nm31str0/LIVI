'use client'
import Link from 'next/link'
import { Star, Calendar } from 'lucide-react'
import { MOCK_DOCTORS } from '@/lib/mock-data'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function BrowseDoctorsPage() {
  const doctors = MOCK_DOCTORS

  return (
    <div className="page-enter">
      <PageHeader
        title="Find a doctor"
        description="Browse licensed physicians available for telemedicine consultations."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doc, i) => (
          <AppCard key={doc.id} >
            <div className="flex items-start gap-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-accent-light text-primary font-semibold">
                  {doc.first_name[0]}{doc.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-foreground">Dr. {doc.first_name} {doc.last_name}</h3>
                <p className="text-xs text-muted-foreground">{doc.specialty}</p>
                <div className="mt-1 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-medium text-foreground">{doc.rating}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{doc.bio}</p>
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${doc.available ? 'bg-accent-light text-primary-700' : 'bg-muted/10 text-muted-foreground'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${doc.available ? 'bg-primary' : 'bg-muted'}`} />
                {doc.available ? 'Available today' : 'Unavailable'}
              </span>
              <Link href="/patient/appointments/new">
                <Button size="sm">
                  <Calendar className="h-3.5 w-3.5" /> Book
                </Button>
              </Link>
            </div>
          </AppCard>
        ))}
      </div>
    </div>
  )
}
