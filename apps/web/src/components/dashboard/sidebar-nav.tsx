'use client';

import {
  LayoutDashboard,
  CalendarDays,
  User,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
} from 'lucide-react';
import { SidebarNavBase } from '@/components/ui/sidebar-nav-base';
import type { NavUser } from '@/lib/types';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/bookings', label: 'My Bookings', icon: CalendarDays },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/addresses', label: 'Addresses', icon: MapPin },
  { href: '/dashboard/payments', label: 'Payments', icon: CreditCard },
];

const BOTTOM_ITEMS = [
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/help', label: 'Help', icon: HelpCircle },
];

interface SidebarNavProps {
  user: NavUser | null;
  mobile?: boolean;
}

export function SidebarNav({ user, mobile = false }: SidebarNavProps) {
  return (
    <SidebarNavBase
      user={user}
      mobile={mobile}
      navItems={NAV_ITEMS}
      bottomItems={BOTTOM_ITEMS}
      rootHref="/dashboard"
      defaultName="My Account"
      activeClass="bg-primary/10 text-primary"
      avatarClass="bg-primary/10 text-primary"
    />
  );
}
