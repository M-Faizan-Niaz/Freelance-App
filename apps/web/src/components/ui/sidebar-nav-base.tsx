'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn, getInitials } from '@/lib/utils';
import { useSignOut } from '@/lib/hooks/use-sign-out';
import type { NavUser } from '@/lib/types';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarNavBaseProps {
  user: NavUser | null;
  mobile?: boolean;
  navItems: NavItem[];
  bottomItems: NavItem[];
  rootHref: string;
  defaultName: string;
  activeClass: string;
  avatarClass: string;
}

export function SidebarNavBase({
  user,
  mobile = false,
  navItems,
  bottomItems,
  rootHref,
  defaultName,
  activeClass,
  avatarClass,
}: SidebarNavBaseProps) {
  const pathname = usePathname();
  const signOut = useSignOut();
  const mobileItems = navItems.slice(0, 5);

  function isActive(href: string) {
    if (href === rootHref) return pathname === rootHref;
    return pathname.startsWith(href);
  }

  const initials = user?.name ? getInitials(user.name) : '?';

  if (mobile) {
    return (
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] font-medium transition-colors',
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

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r bg-card pt-16 lg:flex">
      <div className="flex items-center gap-3 px-5 py-5">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback className={cn('text-sm font-semibold', avatarClass)}>
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{user?.name ?? defaultName}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email ?? ''}</p>
        </div>
      </div>

      <Separator />

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active ? activeClass : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}

        <Separator className="my-2" />

        {bottomItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
