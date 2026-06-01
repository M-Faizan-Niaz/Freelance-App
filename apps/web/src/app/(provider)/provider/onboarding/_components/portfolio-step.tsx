'use client'

import { useEffect, useRef, useState } from 'react'
import { Images, Loader2, X } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { customFetch } from '@repo/api-client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { getApiError } from '@/lib/error'

const MAX_PHOTOS = 10

interface PortfolioStepProps {
  onNext: () => void
}

export function PortfolioStep({ onNext }: PortfolioStepProps) {
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const portfolioRef = useRef<HTMLInputElement>(null)

  // Sync previews with files and revoke stale object URLs
  useEffect(() => {
    const urls = portfolioFiles.map((f) => URL.createObjectURL(f))
    setPreviews(urls)
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [portfolioFiles])

  // Orval's useUploadPortfolioImages only supports a single Blob body field.
  // The API accepts multiple `images` fields in one multipart request, so we
  // build the FormData manually here.
  const { mutate: uploadPortfolio, isPending } = useMutation({
    mutationFn: (files: File[]) => {
      const form = new FormData()
      for (const file of files) form.append('images', file)
      return customFetch<unknown>({
        url: '/v1/api/service-providers/me/portfolio',
        method: 'POST',
        data: form,
      })
    },
    onSuccess: () => {
      toast.success('Portfolio uploaded')
      onNext()
    },
    onError: (error) => toast.error(getApiError(error, 'Failed to upload portfolio')),
  })

  function addFiles(incoming: FileList) {
    setPortfolioFiles((prev) =>
      [...prev, ...Array.from(incoming)].slice(0, MAX_PHOTOS),
    )
  }

  function removeFile(index: number) {
    setPortfolioFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-5">
      <input
        ref={portfolioRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files)
          e.target.value = ''
        }}
      />

      <button
        type="button"
        onClick={() => portfolioRef.current?.click()}
        disabled={portfolioFiles.length >= MAX_PHOTOS}
        className="w-full border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/60 hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Images className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm font-medium">Click to select photos</p>
        <p className="text-xs text-muted-foreground mt-1">
          PNG, JPG — max {MAX_PHOTOS} photos, 5 MB each
        </p>
        {portfolioFiles.length > 0 && (
          <Badge variant="secondary" className="mt-2">
            {portfolioFiles.length}/{MAX_PHOTOS} selected
          </Badge>
        )}
      </button>

      {portfolioFiles.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {previews.map((src, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={src}
                alt={`portfolio-${i}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onNext} disabled={isPending}>
          Skip for now
        </Button>
        <Button
          className="flex-1"
          onClick={() => uploadPortfolio(portfolioFiles)}
          disabled={isPending || portfolioFiles.length === 0}
        >
          {isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          {isPending ? 'Uploading…' : 'Upload & Finish'}
        </Button>
      </div>
    </div>
  )
}
