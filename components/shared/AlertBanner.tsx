import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

const variantConfig = {
  info: { icon: Info, classes: 'border-l-4 border-blue-500 bg-blue-50 text-blue-800' },
  success: { icon: CheckCircle2, classes: 'border-l-4 border-green-500 bg-green-50 text-green-800' },
  warning: { icon: AlertTriangle, classes: 'border-l-4 border-amber-500 bg-amber-50 text-amber-800' },
  error: { icon: XCircle, classes: 'border-l-4 border-red-500 bg-red-50 text-red-800' },
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
  const { icon: Icon, classes } = variantConfig[variant]
  return (
    <div className={cn('flex gap-3 rounded-md p-4', classes, className)} role="alert">
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="text-sm font-semibold">{title}</p>
        {message && <p className="mt-0.5 text-sm opacity-90">{message}</p>}
      </div>
    </div>
  )
}
