import { DashboardShell } from '@/components/layout/DashboardShell'

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>
}
