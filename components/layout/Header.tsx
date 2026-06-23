'use client'
import { Bell } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'

export function Header({ title }: { title?: string }) {
  const user = useAuthStore((s) => s.user)

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6">
      <h1 className="text-base font-semibold text-foreground">{title ?? 'Dashboard'}</h1>
      <div className="flex items-center gap-3">
        <button
          className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-700" />
        </button>
        <div className="h-8 w-px bg-border" />
        <span className="text-sm text-muted-foreground">
          {user ? `${user.first_name} ${user.last_name}` : ''}
        </span>
      </div>
    </header>
  )
}
