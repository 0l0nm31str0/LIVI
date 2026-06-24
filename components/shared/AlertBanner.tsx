import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

const variantConfig = {
  info: {
    icon: Info,
    container: 'bg-primary-50 border border-primary-200 text-primary-900',
    iconClass: 'text-primary-500',
  },
  success: {
    icon: CheckCircle2,
    container: 'bg-secondary-50 border border-secondary-200 text-secondary-900',
    iconClass: 'text-secondary-600',
  },
  warning: {
    icon: AlertTriangle,
    container: 'bg-warning-50 border border-warning-200 text-warning-900',
    iconClass: 'text-warning-600',
  },
  error: {
    icon: XCircle,
    container: 'bg-error-50 border border-error-200 text-error-900',
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
    <div className={cn('flex gap-3 rounded-xl p-4', container, className)} role="alert">
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', iconClass)} aria-hidden />
      <div>
        <p className="text-sm font-semibold">{title}</p>
        {message && <p className="mt-0.5 text-sm opacity-80">{message}</p>}
      </div>
    </div>
  )
}
