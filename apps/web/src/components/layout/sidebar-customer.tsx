'use client'

import { LayoutDashboard, BookOpen, MessageSquare, Bell, User, MapPin } from 'lucide-react'
import { AppSidebar } from './app-sidebar'

const items = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/bookings', icon: BookOpen, label: 'My Bookings' },
  { href: '/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/profile/addresses', icon: MapPin, label: 'Addresses' },
]

export function SidebarCustomer() {
  return <AppSidebar items={items} />
}
