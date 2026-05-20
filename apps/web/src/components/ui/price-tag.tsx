import * as React from 'react';
import { cn } from '@/lib/utils';

interface PriceTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  amount: number;
  prefix?: string;
}

export function PriceTag({ amount, prefix = 'Starting from', className, ...props }: PriceTagProps) {
  return (
    <span className={cn('text-sm font-medium text-foreground', className)} {...props}>
      <span className="text-muted-foreground">{prefix} </span>
      <span className="text-orange font-semibold">₨{amount.toLocaleString()}</span>
    </span>
  );
}
