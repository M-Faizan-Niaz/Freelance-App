'use client'

import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Bell,
  User,
  FileText,
  Images,
  ClipboardList,
} from 'lucide-react'
import { AppSidebar } from './app-sidebar'

const items = [
  { href: '/provider/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/provider/onboarding', icon: ClipboardList, label: 'Complete Profile' },
  { href: '/provider/bookings', icon: BookOpen, label: 'My Jobs' },
  { href: '/provider/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/provider/notifications', icon: Bell, label: 'Notifications' },
  { href: '/provider/profile', icon: User, label: 'Profile' },
  { href: '/provider/documents', icon: FileText, label: 'Verification' },
  { href: '/provider/portfolio', icon: Images, label: 'Portfolio' },
]

export function SidebarProvider() {
  return <AppSidebar items={items} header="Provider Mode" />
}
