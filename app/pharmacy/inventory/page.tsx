'use client'
import { MOCK_MEDICATIONS } from '@/lib/mock-data'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'

const MOCK_STOCK: Record<string, number> = {
  'med-001': 248, 'med-002': 512, 'med-003': 76, 'med-004': 35, 'med-005': 190, 'med-006': 320,
}

export default function PharmacyInventoryPage() {
  return (
    <div className="page-enter">
      <PageHeader
        title="Inventory"
        description="Current stock levels. Mock data for MVP."
      />
      <AppCard noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Medication</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Active Ingredient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Strength</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Form</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">NDC Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_MEDICATIONS.map(med => {
                const stock = MOCK_STOCK[med.id] ?? 0
                const low = stock < 50
                return (
                  <tr key={med.id} className="table-row-hover">
                    <td className="px-6 py-4 font-medium text-foreground">{med.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{med.active_ingredient}</td>
                    <td className="px-6 py-4">{med.strength}</td>
                    <td className="px-6 py-4 capitalize text-muted-foreground">{med.form}</td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{med.ndc_code}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${low ? 'bg-error-100 text-error-700' : 'bg-accent-light text-primary-700'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${low ? 'bg-error-600' : 'bg-primary'}`} />
                        {stock} units{low ? ' — Low stock' : ''}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </AppCard>
    </div>
  )
}
