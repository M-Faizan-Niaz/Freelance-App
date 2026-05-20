import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { CalendarDays, CheckCircle2, Clock, CreditCard, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BookingCard } from '@/components/dashboard/booking-card';
import { MOCK_BOOKINGS } from './_data/mock-bookings';
import type { NavUser } from '@/components/layout/navbar';

export const metadata: Metadata = { title: 'Dashboard — HirePro' };

async function getUser(): Promise<NavUser | null> {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.has('better-auth.session_token')) return null;
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
      .join('; ');
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'https://api.viteplusmono.test'}/v1/api/auth/get-session`,
      { headers: { cookie: cookieHeader }, cache: 'no-store' },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { user?: NavUser } | null;
    return data?.user ?? null;
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const user = await getUser();

  const total = MOCK_BOOKINGS.length;
  const completed = MOCK_BOOKINGS.filter((b) => b.status === 'completed').length;
  const pending = MOCK_BOOKINGS.filter(
    (b) => b.status === 'confirmed' || b.status === 'in_progress',
  ).length;
  const amountSpent = MOCK_BOOKINGS.filter((b) => b.status === 'completed').reduce(
    (sum, b) => sum + b.price + b.platformFee,
    0,
  );

  const recent = MOCK_BOOKINGS.slice(0, 3);

  const stats = [
    { icon: CalendarDays, label: 'Total Bookings', value: total, color: 'text-primary bg-primary/10' },
    { icon: CheckCircle2, label: 'Completed', value: completed, color: 'text-green-600 bg-green-100 dark:bg-green-950/40' },
    { icon: Clock, label: 'Pending / Active', value: pending, color: 'text-orange bg-orange/10' },
    { icon: CreditCard, label: 'Amount Spent', value: `₨${amountSpent.toLocaleString()}`, color: 'text-purple-600 bg-purple-100 dark:bg-purple-950/40' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s an overview of your activity on HirePro.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="rounded-xl border bg-card p-5 shadow-sm">
            <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-extrabold text-foreground">{value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Recent Bookings</h2>
          <Button variant="ghost" size="sm" className="gap-1 text-primary" asChild>
            <Link href="/dashboard/bookings">
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="space-y-3">
          {recent.map((b) => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </div>
      </div>

      <Separator />

      {/* Quick actions */}
      <div className="space-y-3">
        <h2 className="font-semibold text-foreground">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/services">Book a Service</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/services">Browse Providers</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/chat">Messages</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
