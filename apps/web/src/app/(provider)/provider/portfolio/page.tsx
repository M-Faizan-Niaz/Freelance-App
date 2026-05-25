'use client'

import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Images, Loader2, Trash2, Upload } from 'lucide-react'
import {
  useDeletePortfolioImages,
  useGetMyProviderProfile,
  useListServiceProviderPortfolio,
} from '@repo/api-client'
import { customFetch } from '@repo/api-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { toast } from 'sonner'

function apiMsg(error: unknown, fallback: string) {
  return (error as { data?: { message?: string } })?.data?.message ?? fallback
}

const MAX_PHOTOS = 10

export default function PortfolioPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [deletingFileNames, setDeletingFileNames] = useState<Set<string>>(new Set())
  const fileRef = useRef<HTMLInputElement>(null)

  const { data: profileData } = useGetMyProviderProfile()
  const providerId = profileData?.data?.id

  const {
    data: portfolioData,
    isLoading,
    refetch,
  } = useListServiceProviderPortfolio(providerId ?? null, {
    query: { enabled: !!providerId },
  })
  const images = portfolioData?.data ?? []
  const remaining = MAX_PHOTOS - images.length

  // ── Upload — multiple files via direct customFetch ────────────────────────────

  const { mutate: upload, isPending: uploading } = useMutation({
    mutationFn: async (files: File[]) => {
      const form = new FormData()
      for (const file of files) {
        form.append('images', file)
      }
      return customFetch<unknown>({
        url: '/v1/api/service-providers/me/portfolio',
        method: 'POST',
        data: form,
      })
    },
    onSuccess: () => {
      toast.success('Photos uploaded')
      setSelectedFiles([])
      refetch()
    },
    onError: (error) => {
      toast.error(apiMsg(error, 'Failed to upload photos'))
    },
  })

  // ── Delete ────────────────────────────────────────────────────────────────────

  const { mutate: deleteImages } = useDeletePortfolioImages({
    mutation: {
      onSuccess: (_, variables) => {
        const names = variables.data.fileNames
        setDeletingFileNames((prev) => {
          const next = new Set(prev)
          names.forEach((n) => next.delete(n))
          return next
        })
        toast.success('Photo removed')
        refetch()
      },
      onError: (error) => {
        toast.error(apiMsg(error, 'Failed to delete photo'))
        setDeletingFileNames(new Set())
      },
    },
  })

  function handleDeleteImage(fileName: string) {
    setDeletingFileNames((prev) => new Set([...prev, fileName]))
    deleteImages({ data: { fileNames: [fileName] } })
  }

  function handleFilesChange(list: FileList) {
    const toAdd = Array.from(list).slice(0, remaining - selectedFiles.length)
    setSelectedFiles((prev) => [...prev, ...toAdd].slice(0, remaining))
  }

  function removeSelected(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  function handleUpload() {
    if (selectedFiles.length === 0) return
    upload(selectedFiles)
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div>
      <PageHeader
        title="My Portfolio"
        description="Upload photos of your work to attract more customers."
      >
        <Badge variant="secondary">
          {images.length}/{MAX_PHOTOS} photos
        </Badge>
      </PageHeader>

      {/* Upload zone — only show if under the limit */}
      {remaining > 0 && (
        <Card className="mb-6">
          <CardContent className="p-5 space-y-4">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleFilesChange(e.target.files)
                e.target.value = ''
              }}
            />

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={selectedFiles.length >= remaining}
              className="w-full border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/60 hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="font-medium text-sm">Click to select photos</p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG — up to {remaining} more, 5 MB each
              </p>
            </button>

            {/* New file previews */}
            {selectedFiles.length > 0 && (
              <>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {selectedFiles.map((file, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-lg overflow-hidden bg-muted border"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`new-${i}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeSelected(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading…</>
                  ) : (
                    <><Upload className="h-4 w-4 mr-2" /> Upload {selectedFiles.length} photo{selectedFiles.length > 1 ? 's' : ''}</>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Existing portfolio gallery */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <EmptyState
          icon={Images}
          title="No portfolio photos"
          message="Upload photos of your completed work to build trust with customers."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => {
            const isDeleting = deletingFileNames.has(img.fileName)
            return (
              <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden bg-muted border">
                <img
                  src={img.url}
                  alt={img.fileName}
                  className="w-full h-full object-cover transition-opacity"
                  style={{ opacity: isDeleting ? 0.4 : 1 }}
                />
                {isDeleting ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.fileName)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground transition-all"
                    title="Remove photo"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {remaining === 0 && (
        <p className="text-xs text-muted-foreground text-center mt-4">
          You've reached the maximum of {MAX_PHOTOS} portfolio photos. Delete a photo to add a new one.
        </p>
      )}
    </div>
  )
}
