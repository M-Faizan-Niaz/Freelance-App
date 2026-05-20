import { Briefcase, Zap, Clock, CalendarDays } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { ProviderProfile } from '@/app/providers/_data/provider-profiles';

interface StatsBarProps {
  provider: ProviderProfile;
}

export function StatsBar({ provider }: StatsBarProps) {
  const stats = [
    {
      icon: Briefcase,
      label: 'Jobs Completed',
      value: provider.jobsCompleted.toLocaleString(),
    },
    {
      icon: Zap,
      label: 'Response Rate',
      value: `${provider.responseRate}%`,
    },
    {
      icon: Clock,
      label: 'Avg Response',
      value: provider.responseTime,
    },
    {
      icon: CalendarDays,
      label: 'Member Since',
      value: provider.memberSince,
    },
  ];

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="grid grid-cols-2 divide-x divide-y sm:grid-cols-4 sm:divide-y-0">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 px-4 py-5 text-center">
            <Icon className="h-4 w-4 text-primary" />
            <span className="text-lg font-bold text-foreground">{value}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
