'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Calendar, FileText, ShoppingBag,
  User, ClipboardList, Package, LogOut, Menu, CreditCard,
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { getInitials } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const patientNav = [
  { href: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/shop', label: 'Shop', icon: ShoppingBag },
  { href: '/patient/orders', label: 'My Orders', icon: Package },
  { href: '/patient/billing', label: 'Billing', icon: CreditCard },
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

const dashboardRoots = ['/patient/dashboard', '/doctor/dashboard', '/pharmacy/dashboard']

function BrandMark() {
  return (
    <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-on-ink">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ background: 'linear-gradient(135deg, #E85A2B, #ff9070)' }}
        aria-hidden
      />
      LIVI
    </Link>
  )
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { user } = useAuthStore()

  const navItems =
    user?.role === 'patient' ? patientNav :
    user?.role === 'doctor' ? doctorNav : pharmacyNav

  function isActive(href: string) {
    if (dashboardRoots.includes(href)) return pathname === href
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <nav className="flex flex-col gap-0.5 p-3">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={isActive(item.href) ? 'sidebar-link-active' : 'sidebar-link'}
        >
          <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

function SidebarFooter({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const roleLabel =
    user?.role === 'patient' ? 'Patient' :
    user?.role === 'doctor' ? 'Physician' : 'Pharmacy'

  function handleLogout() {
    logout()
    onNavigate?.()
    router.push('/login')
  }

  return (
    <div className="border-t border-white/10 p-3">
      <div className="mb-2 flex items-center gap-3 rounded-lg px-2 py-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-white/10 text-on-ink">
            {user ? getInitials(user.first_name, user.last_name) : '--'}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-on-ink">
            {user ? `${user.first_name} ${user.last_name}` : ''}
          </p>
          <p className="text-xs text-on-ink-muted">{roleLabel}</p>
        </div>
      </div>
      <button onClick={handleLogout} className="sidebar-link w-full">
        <LogOut className="h-4 w-4 shrink-0" />
        Sign out
      </button>
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden h-screen w-60 shrink-0 flex-col border-r border-white/10 bg-ink md:flex">
      <div className="flex h-16 items-center border-b border-white/10 px-5">
        <BrandMark />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <NavLinks />
        </div>
        <SidebarFooter />
      </div>
    </aside>
  )
}

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'md:hidden')}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 border-white/10 bg-ink p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <div className="flex h-16 items-center border-b border-white/10 px-5">
          <BrandMark />
        </div>
        <div className="flex flex-1 flex-col">
          <NavLinks onNavigate={() => setOpen(false)} />
          <SidebarFooter onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
