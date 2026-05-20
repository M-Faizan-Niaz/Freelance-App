'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StarRating } from '@/components/ui/star-rating';
import { Separator } from '@/components/ui/separator';
import type { ProviderProfile } from '@/app/providers/_data/provider-profiles';

interface BookingSidebarProps {
  provider: ProviderProfile;
}

export function BookingSidebar({ provider }: BookingSidebarProps) {
  const [selectedService, setSelectedService] = useState(
    provider.servicesOffered[0]?.label ?? '',
  );

  const selected = provider.servicesOffered.find((s) => s.label === selectedService);
  const price = selected?.price ?? provider.startingPrice;

  const bookingHref = `/booking?providerId=${provider.id}&service=${encodeURIComponent(selectedService)}&category=${provider.categorySlug}`;
  const messageHref = `/chat?providerId=${provider.id}`;

  return (
    <>
      {/* ── Desktop sidebar ───────────────────────────────── */}
      <aside className="hidden lg:block">
        <div className="sticky top-20 rounded-xl border bg-card shadow-sm">
          <div className="p-5 space-y-5">
            {/* Provider summary */}
            <div className="space-y-1">
              <p className="font-semibold text-foreground">{provider.name}</p>
              <div className="flex items-center gap-2">
                <StarRating value={provider.rating} size="sm" />
                <span className="text-xs text-muted-foreground">
                  {provider.rating.toFixed(1)} ({provider.reviewCount} reviews)
                </span>
              </div>
            </div>

            <Separator />

            {/* Service selector */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Select Service
              </Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  {provider.servicesOffered.map((s) => (
                    <SelectItem key={s.label} value={s.label}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div className="rounded-lg bg-surface px-4 py-3">
              <p className="text-xs text-muted-foreground">Starting from</p>
              <p className="text-2xl font-extrabold text-orange">
                ₨{price.toLocaleString()}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Final price confirmed after assessment
              </p>
            </div>

            {/* CTAs */}
            <div className="space-y-2">
              <Button className="w-full" size="lg" asChild>
                <Link href={bookingHref}>Book {provider.name.split(' ')[0]}</Link>
              </Button>
              <Button variant="outline" className="w-full gap-2" asChild>
                <Link href={messageHref}>
                  <MessageCircle className="h-4 w-4" />
                  Message
                </Link>
              </Button>
            </div>

            {/* Trust note */}
            <p className="text-center text-xs text-muted-foreground">
              Payment held in escrow until job is complete
            </p>
          </div>
        </div>
      </aside>

      {/* ── Mobile bottom bar ─────────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground truncate">{selectedService}</p>
            <p className="text-lg font-extrabold text-orange leading-tight">
              ₨{price.toLocaleString()}
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 shrink-0" asChild>
            <Link href={messageHref}>
              <MessageCircle className="h-4 w-4" />
              Chat
            </Link>
          </Button>
          <Button size="sm" className="shrink-0 px-5" asChild>
            <Link href={bookingHref}>Book Now</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
