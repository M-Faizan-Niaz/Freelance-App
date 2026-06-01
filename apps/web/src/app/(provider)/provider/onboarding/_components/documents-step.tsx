'use client'

import { useState } from 'react'
import { Lock, Loader2 } from 'lucide-react'
import { useUploadServiceProviderDocuments } from '@repo/api-client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { getApiError } from '@/lib/error'
import { FileZone } from './file-zone'

interface DocumentsStepProps {
  onNext: () => void
}

export function DocumentsStep({ onNext }: DocumentsStepProps) {
  const [cnicFront, setCnicFront] = useState<File | null>(null)
  const [cnicBack, setCnicBack] = useState<File | null>(null)

  const { mutate: uploadDocuments, isPending } = useUploadServiceProviderDocuments({
    mutation: {
      onSuccess: () => {
        toast.success('Documents uploaded')
        onNext()
      },
      onError: (error) => toast.error(getApiError(error, 'Failed to upload documents')),
    },
  })

  function handleNext() {
    if (!cnicFront || !cnicBack) {
      toast.error('Please upload both CNIC front and back')
      return
    }
    uploadDocuments({ data: { cnicFront, cnicBack } })
  }

  return (
    <div className="space-y-5">
      <FileZone
        label="CNIC Front *"
        file={cnicFront}
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onSelect={setCnicFront}
        onClear={() => setCnicFront(null)}
      />
      <FileZone
        label="CNIC Back *"
        file={cnicBack}
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onSelect={setCnicBack}
        onClear={() => setCnicBack(null)}
      />

      <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
        <Lock className="h-3.5 w-3.5 shrink-0" />
        <span>Documents are encrypted and only reviewed by our verification team.</span>
      </div>

      <Button className="w-full" size="lg" onClick={handleNext} disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
        {isPending ? 'Uploading…' : 'Next — Add Portfolio'}
      </Button>
    </div>
  )
}
