'use client';

import { Wrench, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { BookingState, BookingAction } from './booking-shell';
import type { ProviderProfile } from '@/app/providers/_data/provider-profiles';

interface StepEstimateProps {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  provider: ProviderProfile | null;
}

export function StepEstimate({ state, dispatch, provider }: StepEstimateProps) {
  const basePrice =
    provider?.servicesOffered.find((s) => s.label === state.serviceLabel)?.price ??
    provider?.startingPrice ??
    0;
  const platformFee = Math.round(basePrice * 0.05);
  const total = basePrice + platformFee;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Price estimate</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Based on your selected service. Final price confirmed after assessment.
        </p>
      </div>

      {/* Service summary */}
      <div className="flex items-center gap-4 rounded-xl border bg-card px-5 py-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Wrench className="h-6 w-6" />
        </div>
        <div>
          <p className="font-semibold text-foreground">{state.serviceLabel}</p>
          <p className="text-sm text-muted-foreground">Estimated time: 1–2 hours</p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="rounded-xl border bg-card px-5 py-4 space-y-3">
        <p className="text-sm font-semibold text-foreground">Cost breakdown</p>
        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Labor estimate</span>
            <span className="font-medium text-foreground">₨{basePrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Parts estimate</span>
            <span className="font-medium text-muted-foreground">TBD after assessment</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Platform fee (5%)</span>
            <span className="font-medium text-foreground">₨{platformFee.toLocaleString()}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between">
          <span className="font-semibold text-foreground">Estimated total</span>
          <span className="text-lg font-extrabold text-orange">₨{total.toLocaleString()}</span>
        </div>

        <p className="text-xs text-muted-foreground">
          Final price confirmed after job assessment. You will not be charged until the job is complete.
        </p>
      </div>

      {/* Escrow note */}
      <div className="flex items-start gap-3 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800 dark:bg-green-950/30 dark:text-green-300">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
        <p>Payment held securely in escrow until the job is marked complete.</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => dispatch({ type: 'PREV_STEP' })}>
          Back
        </Button>
        <Button className="flex-1" onClick={() => dispatch({ type: 'NEXT_STEP' })}>
          Continue
        </Button>
      </div>
    </div>
  );
}
