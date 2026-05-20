'use client';

import { useState } from 'react';
import { Map, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MapToggleProps {
  children: React.ReactNode;
}

export function MapToggle({ children }: MapToggleProps) {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="space-y-4">
      {/* Toggle button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMap((v) => !v)}
          className="gap-2"
        >
          {showMap ? (
            <>
              <List className="h-4 w-4" />
              List View
            </>
          ) : (
            <>
              <Map className="h-4 w-4" />
              Map View
            </>
          )}
        </Button>
      </div>

      {/* Split or list layout */}
      <div className={cn('flex gap-5', showMap ? 'flex-col lg:flex-row' : 'flex-col')}>
        {/* Provider list */}
        <div className={cn('flex flex-col gap-4', showMap && 'lg:flex-1')}>{children}</div>

        {/* Map pane */}
        {showMap && (
          <div className="lg:w-96 lg:shrink-0 lg:sticky lg:top-20 lg:self-start">
            <MapPlaceholder />
          </div>
        )}
      </div>
    </div>
  );
}

function MapPlaceholder() {
  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-xl border bg-muted lg:h-[600px]">
      {/* Grid lines to simulate a map */}
      <svg
        className="absolute inset-0 h-full w-full opacity-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Simulated road lines */}
      <svg className="absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="40%" x2="100%" y2="40%" stroke="white" strokeWidth="6" />
        <line x1="0" y1="70%" x2="100%" y2="70%" stroke="white" strokeWidth="4" />
        <line x1="30%" y1="0" x2="30%" y2="100%" stroke="white" strokeWidth="6" />
        <line x1="65%" y1="0" x2="65%" y2="100%" stroke="white" strokeWidth="4" />
      </svg>

      {/* Mock location pins */}
      {[
        { top: '35%', left: '28%', label: 'A' },
        { top: '55%', left: '62%', label: 'B' },
        { top: '25%', left: '55%', label: 'C' },
      ].map((pin) => (
        <div
          key={pin.label}
          className="absolute flex flex-col items-center"
          style={{ top: pin.top, left: pin.left, transform: 'translate(-50%, -100%)' }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-lg text-primary-foreground text-xs font-bold">
            {pin.label}
          </div>
          <div className="h-2 w-0.5 bg-primary" />
        </div>
      ))}

      {/* Centre label */}
      <div className="absolute inset-0 flex items-end justify-center pb-4">
        <span className="rounded-full bg-background/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
          Map view — Google Maps integration coming soon
        </span>
      </div>
    </div>
  );
}
