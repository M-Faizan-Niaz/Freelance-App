'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

const QUICK_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'available-today', label: 'Available Today' },
  { key: 'top-rated', label: 'Top Rated' },
  { key: 'verified', label: 'Verified Only' },
  { key: 'under-1000', label: 'Under ₨1,000' },
] as const;

const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rating' },
  { value: 'price', label: 'Lowest Price' },
  { value: 'distance', label: 'Nearest First' },
] as const;

const MIN_RATING_OPTIONS = [
  { value: '4.5', label: '4.5★ & above' },
  { value: '4.0', label: '4.0★ & above' },
  { value: '3.5', label: '3.5★ & above' },
] as const;

const MAX_PRICE_OPTIONS = [
  { value: '500', label: 'Under ₨500' },
  { value: '1000', label: 'Under ₨1,000' },
  { value: '2000', label: 'Under ₨2,000' },
  { value: '5000', label: 'Under ₨5,000' },
] as const;

interface ServiceFilterBarProps {
  resultCount: number;
}

export function ServiceFilterBar({ resultCount }: ServiceFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentFilter = searchParams.get('filter') ?? 'all';
  const currentSort = searchParams.get('sort') ?? '';
  const currentMinRating = searchParams.get('minRating') ?? '';
  const currentMaxPrice = searchParams.get('maxPrice') ?? '';

  const hasAdvancedFilters = !!(currentSort || currentMinRating || currentMaxPrice);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v === null || v === '') params.delete(k);
        else params.set(k, v);
      });
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  function setQuickFilter(key: string) {
    updateParams({ filter: key === 'all' ? null : key });
  }

  function clearAll() {
    router.push(pathname, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Quick filter chips + advanced button */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {QUICK_FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setQuickFilter(key)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                currentFilter === key || (key === 'all' && currentFilter === 'all')
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-foreground hover:border-primary/40 hover:bg-accent',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Advanced filter + clear */}
        <div className="flex items-center gap-2 shrink-0">
          {(currentFilter !== 'all' || hasAdvancedFilters) && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="gap-1 text-xs h-8">
              <X className="h-3 w-3" />
              Clear
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn('gap-2 h-8', hasAdvancedFilters && 'border-primary text-primary')}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filters
                {hasAdvancedFilters && (
                  <Badge className="h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center">
                    !
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Advanced Filters</SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-8">
                {/* Sort */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Sort By</Label>
                  <RadioGroup
                    value={currentSort}
                    onValueChange={(v) => updateParams({ sort: v })}
                    className="gap-2"
                  >
                    {SORT_OPTIONS.map(({ value, label }) => (
                      <div key={value} className="flex items-center gap-2">
                        <RadioGroupItem value={value} id={`sort-${value}`} />
                        <Label htmlFor={`sort-${value}`} className="font-normal cursor-pointer">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Minimum rating */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Minimum Rating</Label>
                  <RadioGroup
                    value={currentMinRating}
                    onValueChange={(v) => updateParams({ minRating: v })}
                    className="gap-2"
                  >
                    {MIN_RATING_OPTIONS.map(({ value, label }) => (
                      <div key={value} className="flex items-center gap-2">
                        <RadioGroupItem value={value} id={`rating-${value}`} />
                        <Label htmlFor={`rating-${value}`} className="font-normal cursor-pointer">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Max price */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Maximum Price</Label>
                  <RadioGroup
                    value={currentMaxPrice}
                    onValueChange={(v) => updateParams({ maxPrice: v })}
                    className="gap-2"
                  >
                    {MAX_PRICE_OPTIONS.map(({ value, label }) => (
                      <div key={value} className="flex items-center gap-2">
                        <RadioGroupItem value={value} id={`price-${value}`} />
                        <Label htmlFor={`price-${value}`} className="font-normal cursor-pointer">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Clear advanced filters */}
                {hasAdvancedFilters && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      updateParams({ sort: null, minRating: null, maxPrice: null })
                    }
                  >
                    Clear Advanced Filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-muted-foreground">
        {resultCount} professional{resultCount !== 1 ? 's' : ''} found
      </p>
    </div>
  );
}
