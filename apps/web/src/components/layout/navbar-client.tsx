'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CalendarCheck,
  ChevronDown,
  LogOut,
  MapPin,
  Menu,
  Search,
  Settings,
  User,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { NavUser } from './navbar';

const SERVICE_CATEGORIES = [
  { label: 'Electrician', href: '/services/electrician' },
  { label: 'Plumber', href: '/services/plumber' },
  { label: 'AC & Appliances', href: '/services/ac-appliances' },
  { label: 'Cleaning', href: '/services/cleaning' },
  { label: 'Painting', href: '/services/painting' },
  { label: 'Moving', href: '/services/moving' },
  { label: 'Carpenter', href: '/services/carpenter' },
  { label: 'Outdoor', href: '/services/outdoor' },
];

const NAV_LINKS = [
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Become a Provider', href: '/become-provider' },
];

interface NavbarClientProps {
  user: NavUser | null;
}

export function NavbarClient({ user }: NavbarClientProps) {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push('/');
    router.refresh();
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-bold text-primary">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            H
          </div>
          HirePro
        </Link>

        {/* Desktop: centre nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 text-sm font-medium">
                Services <ChevronDown className="h-4 w-4 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              {SERVICE_CATEGORIES.map((cat) => (
                <DropdownMenuItem key={cat.href} asChild>
                  <Link href={cat.href}>{cat.label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/services" className="font-medium text-primary">
                  View all services →
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm" asChild>
            <Link href="/how-it-works">How It Works</Link>
          </Button>
        </nav>

        {/* Desktop: right actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm" className="gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            Karachi
          </Button>

          {user ? (
            <>
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/bookings">Bookings</Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image ?? ''} alt={user.name} />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="truncate text-sm font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="gap-2">
                      <User className="h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/bookings" className="gap-2">
                      <CalendarCheck className="h-4 w-4" /> My Bookings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="gap-2">
                      <Settings className="h-4 w-4" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="gap-2 text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/sign-in">Sign In</Link>
              </Button>
              <Button
                size="sm"
                className="bg-orange font-semibold text-orange-foreground hover:bg-orange/90"
                asChild
              >
                <Link href="/become-provider">Become a Provider</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile: hamburger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-0">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b p-4">
                <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
                    H
                  </div>
                  HirePro
                </Link>
              </div>

              <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                {user && (
                  <div className="mb-3 flex items-center gap-3 rounded-lg bg-muted p-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.image ?? ''} alt={user.name} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                )}

                <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Services
                </p>
                {SERVICE_CATEGORIES.map((cat) => (
                  <SheetClose asChild key={cat.href}>
                    <Link
                      href={cat.href}
                      className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                    >
                      {cat.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link
                    href="/services"
                    className="block rounded-md px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent"
                  >
                    View all services →
                  </Link>
                </SheetClose>

                <div className="my-2 h-px bg-border" />

                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}

                {user && (
                  <>
                    <div className="my-2 h-px bg-border" />
                    <SheetClose asChild>
                      <Link
                        href="/dashboard/bookings"
                        className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                      >
                        My Bookings
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/dashboard/profile"
                        className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                      >
                        Profile
                      </Link>
                    </SheetClose>
                  </>
                )}
              </nav>

              <div className="space-y-2 border-t p-4">
                {user ? (
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-destructive text-destructive hover:bg-destructive/5"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/auth/sign-in">Sign In</Link>
                    </Button>
                    <Button
                      className="w-full bg-orange font-semibold text-orange-foreground hover:bg-orange/90"
                      asChild
                    >
                      <Link href="/become-provider">Become a Provider</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
