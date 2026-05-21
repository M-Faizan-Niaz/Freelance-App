'use client';

import {
  LayoutDashboard,
  Briefcase,
  DollarSign,
  User,
  CalendarDays,
  Award,
  Bell,
  HelpCircle,
} from 'lucide-react';
import { SidebarNavBase } from '@/components/ui/sidebar-nav-base';
import type { NavUser } from '@/lib/types';

const NAV_ITEMS = [
  { href: '/provider-dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/provider-dashboard/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/provider-dashboard/earnings', label: 'Earnings', icon: DollarSign },
  { href: '/provider-dashboard/profile', label: 'Profile', icon: User },
  { href: '/provider-dashboard/availability', label: 'Availability', icon: CalendarDays },
  { href: '/provider-dashboard/badge', label: 'Badge & Tier', icon: Award },
];

const BOTTOM_ITEMS = [
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/help', label: 'Help', icon: HelpCircle },
];

interface ProviderSidebarNavProps {
  user: NavUser | null;
  mobile?: boolean;
}

export function ProviderSidebarNav({ user, mobile = false }: ProviderSidebarNavProps) {
  return (
    <SidebarNavBase
      user={user}
      mobile={mobile}
      navItems={NAV_ITEMS}
      bottomItems={BOTTOM_ITEMS}
      rootHref="/provider-dashboard"
      defaultName="Provider"
      activeClass="bg-orange/10 text-orange"
      avatarClass="bg-orange/10 text-orange"
    />
  );
}
