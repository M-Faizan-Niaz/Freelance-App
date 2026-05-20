import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  CheckCircle2,
  Circle,
  CalendarDays,
  Clock,
  MapPin,
  MessageCircle,
  ChevronLeft,
  ShieldCheck,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { StarRating } from '@/components/ui/star-rating';
import { getBookingById, type BookingStatus } from '@/app/dashboard/_data/mock-bookings';
import { cn } from '@/lib/utils';

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Booking ${id} — HirePro` };
}

/* ── Timeline ──────────────────────────────────────────────────── */

const TIMELINE_STAGES = [
  { key: 'accepted', label: 'Booking Confirmed', desc: 'Provider has accepted your request' },
  { key: 'en_route', label: 'Provider En Route', desc: 'Provider is heading to your location' },
  { key: 'arrived', label: 'Provider Arrived', desc: 'Provider is at your address' },
  { key: 'in_progress', label: 'Work In Progress', desc: 'Job is underway' },
  { key: 'completed', label: 'Job Completed', desc: 'Work finished and payment released' },
];

function getCompletedStages(status: BookingStatus): number {
  switch (status) {
    case 'confirmed': return 1;
    case 'in_progress': return 3;
    case 'completed': return 5;
    default: return 0;
  }
}

const STATUS_BADGE: Record<
  BookingStatus,
  { label: string; variant: 'default' | 'orange' | 'success' | 'destructive' }
> = {
  confirmed: { label: 'Confirmed', variant: 'default' },
  in_progress: { label: 'In Progress', variant: 'orange' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
};

/* ── Page ──────────────────────────────────────────────────────── */

export default async function BookingDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const booking = getBookingById(id);
  if (!booking) notFound();

  const completedStages = getCompletedStages(booking.status);
  const { label, variant } = STATUS_BADGE[booking.status];
  const total = booking.price + booking.platformFee;
  const isCancelled = booking.status === 'cancelled';
  const isCompleted = booking.status === 'completed';
  const isUpcoming = booking.status === 'confirmed';

  const formattedDate = new Date(booking.date).toLocaleDateString('en-PK', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Back + heading */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/bookings">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">Booking {booking.id}</h1>
            <Badge variant={variant}>{label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{booking.service}</p>
        </div>
      </div>

      {/* Timeline — hidden for cancelled */}
      {!isCancelled && (
        <section className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="mb-5 font-semibold text-foreground">Booking Progress</h2>
          <ol className="space-y-0">
            {TIMELINE_STAGES.map((stage, i) => {
              const done = i < completedStages;
              const active = i === completedStages - 1;
              const isLast = i === TIMELINE_STAGES.length - 1;
              return (
                <li key={stage.key} className="flex gap-4">
                  {/* Dot + connector */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs transition-all',
                        done
                          ? 'border-green-500 bg-green-500 text-white'
                          : active
                            ? 'border-primary bg-background text-primary ring-4 ring-primary/20'
                            : 'border-border bg-background text-muted-foreground',
                      )}
                    >
                      {done ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Circle className="h-3.5 w-3.5 fill-current opacity-30" />
                      )}
                    </div>
                    {!isLast && (
                      <div
                        className={cn(
                          'w-px flex-1 my-1',
                          i < completedStages - 1 ? 'bg-green-500' : 'bg-border',
                        )}
                        style={{ minHeight: '2rem' }}
                      />
                    )}
                  </div>
                  {/* Label */}
                  <div className="pb-6">
                    <p
                      className={cn(
                        'text-sm font-medium',
                        done ? 'text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      {stage.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{stage.desc}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {/* Provider info */}
      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-foreground">Provider</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11">
              <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                {booking.providerInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{booking.providerName}</p>
              <p className="text-sm text-muted-foreground">{booking.providerCategory}</p>
              <StarRating value={4.8} size="sm" />
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <Link href={`/chat?providerId=${booking.providerId}`}>
              <MessageCircle className="h-4 w-4" />
              Chat
            </Link>
          </Button>
        </div>
      </section>

      {/* Job details */}
      <section className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
        <h2 className="font-semibold text-foreground">Job Details</h2>
        <Separator />
        <div className="space-y-2.5 text-sm">
          <div className="flex items-start gap-3">
            <span className="w-24 shrink-0 text-muted-foreground">Service</span>
            <span className="font-medium text-foreground">{booking.service}</span>
          </div>
          <div className="flex items-center gap-3">
            <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">{booking.time}</span>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">
              {booking.addressStreet}, {booking.addressArea}, {booking.city}
            </span>
          </div>
          {booking.notes && (
            <div className="flex items-start gap-3">
              <span className="w-24 shrink-0 text-muted-foreground">Notes</span>
              <span className="text-muted-foreground">{booking.notes}</span>
            </div>
          )}
        </div>
      </section>

      {/* Payment breakdown */}
      <section className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
        <h2 className="font-semibold text-foreground">Payment</h2>
        <Separator />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service fee</span>
            <span className="font-medium text-foreground">₨{booking.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Platform fee</span>
            <span className="font-medium text-foreground">₨{booking.platformFee.toLocaleString()}</span>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="font-semibold text-foreground">Total</span>
          <span className="text-lg font-extrabold text-orange">₨{total.toLocaleString()}</span>
        </div>
        <div className="flex items-start gap-2 rounded-lg bg-green-50 p-3 text-xs text-green-800 dark:bg-green-950/30 dark:text-green-300">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          Payment held in escrow — released to provider only after job completion.
        </div>
      </section>

      {/* Conditional actions */}
      <div className="space-y-3">
        {isCompleted && !booking.reviewLeft && (
          <Button className="w-full" asChild>
            <Link href={`/review/${booking.id}`}>Leave a Review</Link>
          </Button>
        )}
        {isUpcoming && (
          <>
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
              <strong>Cancellation policy:</strong> Free cancellation up to 2 hours before the
              scheduled time. Late cancellations may incur a fee.
            </div>
            <Button variant="outline" className="w-full text-destructive hover:text-destructive">
              Cancel Booking
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
