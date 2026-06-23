'use client'
import Link from 'next/link'
import { Star, Calendar } from 'lucide-react'
import { MOCK_DOCTORS } from '@/lib/mock-data'

export default function BrowseDoctorsPage() {
  const doctors = MOCK_DOCTORS

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Find a Doctor</h2>
        <p className="mt-1 text-sm text-muted-foreground">Browse licensed physicians available for telemedicine consultations.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map(doc => (
          <div key={doc.id} className="card p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-base font-bold text-primary-700">
                {doc.first_name[0]}{doc.last_name[0]}
              </div>
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
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${doc.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {doc.available ? 'Available today' : 'Unavailable'}
              </span>
              <Link href="/patient/appointments/new" className="btn-primary text-xs px-3 py-1.5">
                <Calendar className="h-3.5 w-3.5" /> Book
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
