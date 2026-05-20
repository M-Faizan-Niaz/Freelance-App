'use client';

import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StarRating } from '@/components/ui/star-rating';
import type { BookingState, BookingAction } from './booking-shell';
import type { ProviderProfile } from '@/app/providers/_data/provider-profiles';

interface StepConfirmProps {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  provider: ProviderProfile | null;
  onConfirm: () => void;
}

function formatDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-PK', { weekday: 'long', month: 'long', day: 'numeric' });
}

export function StepConfirm({ state, dispatch, provider, onConfirm }: StepConfirmProps) {
  const basePrice =
    provider?.servicesOffered.find((s) => s.label === state.serviceLabel)?.price ??
    provider?.startingPrice ??
    0;
  const total = basePrice + Math.round(basePrice * 0.05);

  const initials = provider?.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() ?? '?';

  const addressParts = [
    state.addressStreet,
    state.addressArea,
    state.addressUnit,
    state.addressCity,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Confirm your booking</h2>
        <p className="mt-1 text-sm text-muted-foreground">Review everything before confirming.</p>
      </div>

      {/* Provider summary */}
      {provider && (
        <div className="flex items-center gap-4 rounded-xl border bg-card px-5 py-4">
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{provider.name}</p>
            <p className="text-sm text-muted-foreground">{provider.category}</p>
            <div className="mt-1 flex items-center gap-1">
              <StarRating value={provider.rating} size="sm" />
              <span className="text-xs text-muted-foreground">{provider.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Job summary */}
      <div className="rounded-xl border bg-card px-5 py-4 space-y-3">
        <p className="text-sm font-semibold text-foreground">Job details</p>
        <Separator />

        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <span className="w-24 shrink-0 text-muted-foreground">Service</span>
            <span className="font-medium text-foreground">{state.serviceLabel}</span>
          </div>

          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="font-medium text-foreground">{formatDate(state.selectedDate)}</span>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="font-medium text-foreground">{state.selectedTimeLabel}</span>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="font-medium text-foreground">{addressParts.join(', ')}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between">
          <span className="font-semibold text-foreground">Estimated total</span>
          <span className="text-lg font-extrabold text-orange">₨{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => dispatch({ type: 'PREV_STEP' })}>
          Back
        </Button>
        <Button className="flex-1" size="lg" onClick={onConfirm}>
          Confirm Booking
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        By confirming you agree to our Terms of Service. Payment is held in escrow.
      </p>
    </div>
  );
}
