'use client'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { AuthProvider } from './AuthProvider'

export function DashboardShell({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden bg-canvas">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header title={title} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 page-enter">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}
