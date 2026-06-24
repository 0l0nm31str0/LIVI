import { cn } from '@/lib/utils'
import type { PrescriptionStatus, OrderStatus } from '@/types'

type Status = PrescriptionStatus | OrderStatus | 'scheduled' | 'completed' | 'cancelled'

type BadgeConfig = { label: string; bg: string; text: string; dot: string }

const statusConfig: Record<string, BadgeConfig> = {
  pending:           { label: 'Pending',           bg: 'bg-warning-100',   text: 'text-warning-800',   dot: 'bg-warning-500' },
  scheduled:         { label: 'Scheduled',         bg: 'bg-primary-100',   text: 'text-primary-700',   dot: 'bg-primary-500' },
  completed:         { label: 'Completed',         bg: 'bg-secondary-100', text: 'text-secondary-700', dot: 'bg-secondary-500' },
  cancelled:         { label: 'Cancelled',         bg: 'bg-error-100',     text: 'text-error-700',     dot: 'bg-error-500' },
  sent_to_pharmacy:  { label: 'Sent to Pharmacy',  bg: 'bg-primary-100',   text: 'text-primary-700',   dot: 'bg-primary-400' },
  pharmacy_confirmed:{ label: 'Ready',             bg: 'bg-secondary-100', text: 'text-secondary-700', dot: 'bg-secondary-500' },
  ordered:           { label: 'Ordered',           bg: 'bg-primary-100',   text: 'text-primary-700',   dot: 'bg-primary-500' },
  fulfilled:         { label: 'Fulfilled',         bg: 'bg-secondary-100', text: 'text-secondary-700', dot: 'bg-secondary-600' },
  pending_payment:   { label: 'Pending Payment',   bg: 'bg-warning-100',   text: 'text-warning-700',   dot: 'bg-warning-500' },
  payment_confirmed: { label: 'Paid',              bg: 'bg-secondary-100', text: 'text-secondary-700', dot: 'bg-secondary-500' },
  preparing:         { label: 'Preparing',         bg: 'bg-warning-50',    text: 'text-warning-700',   dot: 'bg-warning-400' },
  shipped:           { label: 'Shipped',           bg: 'bg-primary-50',    text: 'text-primary-700',   dot: 'bg-primary-400' },
  delivered:         { label: 'Delivered',         bg: 'bg-secondary-100', text: 'text-secondary-700', dot: 'bg-secondary-600' },
}

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const config = statusConfig[status] ?? {
    label: status,
    bg: 'bg-muted/10',
    text: 'text-muted-foreground',
    dot: 'bg-muted',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        config.bg,
        config.text,
        className
      )}
    >
      <span aria-hidden className={cn('h-1.5 w-1.5 shrink-0 rounded-full', config.dot)} />
      {config.label}
    </span>
  )
}
