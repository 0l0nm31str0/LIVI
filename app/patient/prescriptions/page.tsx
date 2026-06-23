'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { formatDate } from '@/lib/utils'
import type { Prescription } from '@/types'

const MED_NAMES: Record<string, string> = {
  'med-001': 'Lisinopril 10mg',
  'med-002': 'Metformin 500mg',
  'med-003': 'Dextromethorphan HBr 500mg',
  'med-004': 'Amoxicillin 500mg',
  'med-005': 'Atorvastatin 20mg',
  'med-006': 'Omeprazole 20mg',
}

export default function PatientPrescriptionsPage() {
  const user = useAuthStore((s) => s.user)
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])

  useEffect(() => {
    if (!user) return
    fetch(`/api/prescriptions?patient_id=${user.id}`).then(r => r.json()).then(d => setPrescriptions(d.data ?? []))
  }, [user])

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">My Prescriptions</h2>
        <p className="mt-1 text-sm text-muted-foreground">View and manage all your prescriptions.</p>
      </div>

      <div className="card">
        {prescriptions.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={FileText} title="No prescriptions yet" description="After your consultation, your doctor will send prescriptions here." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Medication</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Dosage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Qty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Refills</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Prescribed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {prescriptions.map(rx => (
                  <tr key={rx.id} className="table-row-hover">
                    <td className="px-6 py-4 font-medium text-foreground">{MED_NAMES[rx.medication_id] ?? rx.medication_id}</td>
                    <td className="px-6 py-4">{rx.dosage}</td>
                    <td className="px-6 py-4">{rx.quantity}</td>
                    <td className="px-6 py-4">{rx.refills}</td>
                    <td className="px-6 py-4 text-muted-foreground">{formatDate(rx.prescribed_date)}</td>
                    <td className="px-6 py-4"><StatusBadge status={rx.status} /></td>
                    <td className="px-6 py-4">
                      <Link href={`/patient/prescriptions/${rx.id}`} className="text-xs font-medium text-primary-700 hover:underline">Details</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
