import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepIndicatorProps {
  steps: string[]
  currentStep: number
  className?: string
}

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn('mb-8', className)}>
      <div className="mb-3 flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>Step {currentStep + 1} of {steps.length}</span>
        <span>{steps[currentStep]}</span>
      </div>
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-sage transition-[width] duration-500 ease-out"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
      <ol className="mt-4 hidden gap-2 sm:flex">
        {steps.map((step, i) => {
          const done = i < currentStep
          const active = i === currentStep
          return (
            <li
              key={step}
              className={cn(
                'flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                active && 'bg-accent-light text-sage',
                done && !active && 'text-muted-foreground',
                !done && !active && 'text-muted-foreground/60'
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px]',
                  done && 'bg-sage text-white',
                  active && 'border-2 border-sage bg-surface text-sage',
                  !done && !active && 'border border-border bg-surface'
                )}
              >
                {done ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span className="truncate">{step}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
