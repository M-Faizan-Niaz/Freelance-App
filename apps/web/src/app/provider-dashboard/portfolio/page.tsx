'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Trash2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useUploadPortfolioImages,
  useDeletePortfolioImages,
  useListServiceProviderPortfolio,
  getListServiceProviderPortfolioQueryKey,
} from '@repo/api-client';
import type {
  ListServiceProviderPortfolio200DataItem,
  UploadPortfolioImages200DataUploadedItem,
} from '@repo/api-client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// TODO: Replace null with the authenticated provider's numeric SP ID once a
// GET /service-providers/me endpoint is available. The upload response returns
// serviceProviderId which seeds this state after the first upload.
const INITIAL_PROVIDER_ID: number | null = null;

function Banner({
  type,
  message,
  onClose,
}: {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg px-4 py-3 text-sm',
        type === 'success'
          ? 'bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-300'
          : 'bg-destructive/10 text-destructive',
      )}
    >
      {type === 'success' ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <span className="flex-1">{message}</span>
      <button type="button" onClick={onClose} className="shrink-0 opacity-60 hover:opacity-100">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function PortfolioPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [providerId, setProviderId] = useState<number | null>(INITIAL_PROVIDER_ID);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deletingFileName, setDeletingFileName] = useState<string | null>(null);

  const { data: portfolioData, isLoading } = useListServiceProviderPortfolio(providerId);
  const images: ListServiceProviderPortfolio200DataItem[] = portfolioData?.data ?? [];

  const uploadMutation = useUploadPortfolioImages();
  const deleteMutation = useDeletePortfolioImages();

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedFiles(Array.from(e.target.files ?? []));
    e.target.value = '';
  }

  async function handleUpload() {
    if (selectedFiles.length === 0) return;
    setBanner(null);

    const uploaded: UploadPortfolioImages200DataUploadedItem[] = [];
    const failedNames: string[] = [];

    // The generated hook supports one file per call — upload each sequentially.
    for (const file of selectedFiles) {
      try {
        const res = await uploadMutation.mutateAsync({ data: { images: file } });
        uploaded.push(...(res.data.uploaded ?? []));
        failedNames.push(...(res.data.failed?.map((f) => f.fileName) ?? []));

        // Seed the provider ID from the first successful upload response.
        if (providerId === null && res.data.uploaded?.[0]?.serviceProviderId) {
          setProviderId(res.data.uploaded[0].serviceProviderId);
        }
      } catch {
        failedNames.push(file.name);
      }
    }

    await queryClient.invalidateQueries({
      queryKey: getListServiceProviderPortfolioQueryKey(providerId),
    });

    setSelectedFiles([]);

    if (failedNames.length > 0) {
      setBanner({
        type: 'error',
        message: `${uploaded.length} uploaded, ${failedNames.length} failed: ${failedNames.join(', ')}`,
      });
    } else {
      setBanner({
        type: 'success',
        message: `${uploaded.length} photo${uploaded.length !== 1 ? 's' : ''} uploaded successfully.`,
      });
    }
  }

  async function handleDelete(img: ListServiceProviderPortfolio200DataItem) {
    setDeletingFileName(img.fileName);
    setBanner(null);
    try {
      await deleteMutation.mutateAsync({ data: { fileNames: [img.fileName] } });
      await queryClient.invalidateQueries({
        queryKey: getListServiceProviderPortfolioQueryKey(providerId),
      });
      setBanner({ type: 'success', message: 'Photo removed.' });
    } catch (err) {
      setBanner({ type: 'error', message: err instanceof Error ? err.message : 'Delete failed.' });
    } finally {
      setDeletingFileName(null);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Portfolio</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload photos of your work. Providers with portfolios get 3× more bookings.
        </p>
      </div>

      {banner && (
        <Banner
          type={banner.type}
          message={banner.message}
          onClose={() => setBanner(null)}
        />
      )}

      {/* Upload section */}
      <section className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
        <h2 className="font-semibold text-foreground">Add Photos</h2>
        <Separator />
        <p className="text-sm text-muted-foreground">
          JPEG, PNG, WEBP or GIF · Max 5 MB each · Up to 10 photos total.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFilesSelected}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed py-6 text-sm transition-colors',
            selectedFiles.length > 0
              ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400'
              : 'border-border text-muted-foreground hover:border-orange hover:text-orange',
          )}
        >
          <ImagePlus className="h-5 w-5" />
          {selectedFiles.length > 0
            ? `${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''} selected`
            : 'Click to select photos'}
        </button>

        {selectedFiles.length > 0 && (
          <Button
            onClick={handleUpload}
            disabled={uploadMutation.isPending}
            className="w-full sm:w-auto"
          >
            {uploadMutation.isPending
              ? 'Uploading…'
              : `Upload ${selectedFiles.length} photo${selectedFiles.length !== 1 ? 's' : ''}`}
          </Button>
        )}
      </section>

      {/* Current portfolio */}
      <section className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Current Portfolio</h2>
          {images.length > 0 && (
            <span className="text-xs text-muted-foreground">{images.length} / 10 photos</span>
          )}
        </div>
        <Separator />

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {providerId === null
              ? 'Upload your first photo to see your portfolio here.'
              : 'No photos yet. Upload some above.'}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((img) => (
              <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg">
                <img
                  src={img.url}
                  alt={img.fileName}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                    disabled={deletingFileName === img.fileName}
                    onClick={() => handleDelete(img)}
                    aria-label={`Delete ${img.fileName}`}
                  >
                    {deletingFileName === img.fileName ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
