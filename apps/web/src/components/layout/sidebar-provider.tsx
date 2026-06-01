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
import { AppSidebar, type NavGroup } from './app-sidebar'

const groups: NavGroup[] = [
  {
    label: 'Main',
    items: [
      { href: '/provider/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/provider/bookings', icon: BookOpen, label: 'My Jobs' },
      { href: '/provider/messages', icon: MessageSquare, label: 'Messages' },
      { href: '/provider/notifications', icon: Bell, label: 'Notifications' },
    ],
  },
  {
    label: 'Profile',
    items: [
      { href: '/provider/onboarding', icon: ClipboardList, label: 'Profile Onboarding' },
      { href: '/provider/profile', icon: User, label: 'My Profile' },
      { href: '/provider/documents', icon: FileText, label: 'Verification' },
      { href: '/provider/portfolio', icon: Images, label: 'Portfolio' },
    ],
  },
]

export function SidebarProvider() {
  return <AppSidebar groups={groups} header="Provider Mode" />
}
