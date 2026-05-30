'use client'

import { useRef, useState } from 'react'
import { FileText, Loader2, ShieldCheck, Upload, X } from 'lucide-react'
import { useGetMyProviderProfile, useUploadServiceProviderDocuments } from '@repo/api-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { toast } from 'sonner'
import { getApiError } from '@/lib/error'

// ─── File upload zone ─────────────────────────────────────────────────────────

function DocZone({
  label,
  existingUrl,
  file,
  accept,
  onSelect,
  onClear,
}: {
  label: string
  existingUrl: string | null
  file: File | null
  accept: string
  onSelect: (f: File) => void
  onClear: () => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  const localPreview = file && file.type.startsWith('image/') ? URL.createObjectURL(file) : null
  const displayUrl = localPreview ?? existingUrl

  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <p className="font-medium text-sm">{label}</p>
        <input
          ref={ref}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) onSelect(f)
            e.target.value = ''
          }}
        />

        {displayUrl ? (
          <div className="relative border rounded-xl overflow-hidden bg-muted/30">
            {displayUrl.match(/\.(jpg|jpeg|png|webp)$/i) || localPreview ? (
              <img src={displayUrl} alt={label} className="w-full h-44 object-cover" />
            ) : (
              <div className="flex items-center gap-3 p-4">
                <FileText className="h-8 w-8 text-muted-foreground shrink-0" />
                <p className="text-sm font-medium truncate">{file?.name ?? 'Uploaded document'}</p>
              </div>
            )}
            {file && (
              <button
                type="button"
                onClick={onClear}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => ref.current?.click()}
            className="w-full border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/60 hover:bg-primary/5 transition-colors"
          >
            <Upload className="h-7 w-7 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium">Click to upload</p>
            <p className="text-xs text-muted-foreground mt-1">JPG, PNG, PDF — max 10 MB</p>
          </button>
        )}

        {!file && displayUrl && (
          <Button variant="outline" size="sm" onClick={() => ref.current?.click()}>
            Replace
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProviderDocumentsPage() {
  const [cnicFront, setCnicFront] = useState<File | null>(null)
  const [cnicBack, setCnicBack] = useState<File | null>(null)

  const { data: profileData, refetch } = useGetMyProviderProfile()
  const profile = profileData?.data

  const { mutate: upload, isPending } = useUploadServiceProviderDocuments({
    mutation: {
      onSuccess: () => {
        toast.success('Documents submitted for verification')
        setCnicFront(null)
        setCnicBack(null)
        refetch()
      },
      onError: (error) => {
        toast.error(getApiError(error, 'Failed to upload documents'))
      },
    },
  })

  function handleSubmit() {
    if (!cnicFront || !cnicBack) {
      toast.error('Please select both CNIC front and back images')
      return
    }
    upload({ data: { cnicFront, cnicBack } })
  }

  const hasNewFiles = cnicFront || cnicBack

  return (
    <div>
      <PageHeader
        title="Identity Verification"
        description="Upload your CNIC documents to get verified and start receiving jobs."
      >
        {profile?.isCnicVerified && (
          <Badge className="flex items-center gap-1 bg-green-100 text-green-700 border-green-200">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified
          </Badge>
        )}
      </PageHeader>

      {profile && !profile.isCnicVerified && profile.cnicFrontUrl && (
        <div className="mb-5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-700">
          Documents uploaded — verification is pending. This usually takes 24–48 hours.
        </div>
      )}

      <div className="max-w-xl space-y-4">
        <DocZone
          label="CNIC Front *"
          existingUrl={profile?.cnicFrontUrl ?? null}
          file={cnicFront}
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onSelect={setCnicFront}
          onClear={() => setCnicFront(null)}
        />
        <DocZone
          label="CNIC Back *"
          existingUrl={profile?.cnicBackUrl ?? null}
          file={cnicBack}
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onSelect={setCnicBack}
          onClear={() => setCnicBack(null)}
        />

        {hasNewFiles && (
          <Button className="w-full" size="lg" onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading…</>
            ) : (
              <><FileText className="h-4 w-4 mr-2" /> Submit for Verification</>
            )}
          </Button>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Your documents are encrypted and only reviewed by our verification team.
        </p>
      </div>
    </div>
  )
}
