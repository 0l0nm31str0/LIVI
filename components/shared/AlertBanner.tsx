import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

const variantConfig = {
  info: {
    icon: Info,
    container: 'bg-accent-light/60 border border-primary-100 text-foreground',
    iconClass: 'text-primary',
  },
  success: {
    icon: CheckCircle2,
    container: 'bg-success-50 border border-success-100 text-foreground',
    iconClass: 'text-success-600',
  },
  warning: {
    icon: AlertTriangle,
    container: 'bg-warning-50 border border-warning-100 text-foreground',
    iconClass: 'text-warning-600',
  },
  error: {
    icon: XCircle,
    container: 'bg-error-50 border border-error-100 text-foreground',
    iconClass: 'text-error-600',
  },
}

export function AlertBanner({
  variant = 'info',
  title,
  message,
  className,
}: {
  variant?: AlertVariant
  title: string
  message?: string
  className?: string
}) {
  const { icon: Icon, container, iconClass } = variantConfig[variant]
  return (
    <div className={cn('flex gap-3 rounded-lg p-4', container, className)} role="alert">
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', iconClass)} aria-hidden />
      <div>
        <p className="text-sm font-medium">{title}</p>
        {message && <p className="mt-0.5 text-sm text-muted-foreground">{message}</p>}
      </div>
    </div>
  )
}
