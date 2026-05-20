import * as React from 'react';
import { cn } from '@/lib/utils';

type Tier = 'bronze' | 'silver' | 'gold';

const tierStyles: Record<Tier, string> = {
  bronze: 'bg-amber-100 text-amber-800 border-amber-300',
  silver: 'bg-slate-100 text-slate-700 border-slate-300',
  gold: 'bg-yellow-100 text-yellow-800 border-yellow-400',
};

const tierLabels: Record<Tier, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
};

interface BadgeChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  tier: Tier;
}

export function BadgeChip({ tier, className, ...props }: BadgeChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold',
        tierStyles[tier],
        className,
      )}
      {...props}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {tierLabels[tier]}
    </span>
  );
}
