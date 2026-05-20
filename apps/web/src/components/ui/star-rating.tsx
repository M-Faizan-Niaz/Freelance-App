'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

const sizeMap = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export function StarRating({
  value,
  max = 5,
  size = 'md',
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);

  const display = hovered ?? value;

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i + 1 <= display;
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(i + 1)}
            onMouseEnter={() => interactive && setHovered(i + 1)}
            onMouseLeave={() => interactive && setHovered(null)}
            className={cn(
              'transition-colors',
              interactive ? 'cursor-pointer' : 'cursor-default pointer-events-none',
            )}
          >
            <Star
              className={cn(
                sizeMap[size],
                filled ? 'fill-warning text-warning' : 'fill-none text-muted-foreground',
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
