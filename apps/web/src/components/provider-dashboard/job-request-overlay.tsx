'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { MapPin, Clock, Star, X } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { ProviderJob } from '@/app/provider-dashboard/_data/mock-jobs';

const COUNTDOWN_SECONDS = 30;

interface JobRequestOverlayProps {
  job: ProviderJob;
}

export function JobRequestOverlay({ job }: JobRequestOverlayProps) {
  const [visible, setVisible] = useState(true);
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
  const [accepted, setAccepted] = useState(false);

  const dismiss = useCallback(() => setVisible(false), []);

  useEffect(() => {
    if (!visible || accepted) return;
    if (seconds <= 0) {
      dismiss();
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, visible, accepted, dismiss]);

  if (!visible) return null;

  const netEarnings = job.grossAmount - job.commission;
  const pct = (seconds / COUNTDOWN_SECONDS) * 100;
  const circumference = 2 * Math.PI * 20; // r=20

  return (
    <div className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-sm rounded-2xl border bg-card shadow-2xl lg:inset-x-auto lg:right-6 lg:bottom-6">
      {/* Dismiss */}
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 pr-5">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
            {/* Countdown ring */}
            <svg className="absolute inset-0 -rotate-90" width="48" height="48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - pct / 100)}
                className="transition-all duration-1000"
              />
            </svg>
            <span className="relative text-sm font-bold text-primary">{seconds}</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-orange">
              New Job Request
            </p>
            <p className="text-sm font-semibold text-foreground">{job.service}</p>
          </div>
        </div>

        <Separator />

        {/* Customer */}
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {job.customerInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-foreground">{job.customerName}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {job.customerRating.toFixed(1)} rating
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {job.area}, {job.city} · {job.distance} away ({job.travelTime})
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            {new Date(job.date).toLocaleDateString('en-PK', { weekday: 'short', month: 'short', day: 'numeric' })} at {job.time}
          </div>
        </div>

        {/* Earnings */}
        <div className="rounded-lg bg-green-50 px-3 py-2 dark:bg-green-950/30">
          <p className="text-xs text-muted-foreground">Your earnings</p>
          <p className="text-lg font-extrabold text-green-700 dark:text-green-400">
            ₨{netEarnings.toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground">
            ₨{job.grossAmount.toLocaleString()} − ₨{job.commission} commission
          </p>
        </div>

        {/* Actions */}
        {!accepted ? (
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="text-destructive hover:text-destructive" onClick={dismiss}>
              Reject
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setAccepted(true)}
              asChild
            >
              <Link href={`/provider-dashboard/jobs/${job.id}`}>Accept</Link>
            </Button>
          </div>
        ) : (
          <p className={cn('text-center text-sm font-semibold text-green-600')}>
            ✓ Job accepted!
          </p>
        )}
      </div>
    </div>
  );
}
