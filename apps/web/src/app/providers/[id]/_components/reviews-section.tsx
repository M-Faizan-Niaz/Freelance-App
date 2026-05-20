'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StarRating } from '@/components/ui/star-rating';
import { Progress } from '@/components/ui/progress';
import type { ProviderProfile } from '@/app/providers/_data/provider-profiles';

const PAGE_SIZE = 3;

interface ReviewsSectionProps {
  provider: ProviderProfile;
}

export function ReviewsSection({ provider }: ReviewsSectionProps) {
  const [visible, setVisible] = useState(PAGE_SIZE);

  const total = provider.ratingBreakdown.reduce((s, r) => s + r.count, 0);

  return (
    <section className="rounded-xl border bg-card shadow-sm">
      <div className="border-b px-5 py-4">
        <h2 className="font-semibold text-foreground">Customer Reviews</h2>
      </div>

      <div className="p-5 space-y-6">
        {/* Rating summary */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
          {/* Overall score */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <span className="text-4xl font-extrabold text-foreground">
              {provider.rating.toFixed(1)}
            </span>
            <StarRating value={provider.rating} size="md" />
            <span className="text-xs text-muted-foreground">{total} reviews</span>
          </div>

          {/* Breakdown bars */}
          <div className="flex-1 space-y-2">
            {provider.ratingBreakdown
              .slice()
              .sort((a, b) => b.stars - a.stars)
              .map(({ stars, count }) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="w-6 shrink-0 text-right text-xs text-muted-foreground">
                      {stars}★
                    </span>
                    <Progress value={pct} className="h-2 flex-1" />
                    <span className="w-8 shrink-0 text-right text-xs text-muted-foreground">
                      {pct}%
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Review cards */}
        <div className="divide-y">
          {provider.reviews.slice(0, visible).map((review) => (
            <div key={review.id} className="flex gap-3 py-4 first:pt-0 last:pb-0">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                  {review.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{review.name}</span>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating value={review.rating} size="sm" />
                  <span className="text-xs text-muted-foreground">· {review.service}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        {visible < provider.reviews.length && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
          >
            Load more reviews
          </Button>
        )}
      </div>
    </section>
  );
}
