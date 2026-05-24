'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  CreditCard,
  Wallet,
  ShieldAlert,
  Tag,
  Percent,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/admin/providers', icon: UserCheck, label: 'Providers' },
  { href: '/admin/customers', icon: Users, label: 'Customers' },
  { href: '/admin/bookings', icon: BookOpen, label: 'Bookings' },
  { href: '/admin/payments', icon: CreditCard, label: 'Payments' },
  { href: '/admin/payouts', icon: Wallet, label: 'Payouts' },
  { href: '/admin/fraud', icon: ShieldAlert, label: 'Fraud Flags' },
  { href: '/admin/categories', icon: Tag, label: 'Categories' },
  { href: '/admin/commission', icon: Percent, label: 'Commission' },
]

export function SidebarAdmin() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r bg-gray-950 text-white h-[calc(100vh-64px)] sticky top-16">
      <div className="px-4 py-3 border-b border-white/10">
        <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
          Admin Panel
        </p>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-1">
          {navItems.map(item => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-white/60 hover:bg-white/10 hover:text-white',
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="h-3 w-3 opacity-60" />}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
    </aside>
  )
}
