import { DashboardShell } from '@/components/layout/DashboardShell'

export const dynamic = 'force-dynamic'

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>
}
