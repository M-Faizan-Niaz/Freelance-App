'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  User,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth-client';
import type { NavUser } from '@/components/layout/navbar';

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

/* 5 items shown in mobile bottom bar */
const MOBILE_ITEMS = NAV_ITEMS.slice(0, 5);

interface SidebarNavProps {
  user: NavUser | null;
  mobile?: boolean;
}

export function SidebarNav({ user, mobile = false }: SidebarNavProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  }

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?';

  /* ── Mobile bottom nav ─────────────────────────────────────── */
  if (mobile) {
    return (
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {MOBILE_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className={cn('h-5 w-5', active && 'text-primary')} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }

  /* ── Desktop sidebar ───────────────────────────────────────── */
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r bg-card pt-16 lg:flex">
      {/* User info */}
      <div className="flex items-center gap-3 px-5 py-5">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{user?.name ?? 'My Account'}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email ?? ''}</p>
        </div>
      </div>

      <Separator />

      {/* Primary nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}

        <Separator className="my-2" />

        {BOTTOM_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={() => authClient.signOut()}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
