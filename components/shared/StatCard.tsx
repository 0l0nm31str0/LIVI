import { type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  label?: string
  value: string | number
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  subtitle?: string
  className?: string
}

export function StatCard({
  title,
  label,
  value,
  icon: Icon,
  iconColor = 'text-on-ink',
  iconBg = 'bg-ink',
  subtitle,
  className,
}: StatCardProps) {
  const displayTitle = label ?? title
  return (
    <Card
      className={cn(
        'border-border shadow-card',
        'transition-[transform,box-shadow] duration-200',
        'hover:-translate-y-0.5 hover:shadow-elevated',
        className
      )}
    >
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{displayTitle}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground tabular-nums">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={cn('rounded-lg p-2.5', iconBg)}>
          <Icon className={cn('h-5 w-5', iconColor)} />
        </div>
      </CardContent>
    </Card>
  )
}
