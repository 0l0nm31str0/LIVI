'use client'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { AuthProvider } from './AuthProvider'

export function DashboardShell({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header title={title} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </AuthProvider>
  )
}
