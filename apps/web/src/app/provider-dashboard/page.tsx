import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Briefcase,
  DollarSign,
  Star,
  ChevronRight,
  CalendarDays,
  Clock,
  MapPin,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { OnlineToggle } from '@/components/provider-dashboard/online-toggle';
import { JobRequestOverlay } from '@/components/provider-dashboard/job-request-overlay';
import { MOCK_JOBS } from './_data/mock-jobs';

export const metadata: Metadata = { title: 'Provider Dashboard — HirePro' };

const STATUS_CONFIG = {
  pending: { label: 'New Request', variant: 'orange' as const },
  accepted: { label: 'Accepted', variant: 'default' as const },
  travelling: { label: 'Travelling', variant: 'default' as const },
  arrived: { label: 'Arrived', variant: 'default' as const },
  in_progress: { label: 'In Progress', variant: 'orange' as const },
  completed: { label: 'Completed', variant: 'success' as const },
  rejected: { label: 'Rejected', variant: 'destructive' as const },
};

export default function ProviderDashboardPage() {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayJobs = MOCK_JOBS.filter((j) => j.date === todayStr);
  const completedToday = todayJobs.filter((j) => j.status === 'completed');
  const earningsToday = completedToday.reduce((s, j) => s + j.grossAmount - j.commission, 0);

  const pendingJob = MOCK_JOBS.find((j) => j.status === 'pending');
  const activeJob = MOCK_JOBS.find((j) => j.status === 'in_progress');
  const recentJobs = MOCK_JOBS.filter((j) => j.status !== 'pending').slice(0, 5);

  const stats = [
    {
      icon: Briefcase,
      label: 'Jobs Today',
      value: todayJobs.length || MOCK_JOBS.filter((j) => j.status === 'completed').length,
      color: 'text-primary bg-primary/10',
    },
    {
      icon: DollarSign,
      label: 'Earned Today',
      value: `₨${(earningsToday || 6550).toLocaleString()}`,
      color: 'text-green-600 bg-green-100 dark:bg-green-950/40',
    },
    {
      icon: Star,
      label: 'Avg Rating',
      value: '4.9',
      color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-950/40',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Provider Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-PK', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <OnlineToggle />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="rounded-xl border bg-card p-4 shadow-sm text-center">
            <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-xl font-extrabold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Active job */}
      {activeJob && (
        <div className="space-y-3">
          <h2 className="font-semibold text-foreground">Active Job</h2>
          <div className="rounded-xl border border-orange/30 bg-orange/5 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-orange/10 text-sm font-semibold text-orange">
                    {activeJob.customerInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{activeJob.service}</p>
                  <p className="text-sm text-muted-foreground">{activeJob.customerName}</p>
                </div>
              </div>
              <Badge variant="orange">In Progress</Badge>
            </div>
            <Separator className="my-3" />
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {activeJob.area}, {activeJob.city}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {activeJob.time}
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" asChild>
                <Link href={`/provider-dashboard/jobs/${activeJob.id}`}>Manage Job</Link>
              </Button>
              <Button size="sm" variant="outline" className="flex-1" asChild>
                <Link href={`/chat?jobId=${activeJob.id}`}>Chat</Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Recent activity */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Recent Jobs</h2>
          <Button variant="ghost" size="sm" className="gap-1 text-primary" asChild>
            <Link href="/provider-dashboard/jobs">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="space-y-2">
          {recentJobs.map((job) => {
            const { label, variant } = STATUS_CONFIG[job.status];
            return (
              <Link
                key={job.id}
                href={`/provider-dashboard/jobs/${job.id}`}
                className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm transition-colors hover:bg-muted/40"
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {job.customerInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{job.service}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    {new Date(job.date).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={variant} className="text-[10px]">{label}</Badge>
                  <span className="text-xs font-medium text-green-600">
                    ₨{(job.grossAmount - job.commission).toLocaleString()}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Incoming job overlay */}
      {pendingJob && <JobRequestOverlay job={pendingJob} />}
    </div>
  );
}
