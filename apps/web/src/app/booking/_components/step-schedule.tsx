'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { BookingState, BookingAction } from './booking-shell';
import type { ProviderProfile } from '@/app/providers/_data/provider-profiles';

const TIME_SLOTS = [
  { bucket: 'Morning', slots: [
    { key: '08:00', label: '8:00 AM' },
    { key: '09:00', label: '9:00 AM' },
    { key: '10:00', label: '10:00 AM' },
  ]},
  { bucket: 'Afternoon', slots: [
    { key: '12:00', label: '12:00 PM' },
    { key: '13:00', label: '1:00 PM' },
    { key: '14:00', label: '2:00 PM' },
  ]},
  { bucket: 'Evening', slots: [
    { key: '16:00', label: '4:00 PM' },
    { key: '17:00', label: '5:00 PM' },
    { key: '18:00', label: '6:00 PM' },
  ]},
];

const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface StepScheduleProps {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  provider: ProviderProfile | null;
}

export function StepSchedule({ state, dispatch }: StepScheduleProps) {
  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      return {
        iso,
        dayLabel: DAY_ABBR[d.getDay()],
        dateNum: d.getDate(),
        isToday: i === 0,
      };
    });
  }, []);

  function selectSlot(key: string, label: string) {
    dispatch({ type: 'SET_FIELD', field: 'selectedTimeSlot', value: key });
    dispatch({ type: 'SET_FIELD', field: 'selectedTimeLabel', value: label });
  }

  const canContinue = !!state.selectedDate && !!state.selectedTimeSlot;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">When do you need it?</h2>
        <p className="mt-1 text-sm text-muted-foreground">Pick a date and time that works for you.</p>
      </div>

      {/* Date strip */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Select a date</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {days.map((d) => {
            const selected = state.selectedDate === d.iso;
            return (
              <button
                key={d.iso}
                type="button"
                onClick={() => dispatch({ type: 'SET_FIELD', field: 'selectedDate', value: d.iso })}
                className={cn(
                  'flex shrink-0 flex-col items-center rounded-xl border px-4 py-3 text-sm font-medium transition-all',
                  selected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-foreground hover:border-primary/50',
                )}
              >
                <span className="text-xs opacity-70">{d.isToday ? 'Today' : d.dayLabel}</span>
                <span className="text-lg font-bold leading-tight">{d.dateNum}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      <div className="space-y-4">
        <p className="text-sm font-medium text-foreground">Select a time</p>
        {TIME_SLOTS.map(({ bucket, slots }) => (
          <div key={bucket} className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {bucket}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {slots.map(({ key, label }) => {
                const selected = state.selectedTimeSlot === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => selectSlot(key, label)}
                    className={cn(
                      'rounded-lg border py-2.5 text-sm font-medium transition-all',
                      selected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-foreground hover:border-primary/50',
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => dispatch({ type: 'PREV_STEP' })}>
          Back
        </Button>
        <Button className="flex-1" disabled={!canContinue} onClick={() => dispatch({ type: 'NEXT_STEP' })}>
          Continue
        </Button>
      </div>
    </div>
  );
}
