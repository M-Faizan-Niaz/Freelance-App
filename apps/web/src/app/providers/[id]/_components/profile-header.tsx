import { MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BadgeChip } from '@/components/ui/badge-chip';
import { Badge } from '@/components/ui/badge';
import { VerificationBadge } from '@/components/ui/verification-badge';
import type { ProviderProfile } from '@/app/providers/_data/provider-profiles';

interface ProfileHeaderProps {
  provider: ProviderProfile;
}

export function ProfileHeader({ provider }: ProfileHeaderProps) {
  const initials = provider.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      {/* Cover photo */}
      <div className="h-36 bg-gradient-to-br from-primary/80 via-primary to-blue-700 sm:h-48" />

      {/* Avatar + info row */}
      <div className="px-5 pb-5">
        {/* Avatar overlapping the cover */}
        <div className="-mt-10 mb-4 flex items-end justify-between">
          <div className="relative">
            <Avatar className="h-20 w-20 ring-4 ring-background">
              <AvatarImage src={provider.avatarUrl} alt={provider.name} />
              <AvatarFallback className="text-xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            {/* Online dot */}
            <span
              className={`absolute bottom-1 right-1 h-4 w-4 rounded-full ring-2 ring-background ${
                provider.isOnline ? 'bg-success' : 'bg-muted-foreground'
              }`}
            />
          </div>

          {/* Online label (desktop) */}
          <span
            className={`hidden text-xs font-medium sm:block ${
              provider.isOnline ? 'text-success' : 'text-muted-foreground'
            }`}
          >
            {provider.isOnline ? '● Online now' : '○ Offline'}
          </span>
        </div>

        {/* Name + badges */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">{provider.name}</h1>
            {provider.tier && <BadgeChip tier={provider.tier} />}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{provider.category}</Badge>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {provider.city}
            </span>
          </div>

          {/* Verification badges */}
          {provider.isVerified && (
            <div className="flex flex-wrap gap-2 pt-1">
              <VerificationBadge type="cnic" />
              <VerificationBadge type="background" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
