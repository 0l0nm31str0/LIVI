import { type LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-ink p-4">
        <Icon className="h-7 w-7 text-on-ink" strokeWidth={1.5} />
      </div>
      <h3 className="mb-1 font-display text-base font-semibold text-foreground">{title}</h3>
      <p className="mb-6 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
      {action}
    </div>
  )
}
