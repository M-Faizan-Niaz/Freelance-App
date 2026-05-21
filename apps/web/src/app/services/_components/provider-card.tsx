import Link from 'next/link';
import { MapPin, Clock, Briefcase } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star-rating';
import { BadgeChip } from '@/components/ui/badge-chip';
import { PriceTag } from '@/components/ui/price-tag';
import { VerificationBadge } from '@/components/ui/verification-badge';
import { getInitials } from '@/lib/utils';
import type { ServiceProvider } from '../_data/mock-providers';

interface ServiceProviderCardProps {
  provider: ServiceProvider;
}

export function ServiceProviderCard({ provider }: ServiceProviderCardProps) {
  const initials = getInitials(provider.name);

  return (
    <article className="flex flex-col gap-0 rounded-xl border bg-card shadow-sm transition-all hover:shadow-md sm:flex-row">
      {/* ── Avatar column ─────────────────────────────────── */}
      <div className="flex shrink-0 items-start gap-4 p-5 sm:w-[72px] sm:flex-col sm:items-center sm:px-4 sm:py-5">
        <div className="relative">
          <Avatar className="h-14 w-14">
            <AvatarImage src={provider.avatarUrl} alt={provider.name} />
            <AvatarFallback className="text-sm font-semibold">{initials}</AvatarFallback>
          </Avatar>
          {provider.isOnline && (
            <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full bg-success ring-2 ring-card" />
          )}
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-3 px-5 pb-5 pt-0 sm:px-0 sm:py-5">
        {/* Name row */}
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">{provider.name}</h3>
          {provider.tier && <BadgeChip tier={provider.tier} />}
          <Badge variant="secondary" className="text-xs">
            {provider.category}
          </Badge>
          {provider.isOnline && (
            <span className="text-xs font-medium text-success">● Online now</span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <StarRating value={provider.rating} size="sm" />
          <span className="text-xs font-semibold">{provider.rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">
            ({provider.reviewCount} reviews)
          </span>
        </div>

        {/* Bio */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{provider.bio}</p>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            {provider.city}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3 shrink-0" />
            Responds in {provider.responseTime}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Briefcase className="h-3 w-3 shrink-0" />
            {provider.jobsCompleted} jobs done
          </span>
          {provider.isVerified && <VerificationBadge type="cnic" />}
        </div>
      </div>

      {/* ── Action column ─────────────────────────────────── */}
      <div className="flex shrink-0 flex-row items-center justify-between border-t px-5 py-4 sm:w-44 sm:flex-col sm:items-end sm:justify-center sm:gap-3 sm:border-l sm:border-t-0 sm:px-5">
        <PriceTag amount={provider.startingPrice} />
        <div className="flex flex-col gap-2 sm:w-full">
          <Button size="sm" className="w-full sm:w-auto" asChild>
            <Link href={`/booking?providerId=${provider.id}&category=${provider.categorySlug}`}>
              Book Now
            </Link>
          </Button>
          <Button size="sm" variant="outline" className="w-full sm:w-auto" asChild>
            <Link href={`/providers/${provider.id}`}>View Profile</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
