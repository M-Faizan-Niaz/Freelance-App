import Link from 'next/link';
import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { MockBooking, BookingStatus } from '@/app/dashboard/_data/mock-bookings';

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; variant: 'default' | 'orange' | 'success' | 'destructive' | 'secondary' }
> = {
  confirmed: { label: 'Confirmed', variant: 'default' },
  in_progress: { label: 'In Progress', variant: 'orange' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
};

interface BookingCardProps {
  booking: MockBooking;
}

export function BookingCard({ booking }: BookingCardProps) {
  const { label, variant } = STATUS_CONFIG[booking.status];

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
      {/* Provider avatar */}
      <Avatar className="h-11 w-11 shrink-0">
        <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
          {booking.providerInitials}
        </AvatarFallback>
      </Avatar>

      {/* Main info */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-foreground">{booking.providerName}</span>
          <span className="text-xs text-muted-foreground">{booking.providerCategory}</span>
          <Badge variant={variant}>{label}</Badge>
        </div>
        <p className="text-sm text-muted-foreground truncate">{booking.service}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {new Date(booking.date).toLocaleDateString('en-PK', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {booking.time}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {booking.city}
          </span>
        </div>
      </div>

      {/* Action */}
      <Button size="sm" variant="outline" asChild className="shrink-0">
        <Link href={`/dashboard/bookings/${booking.id}`}>View Details</Link>
      </Button>
    </div>
  );
}
