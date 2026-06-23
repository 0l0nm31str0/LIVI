'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  FileText,
  ShoppingBag,
  User,
  ClipboardList,
  Package,
  LogOut,
  Activity,
  Users,
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { getInitials } from '@/lib/utils'

const patientNav = [
  { href: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/patient/doctors', label: 'Find Doctors', icon: Users },
  { href: '/patient/appointments/new', label: 'Book Appointment', icon: Calendar },
  { href: '/patient/prescriptions', label: 'Prescriptions', icon: FileText },
  { href: '/patient/orders', label: 'My Orders', icon: ShoppingBag },
  { href: '/patient/profile', label: 'Profile', icon: User },
]

const doctorNav = [
  { href: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/doctor/appointments', label: 'Appointments', icon: Calendar },
  { href: '/doctor/prescriptions', label: 'Prescriptions', icon: FileText },
  { href: '/doctor/prescriptions/new', label: 'Write Rx', icon: ClipboardList },
  { href: '/doctor/profile', label: 'Profile', icon: User },
]

const pharmacyNav = [
  { href: '/pharmacy/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pharmacy/prescriptions', label: 'Prescriptions', icon: FileText },
  { href: '/pharmacy/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/pharmacy/inventory', label: 'Inventory', icon: Package },
  { href: '/pharmacy/profile', label: 'Profile', icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const navItems =
    user?.role === 'patient'
      ? patientNav
      : user?.role === 'doctor'
      ? doctorNav
      : pharmacyNav

  const roleLabel =
    user?.role === 'patient'
      ? 'Patient'
      : user?.role === 'doctor'
      ? 'Physician'
      : 'Pharmacy Manager'

  function handleLogout() {
    logout()
    router.push('/login')
  }

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-border bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-700">
          <Activity className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold text-primary-700">LIVI</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/patient/dashboard' && item.href !== '/doctor/dashboard' && item.href !== '/pharmacy/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="mb-2 flex items-center gap-3 rounded-md px-3 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
            {user ? getInitials(user.first_name, user.last_name) : '--'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {user ? `${user.first_name} ${user.last_name}` : ''}
            </p>
            <p className="text-xs text-muted-foreground">{roleLabel}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="sidebar-link w-full">
          <LogOut className="h-4 w-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
