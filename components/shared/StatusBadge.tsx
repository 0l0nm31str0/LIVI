import { cn } from '@/lib/utils'
import type { PrescriptionStatus, OrderStatus, VisitStatus, CurexaOrderStatus } from '@/types'

type Status =
  | PrescriptionStatus
  | OrderStatus
  | VisitStatus
  | CurexaOrderStatus
  | 'scheduled'
  | 'completed'
  | 'cancelled'
  | string

type BadgeConfig = { label: string; bg: string; text: string; dot: string }

const statusConfig: Record<string, BadgeConfig> = {
  // Appointment
  scheduled:          { label: 'Scheduled',           bg: 'bg-primary-100',   text: 'text-primary-700',   dot: 'bg-primary-500' },
  completed:          { label: 'Completed',           bg: 'bg-secondary-100', text: 'text-secondary-700', dot: 'bg-secondary-500' },
  cancelled:          { label: 'Cancelled',           bg: 'bg-error-100',     text: 'text-error-700',     dot: 'bg-error-500' },

  // Visit statuses
  draft:              { label: 'Draft',               bg: 'bg-muted/20',      text: 'text-muted-foreground', dot: 'bg-muted-foreground' },
  submitted:          { label: 'Submitted',           bg: 'bg-primary-100',   text: 'text-primary-700',   dot: 'bg-primary-400' },
  under_review:       { label: 'Under Review',        bg: 'bg-warning-100',   text: 'text-warning-800',   dot: 'bg-warning-500' },
  active:             { label: 'In Consultation',     bg: 'bg-primary-100',   text: 'text-primary-700',   dot: 'bg-primary-600' },
  prescribed:         { label: 'Rx Written',          bg: 'bg-secondary-50',  text: 'text-secondary-700', dot: 'bg-secondary-500' },
  shipped:            { label: 'Shipped',             bg: 'bg-primary-50',    text: 'text-primary-700',   dot: 'bg-primary-400' },
  delivered:          { label: 'Delivered',           bg: 'bg-secondary-100', text: 'text-secondary-700', dot: 'bg-secondary-600' },

  // Prescription statuses
  pending:            { label: 'Pending',             bg: 'bg-warning-100',   text: 'text-warning-800',   dot: 'bg-warning-500' },
  sent_to_pharmacy:   { label: 'Sent to Pharmacy',   bg: 'bg-primary-100',   text: 'text-primary-700',   dot: 'bg-primary-400' },
  pharmacy_confirmed: { label: 'Ready',              bg: 'bg-secondary-100', text: 'text-secondary-700', dot: 'bg-secondary-500' },
  ordered:            { label: 'Ordered',             bg: 'bg-primary-100',   text: 'text-primary-700',   dot: 'bg-primary-500' },
  fulfilled:          { label: 'Fulfilled',           bg: 'bg-secondary-100', text: 'text-secondary-700', dot: 'bg-secondary-600' },

  // Order statuses
  pending_payment:    { label: 'Pending Payment',     bg: 'bg-warning-100',   text: 'text-warning-700',   dot: 'bg-warning-500' },
  payment_confirmed:  { label: 'Paid',               bg: 'bg-secondary-100', text: 'text-secondary-700', dot: 'bg-secondary-500' },
  preparing:          { label: 'Preparing',           bg: 'bg-warning-50',    text: 'text-warning-700',   dot: 'bg-warning-400' },

  // Curexa order statuses
  new:                { label: 'Order Received',      bg: 'bg-primary-50',    text: 'text-primary-700',   dot: 'bg-primary-400' },
  processing:         { label: 'Processing',          bg: 'bg-warning-100',   text: 'text-warning-700',   dot: 'bg-warning-500' },
  payment_required:   { label: 'Payment Required',    bg: 'bg-error-100',     text: 'text-error-700',     dot: 'bg-error-400' },
  in_progress:        { label: 'Being Filled',        bg: 'bg-warning-50',    text: 'text-warning-700',   dot: 'bg-warning-400' },
  out_for_delivery:   { label: 'Out for Delivery',    bg: 'bg-primary-100',   text: 'text-primary-700',   dot: 'bg-primary-500' },
  error:              { label: 'Error',               bg: 'bg-error-100',     text: 'text-error-700',     dot: 'bg-error-500' },
}

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const config = statusConfig[status] ?? {
    label: status.replace(/_/g, ' '),
    bg: 'bg-muted/10',
    text: 'text-muted-foreground',
    dot: 'bg-muted-foreground',
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
