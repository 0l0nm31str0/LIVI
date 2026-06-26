import { cn } from '@/lib/utils'

type SectionVariant = 'default' | 'ink' | 'canvas'

export function Section({
  children,
  className,
  id,
  variant = 'default',
}: {
  children: React.ReactNode
  className?: string
  id?: string
  variant?: SectionVariant
}) {
  return (
    <section
      id={id}
      className={cn(
        'px-6 py-16 md:py-24 cv-auto',
        variant === 'ink' && 'section-ink',
        variant === 'canvas' && 'section-canvas',
        className
      )}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  )
}
