import { cn } from '@/lib/utils';
import type { AvailabilityDay } from '@/app/providers/_data/provider-profiles';

interface AvailabilityCalendarProps {
  days: AvailabilityDay[];
}

export function AvailabilityCalendar({ days }: AvailabilityCalendarProps) {
  return (
    <section className="rounded-xl border bg-card shadow-sm">
      <div className="border-b px-5 py-4">
        <h2 className="font-semibold text-foreground">Availability</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">Next 7 days</p>
      </div>

      <div className="flex gap-2 overflow-x-auto px-5 py-4 pb-5">
        {days.map((day) => (
          <div
            key={day.dayKey}
            className={cn(
              'flex min-w-[60px] flex-col items-center gap-1.5 rounded-xl border py-3 text-center',
              day.available
                ? 'border-success/30 bg-success/5'
                : 'border-border bg-muted opacity-60',
            )}
          >
            <span className="text-[11px] font-medium text-muted-foreground leading-none">
              {day.dateLabel.split(' ')[0]}
            </span>
            <span className="text-base font-bold text-foreground leading-none">
              {day.dateLabel.split(' ')[1]}
            </span>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-semibold leading-tight',
                day.available
                  ? 'bg-success/15 text-success'
                  : 'bg-muted-foreground/10 text-muted-foreground',
              )}
            >
              {day.available ? 'Free' : 'Busy'}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
