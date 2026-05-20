import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, CalendarDays, Clock, MapPin, MessageCircle, LayoutDashboard, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getProviderById } from '@/app/providers/_data/provider-profiles';

export const metadata: Metadata = {
  title: 'Booking Confirmed — HirePro',
};

type SearchParams = Promise<{
  bookingId?: string;
  providerId?: string;
  service?: string;
  date?: string;
  time?: string;
  city?: string;
}>;

function formatDate(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-PK', { weekday: 'long', month: 'long', day: 'numeric' });
}

export default async function BookingConfirmationPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const { bookingId, providerId, service, date, time, city } = params;

  const provider = providerId ? getProviderById(providerId) : null;

  return (
    <main className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Success icon */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Booking Confirmed!</h1>
          <p className="text-sm text-muted-foreground">
            You&apos;ll receive a confirmation SMS shortly.
          </p>
        </div>

        {/* Booking ID */}
        {bookingId && (
          <div className="rounded-lg bg-surface px-4 py-3 text-center">
            <p className="text-xs text-muted-foreground">Booking reference</p>
            <p className="mt-0.5 font-mono text-sm font-bold tracking-widest text-foreground">
              {bookingId}
            </p>
          </div>
        )}

        {/* Summary card */}
        <div className="rounded-xl border bg-card px-5 py-4 space-y-3">
          {provider && (
            <>
              <p className="font-semibold text-foreground">{provider.name}</p>
              <p className="text-sm text-muted-foreground">{provider.category}</p>
              <Separator />
            </>
          )}

          <div className="space-y-2 text-sm">
            {service && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-medium text-foreground">{service}</span>
              </div>
            )}
            {date && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="h-4 w-4 shrink-0" />
                <span>{formatDate(date)}</span>
              </div>
            )}
            {time && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0" />
                <span>{time}</span>
              </div>
            )}
            {city && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{city}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button className="w-full gap-2" asChild>
            <Link href="/dashboard/bookings">
              <LayoutDashboard className="h-4 w-4" />
              View My Bookings
            </Link>
          </Button>

          {providerId && (
            <Button variant="outline" className="w-full gap-2" asChild>
              <Link href={`/chat?providerId=${providerId}`}>
                <MessageCircle className="h-4 w-4" />
                Chat with Provider
              </Link>
            </Button>
          )}

          <Button variant="ghost" className="w-full gap-2" asChild>
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
