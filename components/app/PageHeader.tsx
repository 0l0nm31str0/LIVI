import { cn } from '@/lib/utils'



interface PageHeaderProps {

  title: string

  description?: string

  action?: React.ReactNode

  className?: string

}



export function PageHeader({ title, description, action, className }: PageHeaderProps) {

  return (

    <div className={cn('mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>

      <div>

        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">

          {title}

        </h1>

        {description && (

          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>

        )}

      </div>

      {action && <div className="shrink-0">{action}</div>}

    </div>

  )

}

