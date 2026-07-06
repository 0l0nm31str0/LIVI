// @deprecated — hidden for marketplace MVP; preserved for future admin/clinician use
import { DashboardShell } from '@/components/layout/DashboardShell'

export const dynamic = 'force-dynamic'

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>
}
