import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarDays, Clock, MapPin, Star } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import { Briefcase } from 'lucide-react';
import { MOCK_JOBS, type ProviderJob } from '../_data/mock-jobs';

export const metadata: Metadata = { title: 'Jobs — HirePro Provider' };

const BriefcaseIcon = <Briefcase className="h-6 w-6" />;

function JobCard({ job }: { job: ProviderJob }) {
  const net = job.grossAmount - job.commission;
  const isPending = job.status === 'pending';

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {job.customerInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{job.service}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{job.customerName}</span>
              <span>·</span>
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{job.customerRating}</span>
            </div>
          </div>
        </div>
        <span className="text-sm font-bold text-green-600">₨{net.toLocaleString()}</span>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" />
          {new Date(job.date).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {job.time}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {job.area}, {job.city} · {job.distance}
        </span>
      </div>

      {/* Actions */}
      {isPending ? (
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
            Reject
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700" asChild>
            <Link href={`/provider-dashboard/jobs/${job.id}`}>Accept</Link>
          </Button>
        </div>
      ) : (
        <Button size="sm" variant="outline" className="w-full" asChild>
          <Link href={`/provider-dashboard/jobs/${job.id}`}>View Details</Link>
        </Button>
      )}
    </div>
  );
}

export default function JobsPage() {
  const newRequests = MOCK_JOBS.filter((j) => j.status === 'pending');
  const active = MOCK_JOBS.filter((j) =>
    ['accepted', 'travelling', 'arrived', 'in_progress'].includes(j.status),
  );
  const history = MOCK_JOBS.filter((j) =>
    ['completed', 'rejected'].includes(j.status),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Jobs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage incoming requests and active jobs.
        </p>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="requests" className="flex-1 sm:flex-none">
            New Requests
            {newRequests.length > 0 && (
              <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange text-[10px] font-bold text-orange-foreground">
                {newRequests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="active" className="flex-1 sm:flex-none">Active</TabsTrigger>
          <TabsTrigger value="history" className="flex-1 sm:flex-none">History</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="mt-4 space-y-3">
          {newRequests.length > 0 ? (
            newRequests.map((j) => <JobCard key={j.id} job={j} />)
          ) : (
            <EmptyState
              icon={BriefcaseIcon}
              title="No new requests"
              description="New job requests will appear here when customers book you."
            />
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-4 space-y-3">
          {active.length > 0 ? (
            active.map((j) => <JobCard key={j.id} job={j} />)
          ) : (
            <EmptyState
              icon={BriefcaseIcon}
              title="No active jobs"
              description="Accepted and ongoing jobs appear here."
            />
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4 space-y-3">
          {history.length > 0 ? (
            history.map((j) => <JobCard key={j.id} job={j} />)
          ) : (
            <EmptyState
              icon={BriefcaseIcon}
              title="No job history"
              description="Completed and rejected jobs will appear here."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
