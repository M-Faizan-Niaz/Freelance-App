'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PortfolioImage } from '@/app/providers/_data/provider-profiles';

interface PortfolioGalleryProps {
  images: PortfolioImage[];
}

export function PortfolioGallery({ images }: PortfolioGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const displayed = images.slice(0, 12);
  const isOpen = lightboxIndex !== null;

  function prev() {
    setLightboxIndex((i) => (i === null ? 0 : (i - 1 + displayed.length) % displayed.length));
  }

  function next() {
    setLightboxIndex((i) => (i === null ? 0 : (i + 1) % displayed.length));
  }

  return (
    <section className="rounded-xl border bg-card shadow-sm">
      <div className="border-b px-5 py-4">
        <h2 className="font-semibold text-foreground">Portfolio</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">{displayed.length} photos</p>
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3">
        {displayed.map((img, index) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setLightboxIndex(index)}
            className="group relative aspect-square overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={img.alt}
          >
            <div
              className={cn(
                'h-full w-full bg-gradient-to-br transition-transform duration-300 group-hover:scale-105',
                img.gradient,
              )}
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
              <ImageIcon className="h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <Dialog open={isOpen} onOpenChange={(open) => !open && setLightboxIndex(null)}>
        <DialogContent className="max-w-2xl border-0 bg-black/90 p-0 shadow-2xl">
          <DialogTitle className="sr-only">Portfolio photo</DialogTitle>

          {/* Image */}
          {lightboxIndex !== null && (
            <div
              className={cn(
                'aspect-video w-full bg-gradient-to-br',
                displayed[lightboxIndex].gradient,
              )}
            />
          )}

          {/* Controls */}
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
