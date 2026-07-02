'use client'

import { Bell } from 'lucide-react'

import { useAuthStore } from '@/stores/auth-store'

import { MobileNav } from './Sidebar'

import { Button } from '@/components/ui/button'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'

import { getInitials } from '@/lib/utils'



export function Header({ title }: { title?: string }) {

  const user = useAuthStore((s) => s.user)



  return (

    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-4 sm:px-6">

      <div className="flex items-center gap-3">

        <MobileNav />

        <div>

          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground md:hidden">

            LIVI

          </p>

          <h1 className="animate-fade-in font-display text-base font-semibold text-foreground sm:text-lg">

            {title ?? 'Dashboard'}

          </h1>

        </div>

      </div>



      <div className="flex items-center gap-2">

        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">

          <Bell className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-coral ring-2 ring-surface" />

        </Button>

        <div className="hidden items-center gap-2 sm:flex">

          <Avatar className="h-8 w-8">

            <AvatarFallback className="bg-ink text-xs text-on-ink">

              {user ? getInitials(user.first_name, user.last_name) : '--'}

            </AvatarFallback>

          </Avatar>

          <span className="text-sm font-medium text-muted-foreground">

            {user?.first_name}

          </span>

        </div>

      </div>

    </header>

  )

}

