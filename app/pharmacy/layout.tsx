// @deprecated — hidden for marketplace MVP; preserved for future pharmacy partner use
import { DashboardShell } from '@/components/layout/DashboardShell'

export const dynamic = 'force-dynamic'

export default function PharmacyLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>
}
