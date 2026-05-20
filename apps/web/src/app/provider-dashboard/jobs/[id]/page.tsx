'use client';

import { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft,
  Star,
  MapPin,
  Clock,
  CalendarDays,
  MessageCircle,
  Navigation,
  CheckCircle2,
  Circle,
  ImagePlus,
  ShieldCheck,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { MOCK_JOBS, type JobStatus } from '../../_data/mock-jobs';

/* ── Job status flow ──────────────────────────────────────────── */

type ActiveStatus = Extract<JobStatus, 'accepted' | 'travelling' | 'arrived' | 'in_progress' | 'completed'>;

const FLOW: { key: ActiveStatus; label: string; action: string }[] = [
  { key: 'accepted', label: 'Accepted', action: "I'm on my way" },
  { key: 'travelling', label: 'Travelling', action: "I've Arrived" },
  { key: 'arrived', label: 'Arrived', action: 'Start Job' },
  { key: 'in_progress', label: 'In Progress', action: 'Mark Complete' },
  { key: 'completed', label: 'Completed', action: '' },
];

function nextStatus(current: JobStatus): ActiveStatus | null {
  const idx = FLOW.findIndex((s) => s.key === current);
  if (idx === -1 || idx >= FLOW.length - 1) return null;
  return FLOW[idx + 1].key;
}

function getFlowIndex(status: JobStatus): number {
  return FLOW.findIndex((s) => s.key === status);
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const job = MOCK_JOBS.find((j) => j.id === id);

  const [status, setStatus] = useState<JobStatus>(job?.status ?? 'accepted');
  const [photoCount, setPhotoCount] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!job) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Job not found.{' '}
        <Link href="/provider-dashboard/jobs" className="text-primary underline">
          Back to jobs
        </Link>
      </div>
    );
  }

  const flowIdx = getFlowIndex(status);
  const currentFlow = FLOW[flowIdx];
  const next = nextStatus(status);
  const isCompleted = status === 'completed';
  const isPending = status === 'pending';
  const net = job.grossAmount - job.commission;

  function advance() {
    if (next) setStatus(next);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Back */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">{job.service}</h1>
          <p className="text-sm text-muted-foreground">Job {job.id}</p>
        </div>
      </div>

      {/* Status progress — only for active jobs */}
      {!isPending && !['rejected'].includes(status) && (
        <section className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="mb-5 font-semibold text-foreground">Job Progress</h2>
          <ol className="space-y-0">
            {FLOW.map((stage, i) => {
              const done = i < flowIdx;
              const active = i === flowIdx;
              const isLast = i === FLOW.length - 1;
              return (
                <li key={stage.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs',
                        done
                          ? 'border-green-500 bg-green-500 text-white'
                          : active
                            ? 'border-primary bg-background text-primary ring-4 ring-primary/20'
                            : 'border-border bg-background text-muted-foreground',
                      )}
                    >
                      {done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-3.5 w-3.5 fill-current opacity-30" />}
                    </div>
                    {!isLast && (
                      <div
                        className={cn('w-px my-1', i < flowIdx ? 'bg-green-500' : 'bg-border')}
                        style={{ minHeight: '2rem' }}
                      />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className={cn('text-sm font-medium', done || active ? 'text-foreground' : 'text-muted-foreground')}>
                      {stage.label}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Action button */}
          {!isCompleted && next && (
            <Button
              className={cn('w-full', next === 'completed' ? 'bg-green-600 hover:bg-green-700' : '')}
              onClick={advance}
            >
              {currentFlow?.action}
            </Button>
          )}
          {isCompleted && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm font-semibold text-green-700 dark:bg-green-950/30 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              Job completed — payment released to your account.
            </div>
          )}
        </section>
      )}

      {/* Customer info */}
      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-foreground">Customer</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11">
              <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                {job.customerInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{job.customerName}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                {job.customerRating.toFixed(1)} rating
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" asChild>
              <Link href={`/chat?jobId=${job.id}`}>
                <MessageCircle className="h-4 w-4" />
                Chat
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Navigation className="h-4 w-4" />
              Navigate
            </Button>
          </div>
        </div>
      </section>

      {/* Job details */}
      <section className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
        <h2 className="font-semibold text-foreground">Job Details</h2>
        <Separator />
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">
              {new Date(job.date).toLocaleDateString('en-PK', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">{job.time}</span>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">
              {job.address}, {job.area}, {job.city} · {job.distance} ({job.travelTime})
            </span>
          </div>
          {job.notes && (
            <div className="flex items-start gap-3">
              <span className="w-16 shrink-0 text-muted-foreground">Notes</span>
              <span className="text-muted-foreground">{job.notes}</span>
            </div>
          )}
        </div>
      </section>

      {/* Earnings */}
      <section className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
        <h2 className="font-semibold text-foreground">Earnings</h2>
        <Separator />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Gross amount</span>
            <span className="font-medium text-foreground">₨{job.grossAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Platform commission (5%)</span>
            <span className="font-medium text-destructive">− ₨{job.commission.toLocaleString()}</span>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="font-semibold text-foreground">Your payout</span>
          <span className="text-lg font-extrabold text-green-600">₨{net.toLocaleString()}</span>
        </div>
        <div className="flex items-start gap-2 rounded-lg bg-green-50 p-3 text-xs text-green-800 dark:bg-green-950/30 dark:text-green-300">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          Released to your account within 24 hours of job completion.
        </div>
      </section>

      {/* Photo upload — only when completing */}
      {status === 'in_progress' && (
        <section className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
          <h2 className="font-semibold text-foreground">Completion Photos</h2>
          <p className="text-sm text-muted-foreground">
            Upload photos of the completed work before marking the job as done.
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => setPhotoCount(Math.min(e.target.files?.length ?? 0, 5))}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed py-5 text-sm transition-colors',
              photoCount > 0
                ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                : 'border-border text-muted-foreground hover:border-primary hover:text-primary',
            )}
          >
            <ImagePlus className="h-5 w-5" />
            {photoCount > 0 ? `${photoCount} photo${photoCount > 1 ? 's' : ''} added` : 'Upload completion photos'}
          </button>
        </section>
      )}

      {/* Pending actions */}
      {isPending && (
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="text-destructive hover:text-destructive">
            Reject Job
          </Button>
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => setStatus('accepted')}>
            Accept Job
          </Button>
        </div>
      )}
    </div>
  );
}
