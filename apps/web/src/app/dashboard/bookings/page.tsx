import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import { BookingCard } from '@/components/dashboard/booking-card';
import { MOCK_BOOKINGS } from '../_data/mock-bookings';
import { CalendarDays } from 'lucide-react';

const CalendarIcon = <CalendarDays className="h-6 w-6" />;

export const metadata: Metadata = { title: 'My Bookings — HirePro' };

export default function BookingsPage() {
  const active = MOCK_BOOKINGS.filter((b) => b.status === 'in_progress');
  const upcoming = MOCK_BOOKINGS.filter((b) => b.status === 'confirmed');
  const past = MOCK_BOOKINGS.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled',
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track and manage all your service bookings.
        </p>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="active" className="flex-1 sm:flex-none">
            Active
            {active.length > 0 && (
              <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange text-[10px] font-bold text-orange-foreground">
                {active.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex-1 sm:flex-none">
            Upcoming
            {upcoming.length > 0 && (
              <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {upcoming.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="past" className="flex-1 sm:flex-none">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4 space-y-3">
          {active.length > 0 ? (
            active.map((b) => <BookingCard key={b.id} booking={b} />)
          ) : (
            <EmptyState
              icon={CalendarIcon}
              title="No active jobs"
              description="Jobs that are currently in progress will appear here."
            />
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-4 space-y-3">
          {upcoming.length > 0 ? (
            upcoming.map((b) => <BookingCard key={b.id} booking={b} />)
          ) : (
            <div className="flex flex-col items-center gap-4">
              <EmptyState
                icon={CalendarIcon}
                title="No upcoming bookings"
                description="You have no confirmed bookings scheduled."
              />
              <Button asChild>
                <Link href="/services">Book a Service</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-4 space-y-3">
          {past.length > 0 ? (
            past.map((b) => <BookingCard key={b.id} booking={b} />)
          ) : (
            <EmptyState
              icon={CalendarIcon}
              title="No past bookings"
              description="Completed and cancelled bookings will appear here."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
