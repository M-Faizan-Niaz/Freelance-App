'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ImagePlus, X } from 'lucide-react';
import { useGetBooking, useCreateReview } from '@repo/api-client';
import type { CreateReviewBody } from '@repo/api-client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { StarSelector } from '@/components/review/star-selector';
import { TagChips } from '@/components/review/tag-chips';

function formatDate(iso?: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-PK', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function ReviewPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const id = Number(bookingId);
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { data: bookingData, isLoading } = useGetBooking(id, {
    query: { enabled: !!id },
  });
  const booking = bookingData?.data;

  const { mutateAsync: submit, isPending } = useCreateReview();

  async function handleSubmit() {
    if (!rating) {
      setError('Please select a star rating.');
      return;
    }
    setError(null);
    const parts = [
      tags.length ? tags.join(', ') : null,
      comment.trim() || null,
    ].filter(Boolean) as string[];

    const body: CreateReviewBody = {
      bookingId: id,
      rating,
      ...(parts.length && { comment: parts.join('\n\n') }),
    };

    try {
      await submit({ data: body });
      router.push('/dashboard');
    } catch (e: unknown) {
      const err = e as { data?: { error?: { message?: string } } };
      setError(err?.data?.error?.message ?? 'Failed to submit review. Please try again.');
    }
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setPhotos((prev) => [...prev, ...files].slice(0, 3));
  }

  return (
    <main className="container mx-auto max-w-lg px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Leave a Review</h1>
        <p className="mt-1 text-sm text-muted-foreground">Share your experience with this provider.</p>
      </div>

      {/* Provider card */}
      <div className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm">
        {isLoading ? (
          <>
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </>
        ) : (
          <>
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
                {`P${booking?.providerId ?? ''}`}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">Provider #{booking?.providerId}</p>
              <p className="text-sm text-muted-foreground">
                Job completed · {formatDate(booking?.completedAt ?? booking?.scheduledAt)}
              </p>
              <Badge variant="success" className="mt-1 text-xs">Completed</Badge>
            </div>
          </>
        )}
      </div>

      {/* Star selector */}
      <section className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
        <h2 className="font-semibold text-foreground">Your Rating</h2>
        <StarSelector value={rating} onChange={setRating} />
      </section>

      {/* Tag chips */}
      <section className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
        <h2 className="font-semibold text-foreground">What went well?</h2>
        <TagChips selected={tags} onChange={setTags} />
      </section>

      {/* Written review */}
      <section className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">
            Written Review{' '}
            <span className="text-muted-foreground font-normal text-sm">(optional)</span>
          </h2>
          <span className="text-xs text-muted-foreground">{comment.length}/500</span>
        </div>
        <Textarea
          rows={4}
          maxLength={500}
          placeholder="Describe your experience with this provider…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </section>

      {/* Photo upload */}
      <section className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
        <h2 className="font-semibold text-foreground">
          Add Photos{' '}
          <span className="text-muted-foreground font-normal text-sm">(optional, up to 3)</span>
        </h2>
        <div className="flex flex-wrap gap-3">
          {photos.map((f, i) => (
            <div key={i} className="relative h-20 w-20 rounded-lg overflow-hidden border">
              <img
                src={URL.createObjectURL(f)}
                alt=""
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                className="absolute top-0.5 right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {photos.length < 3 && (
            <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground hover:border-primary hover:text-primary transition-colors">
              <ImagePlus className="h-6 w-6" />
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>
          )}
        </div>
      </section>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Actions */}
      <div className="space-y-3 pb-6">
        <Button
          className="w-full h-12 text-base"
          onClick={handleSubmit}
          disabled={isPending || !rating}
        >
          {isPending ? 'Submitting…' : 'Submit Review'}
        </Button>
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip for now
        </button>
      </div>
    </main>
  );
}
