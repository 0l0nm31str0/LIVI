import type { VariantProps } from 'class-variance-authority'
import { Badge, badgeVariants } from '@/components/ui/badge'
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

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>

type StatusConfig = { label: string; variant: BadgeVariant; dot: string }

const statusConfig: Record<string, StatusConfig> = {
  // Appointment
  scheduled:          { label: 'Scheduled',           variant: 'default',     dot: 'bg-primary' },
  completed:            { label: 'Completed',           variant: 'secondary',   dot: 'bg-stone-500' },
  cancelled:            { label: 'Cancelled',           variant: 'destructive', dot: 'bg-error-600' },

  // Visit statuses
  draft:                { label: 'Draft',               variant: 'outline',     dot: 'bg-muted-foreground' },
  submitted:            { label: 'Submitted',           variant: 'default',     dot: 'bg-primary-400' },
  under_review:         { label: 'Under Review',        variant: 'warning',     dot: 'bg-warning-600' },
  active:               { label: 'In Consultation',     variant: 'default',     dot: 'bg-primary-600' },
  prescribed:           { label: 'Rx Written',          variant: 'secondary',   dot: 'bg-stone-500' },
  shipped:              { label: 'Shipped',             variant: 'default',     dot: 'bg-primary-400' },
  delivered:            { label: 'Delivered',           variant: 'success',     dot: 'bg-success-600' },

  // Prescription statuses
  pending:              { label: 'Pending',             variant: 'warning',     dot: 'bg-warning-600' },
  sent_to_pharmacy:     { label: 'Sent to Pharmacy',    variant: 'default',     dot: 'bg-primary-400' },
  pharmacy_confirmed:   { label: 'Ready',               variant: 'success',     dot: 'bg-success-600' },
  ordered:              { label: 'Ordered',             variant: 'default',     dot: 'bg-primary' },
  fulfilled:            { label: 'Fulfilled',           variant: 'success',     dot: 'bg-success-600' },

  // Order statuses
  pending_payment:      { label: 'Pending Payment',     variant: 'warning',     dot: 'bg-warning-600' },
  payment_confirmed:    { label: 'Paid',                variant: 'success',     dot: 'bg-success-600' },
  preparing:            { label: 'Preparing',           variant: 'warning',     dot: 'bg-warning-600' },

  // Curexa order statuses
  new:                  { label: 'Order Received',      variant: 'default',     dot: 'bg-primary-400' },
  processing:           { label: 'Processing',          variant: 'warning',     dot: 'bg-warning-600' },
  payment_required:     { label: 'Payment Required',    variant: 'destructive', dot: 'bg-error-600' },
  in_progress:          { label: 'Being Filled',        variant: 'warning',     dot: 'bg-warning-600' },
  out_for_delivery:     { label: 'Out for Delivery',    variant: 'default',     dot: 'bg-primary' },
  error:                { label: 'Error',               variant: 'destructive', dot: 'bg-error-600' },
}

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const config = statusConfig[status] ?? {
    label: status.replace(/_/g, ' '),
    variant: 'outline' as const,
    dot: 'bg-muted-foreground',
  }

  return (
    <Badge variant={config.variant} className={cn('gap-1.5 whitespace-nowrap', className)}>
      <span aria-hidden className={cn('h-1.5 w-1.5 shrink-0 rounded-full', config.dot)} />
      {config.label}
    </Badge>
  )
}
