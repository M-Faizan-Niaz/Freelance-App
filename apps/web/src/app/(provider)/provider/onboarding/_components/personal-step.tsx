'use client'

import { useEffect, useRef, useState } from 'react'
import { Camera, Loader2, User } from 'lucide-react'
import { useUpdateMe, useUploadProfilePhoto } from '@repo/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { getApiError } from '@/lib/error'

interface PersonalStepProps {
  onNext: () => void
}

export function PersonalStep({ onNext }: PersonalStepProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [phone, setPhone] = useState('')
  const photoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview)
    }
  }, [photoPreview])

  const { mutate: uploadPhoto, isPending: photoPending } = useUploadProfilePhoto({
    mutation: {
      onError: (error) => toast.error(getApiError(error, 'Failed to upload photo')),
    },
  })

  const { mutate: updateMe, isPending: mePending } = useUpdateMe({
    mutation: {
      onSuccess: onNext,
      onError: (error) => toast.error(getApiError(error, 'Failed to save personal info')),
    },
  })

  function handlePhotoSelect(file: File) {
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
    uploadPhoto({ data: { photo: file } })
  }

  function handleNext() {
    if (!phone.trim()) {
      toast.error('Please enter your phone number')
      return
    }
    updateMe({ data: { phoneNumber: phone.trim() } })
  }

  return (
    <div className="space-y-6">
      {/* Avatar upload */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border-2 border-border flex items-center justify-center">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            disabled={photoPending}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {photoPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Camera className="h-3.5 w-3.5" />
            )}
          </button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handlePhotoSelect(f)
              e.target.value = ''
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {photoFile ? photoFile.name : 'Tap to add a profile photo'}
        </p>
      </div>

      {/* Phone number */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Phone Number *</label>
        <Input
          type="tel"
          placeholder="e.g. 03001234567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">Customers use this to reach you.</p>
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={handleNext}
        disabled={photoPending || mePending}
      >
        {mePending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
        {mePending ? 'Saving…' : 'Next — Your Services'}
      </Button>
    </div>
  )
}
