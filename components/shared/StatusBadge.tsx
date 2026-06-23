import { cn } from '@/lib/utils'
import type { PrescriptionStatus, OrderStatus } from '@/types'

type Status = PrescriptionStatus | OrderStatus | 'scheduled' | 'completed' | 'cancelled'

const statusConfig: Record<string, { label: string; classes: string }> = {
  pending: { label: 'Pending', classes: 'bg-gray-100 text-gray-700' },
  scheduled: { label: 'Scheduled', classes: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completed', classes: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', classes: 'bg-red-100 text-red-700' },
  sent_to_pharmacy: { label: 'Sent to Pharmacy', classes: 'bg-blue-100 text-blue-700' },
  pharmacy_confirmed: { label: 'Ready', classes: 'bg-teal-100 text-teal-700' },
  ordered: { label: 'Ordered', classes: 'bg-indigo-100 text-indigo-700' },
  fulfilled: { label: 'Fulfilled', classes: 'bg-green-100 text-green-700' },
  pending_payment: { label: 'Pending Payment', classes: 'bg-yellow-100 text-yellow-700' },
  payment_confirmed: { label: 'Payment Confirmed', classes: 'bg-blue-100 text-blue-700' },
  preparing: { label: 'Preparing', classes: 'bg-amber-100 text-amber-700' },
  shipped: { label: 'Shipped', classes: 'bg-indigo-100 text-indigo-700' },
  delivered: { label: 'Delivered', classes: 'bg-green-100 text-green-700' },
}

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const config = statusConfig[status] ?? { label: status, classes: 'bg-gray-100 text-gray-700' }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.classes,
        className
      )}
    >
      {config.label}
    </span>
  )
}
