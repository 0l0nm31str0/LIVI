'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Calendar, FileText, ShoppingBag,
  User, ClipboardList, Package, LogOut, Activity, Users,
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { getInitials } from '@/lib/utils'

const patientNav = [
  { href: '/patient/dashboard',         label: 'Dashboard',        icon: LayoutDashboard },
  { href: '/patient/doctors',           label: 'Find Doctors',     icon: Users },
  { href: '/patient/appointments/new',  label: 'Book Appointment', icon: Calendar },
  { href: '/patient/prescriptions',     label: 'Prescriptions',    icon: FileText },
  { href: '/patient/orders',            label: 'My Orders',        icon: ShoppingBag },
  { href: '/patient/profile',           label: 'Profile',          icon: User },
]

const doctorNav = [
  { href: '/doctor/dashboard',          label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/doctor/appointments',       label: 'Appointments', icon: Calendar },
  { href: '/doctor/prescriptions',      label: 'Prescriptions',icon: FileText },
  { href: '/doctor/prescriptions/new',  label: 'Write Rx',     icon: ClipboardList },
  { href: '/doctor/profile',            label: 'Profile',      icon: User },
]

const pharmacyNav = [
  { href: '/pharmacy/dashboard',     label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/pharmacy/prescriptions', label: 'Prescriptions',icon: FileText },
  { href: '/pharmacy/orders',        label: 'Orders',       icon: ShoppingBag },
  { href: '/pharmacy/inventory',     label: 'Inventory',    icon: Package },
  { href: '/pharmacy/profile',       label: 'Profile',      icon: User },
]

const dashboardRoots = ['/patient/dashboard', '/doctor/dashboard', '/pharmacy/dashboard']

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const navItems =
    user?.role === 'patient'   ? patientNav  :
    user?.role === 'doctor'    ? doctorNav   : pharmacyNav

  const roleLabel =
    user?.role === 'patient'   ? 'Patient'          :
    user?.role === 'doctor'    ? 'Physician'        : 'Pharmacy Manager'

  function isActive(href: string) {
    if (dashboardRoots.includes(href)) return pathname === href
    return pathname === href || pathname.startsWith(href + '/')
  }

  function handleLogout() {
    logout()
    router.push('/login')
  }

  return (
    <aside
      className="flex h-screen w-60 shrink-0 flex-col border-r"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      {/* Logo */}
      <div
        className="flex h-16 items-center gap-2.5 border-b px-5"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
          <Activity className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-lg font-bold text-primary-700">LIVI</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={isActive(item.href) ? 'sidebar-link-active' : 'sidebar-link'}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t p-3" style={{ borderColor: 'var(--border)' }}>
        <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
            {user ? getInitials(user.first_name, user.last_name) : '--'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              {user ? `${user.first_name} ${user.last_name}` : ''}
            </p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{roleLabel}</p>
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
