'use client'

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
} from 'lucide-react'
import { AppSidebar } from './app-sidebar'

const items = [
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
  return <AppSidebar items={items} header="Admin Panel" variant="dark" />
}
