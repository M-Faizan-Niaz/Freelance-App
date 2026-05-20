'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export function OnlineToggle() {
  const [isOnline, setIsOnline] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => setIsOnline((v) => !v)}
        role="switch"
        aria-checked={isOnline}
        aria-label="Toggle online status"
        className={cn(
          'relative flex h-14 w-32 items-center rounded-full border-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4',
          isOnline
            ? 'border-green-500 bg-green-500 focus-visible:ring-green-500/30'
            : 'border-border bg-muted focus-visible:ring-border/30',
        )}
      >
        {/* Labels */}
        <span
          className={cn(
            'absolute left-3 text-xs font-bold transition-opacity duration-200',
            isOnline ? 'opacity-100 text-white' : 'opacity-0',
          )}
        >
          ONLINE
        </span>
        <span
          className={cn(
            'absolute right-3 text-xs font-bold transition-opacity duration-200',
            isOnline ? 'opacity-0' : 'opacity-100 text-muted-foreground',
          )}
        >
          OFF
        </span>

        {/* Thumb */}
        <span
          className={cn(
            'absolute flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300',
            isOnline ? 'left-[calc(100%-2.75rem)]' : 'left-1',
          )}
        >
          <span
            className={cn(
              'h-3 w-3 rounded-full transition-colors duration-300',
              isOnline ? 'bg-green-500' : 'bg-muted-foreground',
            )}
          />
        </span>
      </button>

      <p className={cn('text-sm font-semibold', isOnline ? 'text-green-600' : 'text-muted-foreground')}>
        {isOnline ? 'You are Online — accepting jobs' : 'You are Offline'}
      </p>
    </div>
  );
}
