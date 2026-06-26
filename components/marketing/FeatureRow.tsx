import { cn } from '@/lib/utils'

interface FeatureRowProps {
  title: string
  description: string
  className?: string
}

export function FeatureRow({ title, description, className }: FeatureRowProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-card transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-elevated',
        className
      )}
    >
      <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}
