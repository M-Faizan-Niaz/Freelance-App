import { Search } from 'lucide-react';
import { SkeletonCard } from '@/components/ui/skeleton-card';
import { EmptyState } from '@/components/ui/empty-state';
import { ServiceProviderCard } from './provider-card';
import type { ServiceProvider } from '../_data/mock-providers';

interface ProviderListProps {
  providers: ServiceProvider[];
  loading?: boolean;
}

export function ProviderList({ providers, loading = false }: ProviderListProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <EmptyState
        icon={<Search className="h-6 w-6" />}
        title="No professionals found"
        description="Try adjusting your filters or search in a nearby city."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {providers.map((provider) => (
        <ServiceProviderCard key={provider.id} provider={provider} />
      ))}
    </div>
  );
}
