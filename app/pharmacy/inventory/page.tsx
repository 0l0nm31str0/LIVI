'use client'
import { MOCK_MEDICATIONS } from '@/lib/mock-data'
// Package icon removed; no longer used after status badge refactor

const MOCK_STOCK: Record<string, number> = {
  'med-001': 248, 'med-002': 512, 'med-003': 76, 'med-004': 35, 'med-005': 190, 'med-006': 320,
}

export default function PharmacyInventoryPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Inventory</h2>
        <p className="mt-1 text-sm text-muted-foreground">Current stock levels. Mock data for MVP.</p>
      </div>
      <div className="card">
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
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${low ? 'bg-error-100 text-error-700' : 'bg-secondary-100 text-secondary-700'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${low ? 'bg-error-500' : 'bg-secondary-500'}`} />
                        {stock} units{low ? ' — Low stock' : ''}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
