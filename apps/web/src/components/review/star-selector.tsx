'use client';

import { cn } from '@/lib/utils';
import { StarRating } from '@/components/ui/star-rating';

const LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent!',
};

interface Props {
  value: number;
  onChange: (v: number) => void;
}

export function StarSelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <StarRating value={value} interactive onChange={onChange} size="lg" />
      <p className={cn('text-sm font-medium transition-opacity', value ? 'opacity-100' : 'opacity-0')}>
        {LABELS[value] ?? ''}
      </p>
    </div>
  );
}
