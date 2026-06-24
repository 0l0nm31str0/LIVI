'use client'
import { Bell } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'

export function Header({ title }: { title?: string }) {
  const user = useAuthStore((s) => s.user)

  return (
    <header
      className="flex h-16 items-center justify-between border-b px-6"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <h1 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
        {title ?? 'Dashboard'}
      </h1>

      <div className="flex items-center gap-3">
        <button
          className="relative rounded-full p-2 transition-colors hover:bg-primary-50"
          style={{ color: 'var(--muted-foreground)' }}
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span
            aria-hidden
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-600 ring-2 ring-white"
          />
        </button>

        <div className="h-6 w-px" style={{ background: 'var(--border)' }} />

        <span className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
          {user ? `${user.first_name} ${user.last_name}` : ''}
        </span>
      </div>
    </header>
  )
}
