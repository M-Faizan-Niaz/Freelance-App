'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useUpdateServiceProviderProfile } from '@repo/api-client';

const SUGGESTED_RATES = [500, 800, 1000, 1500, 2000];

interface StepRateProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepRate({ onNext, onBack }: StepRateProps) {
  const [rate, setRate] = useState('');
  const [rateError, setRateError] = useState('');
  const [apiError, setApiError] = useState('');

  const updateProfile = useUpdateServiceProviderProfile();

  async function handleNext() {
    setApiError('');
    setRateError('');

    const parsed = parseFloat(rate);
    if (!rate.trim() || isNaN(parsed) || parsed <= 0) {
      setRateError('Please enter a valid hourly rate.');
      return;
    }
    if (parsed > 999999) {
      setRateError('Rate cannot exceed PKR 999,999.');
      return;
    }

    try {
      await updateProfile.mutateAsync({ data: { hourlyRate: parsed } });
      onNext();
    } catch {
      setApiError('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Set your hourly rate</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          You can adjust this anytime from your dashboard. Set a rate that reflects your experience.
        </p>
      </div>

      <div className="space-y-3">
        <Label htmlFor="rate">Hourly rate (PKR)</Label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
            PKR
          </span>
          <Input
            id="rate"
            type="number"
            min={1}
            max={999999}
            placeholder="e.g. 1000"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className={cn(
              'pl-12',
              rateError && 'border-destructive focus-visible:ring-destructive',
            )}
          />
        </div>
        {rateError ? (
          <p className="text-xs text-destructive">{rateError}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            This is your starting rate. You can negotiate per job.
          </p>
        )}
      </div>

      {/* Quick-select chips */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Common rates</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_RATES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRate(String(r))}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                rate === String(r)
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:border-primary hover:text-primary',
              )}
            >
              PKR {r.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {apiError && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {apiError}
        </p>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
          disabled={updateProfile.isPending}
        >
          Back
        </Button>
        <Button
          className="flex-1"
          size="lg"
          onClick={handleNext}
          disabled={updateProfile.isPending}
        >
          {updateProfile.isPending ? 'Saving…' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
