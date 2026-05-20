'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

type BarDatum = { day: string; amount: number };

interface EarningsChartProps {
  data: BarDatum[];
  className?: string;
}

export function EarningsChart({ data, className }: EarningsChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.amount), 1);

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex h-40 items-end gap-2">
        {data.map((d, i) => {
          const heightPct = (d.amount / max) * 100;
          const isHovered = hovered === i;
          const isEmpty = d.amount === 0;

          return (
            <div
              key={d.day}
              className="relative flex flex-1 flex-col items-center gap-1"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Tooltip */}
              {isHovered && !isEmpty && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background shadow-lg">
                  ₨{d.amount.toLocaleString()}
                </div>
              )}

              {/* Bar */}
              <div className="flex w-full flex-1 items-end">
                <div
                  className={cn(
                    'w-full rounded-t-md transition-all duration-300',
                    isEmpty
                      ? 'bg-border'
                      : isHovered
                        ? 'bg-primary'
                        : 'bg-primary/70',
                  )}
                  style={{ height: isEmpty ? '4px' : `${heightPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Day labels */}
      <div className="flex gap-2">
        {data.map((d) => (
          <span key={d.day} className="flex-1 text-center text-[11px] text-muted-foreground">
            {d.day}
          </span>
        ))}
      </div>
    </div>
  );
}
