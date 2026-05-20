import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star-rating';
import { BadgeChip } from '@/components/ui/badge-chip';
import { PriceTag } from '@/components/ui/price-tag';
import { VerificationBadge } from '@/components/ui/verification-badge';
import { cn } from '@/lib/utils';

export interface ProviderCardData {
  id: string;
  name: string;
  avatarUrl?: string;
  category: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  city: string;
  responseTime: string;
  tier?: 'bronze' | 'silver' | 'gold';
  isVerified?: boolean;
  isOnline?: boolean;
}

interface ProviderCardProps {
  provider: ProviderCardData;
  className?: string;
}

export function ProviderCard({ provider, className }: ProviderCardProps) {
  const initials = provider.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        'group flex flex-col rounded-xl border bg-card shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5',
        className,
      )}
    >
      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <Avatar className="h-12 w-12">
              <AvatarImage src={provider.avatarUrl} alt={provider.name} />
              <AvatarFallback className="text-sm font-semibold">{initials}</AvatarFallback>
            </Avatar>
            {provider.isOnline && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success ring-2 ring-card" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-foreground truncate">{provider.name}</p>
              {provider.tier && <BadgeChip tier={provider.tier} />}
            </div>
            <Badge variant="secondary" className="mt-1 text-xs">
              {provider.category}
            </Badge>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <StarRating value={provider.rating} size="sm" />
          <span className="text-xs font-semibold text-foreground">{provider.rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({provider.reviewCount} reviews)</span>
        </div>

        {/* Meta */}
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            {provider.city}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3 shrink-0" />
            Responds in {provider.responseTime}
          </span>
        </div>

        {provider.isVerified && (
          <VerificationBadge type="cnic" className="self-start" />
        )}
      </div>

      {/* Footer */}
      <div className="border-t p-4 flex items-center justify-between gap-3">
        <PriceTag amount={provider.startingPrice} />
        <Button size="sm" asChild>
          <Link href={`/providers/${provider.id}`}>View Profile</Link>
        </Button>
      </div>
    </div>
  );
}
