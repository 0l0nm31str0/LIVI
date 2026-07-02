import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { cn } from '@/lib/utils'



interface AppCardProps {

  title?: string

  action?: React.ReactNode

  children: React.ReactNode

  className?: string

  contentClassName?: string

  noPadding?: boolean

}



export function AppCard({

  title,

  action,

  children,

  className,

  contentClassName,

  noPadding,

}: AppCardProps) {

  if (!title) {

    return (

      <Card

        className={cn(

          'border-border shadow-card transition-[transform,box-shadow] duration-200 hover:shadow-elevated',

          className

        )}

      >

        <CardContent className={cn(!noPadding && 'p-6', contentClassName)}>{children}</CardContent>

      </Card>

    )

  }



  return (

    <Card

      className={cn(

        'border-border shadow-card transition-[transform,box-shadow] duration-200 hover:shadow-elevated',

        className

      )}

    >

      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4">

        <CardTitle className="font-display text-base font-semibold">{title}</CardTitle>

        {action}

      </CardHeader>

      <CardContent className={cn(!noPadding && 'pt-0', contentClassName)}>{children}</CardContent>

    </Card>

  )

}

