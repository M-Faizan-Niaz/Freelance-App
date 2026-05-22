'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useListServiceProviderPortfolio } from '@repo/api-client';

interface PortfolioGalleryProps {
  providerId: number;
}

export function PortfolioGallery({ providerId }: PortfolioGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { data, isLoading } = useListServiceProviderPortfolio(providerId);

  const images = data?.data ?? [];
  const displayed = images.slice(0, 12);
  const isOpen = lightboxIndex !== null;

  function prev() {
    setLightboxIndex((i) => (i === null ? 0 : (i - 1 + displayed.length) % displayed.length));
  }

  function next() {
    setLightboxIndex((i) => (i === null ? 0 : (i + 1) % displayed.length));
  }

  if (isLoading) {
    return (
      <section className="rounded-xl border bg-card shadow-sm">
        <div className="border-b px-5 py-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="mt-1 h-3 w-16" />
        </div>
        <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  if (displayed.length === 0) {
    return (
      <section className="rounded-xl border bg-card shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-foreground">Portfolio</h2>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 px-5 py-10 text-center text-muted-foreground">
          <ImageIcon className="h-8 w-8 opacity-40" />
          <p className="text-sm">No portfolio photos yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border bg-card shadow-sm">
      <div className="border-b px-5 py-4">
        <h2 className="font-semibold text-foreground">Portfolio</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">{displayed.length} photos</p>
      </div>

      <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3">
        {displayed.map((img, index) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setLightboxIndex(index)}
            className="group relative aspect-square overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={img.fileName}
          >
            <img
              src={img.url}
              alt={img.fileName}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
              <ImageIcon className="h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </button>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => !open && setLightboxIndex(null)}>
        <DialogContent className="max-w-2xl border-0 bg-black/90 p-0 shadow-2xl">
          <DialogTitle className="sr-only">Portfolio photo</DialogTitle>

          {lightboxIndex !== null && (
            <img
              src={displayed[lightboxIndex].url}
              alt={displayed[lightboxIndex].fileName}
              className="aspect-video w-full object-cover"
            />
          )}

          <div className="flex items-center justify-between px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={prev}
              className="text-white hover:bg-white/10 hover:text-white"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <span className="text-sm text-white/60">
              {lightboxIndex !== null ? lightboxIndex + 1 : 0} / {displayed.length}
            </span>

            <Button
              variant="ghost"
              size="icon"
              onClick={next}
              className="text-white hover:bg-white/10 hover:text-white"
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
