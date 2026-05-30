'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle,
  FileText,
  Images,
  Loader2,
  Upload,
  User,
  X,
} from 'lucide-react'
import {
  customFetch,
  useListServiceCategories,
  useUpdateMe,
  useUpdateMyProviderProfile,
  useUploadProfilePhoto,
  useUploadServiceProviderDocuments,
  type ListServiceCategories200DataItem,
} from '@repo/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { getApiError } from '@/lib/error'

type Category = ListServiceCategories200DataItem

// ─── Step bar ─────────────────────────────────────────────────────────────────

const STEPS = ['Personal', 'Services', 'Documents', 'Portfolio', 'Done']

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  done
                    ? 'bg-primary text-white'
                    : active
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {done ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`text-sm font-medium hidden sm:block ${
                  active ? 'text-primary' : done ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-6 sm:w-10 ${done ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── File drop zone (single file) ─────────────────────────────────────────────

function FileZone({
  label,
  file,
  accept,
  onSelect,
  onClear,
}: {
  label: string
  file: File | null
  accept: string
  onSelect: (f: File) => void
  onClear: () => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  const preview = file && file.type.startsWith('image/') ? URL.createObjectURL(file) : null

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
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
      {file ? (
        <div className="relative border rounded-xl overflow-hidden bg-muted/30">
          {preview ? (
            <img src={preview} alt={label} className="w-full h-44 object-cover" />
          ) : (
            <div className="flex items-center gap-3 p-4">
              <FileText className="h-8 w-8 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
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
    </div>
  )
}

// ─── Onboarding page ──────────────────────────────────────────────────────────

export default function ProviderOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)

  // Step 0 — Personal
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [phone, setPhone] = useState('')
  const photoInputRef = useRef<HTMLInputElement>(null)

  // Step 1 — Services
  const [bio, setBio] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [city, setCity] = useState('')
  const [coverageRadius, setCoverageRadius] = useState('')
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])

  // Step 2 — Documents
  const [cnicFront, setCnicFront] = useState<File | null>(null)
  const [cnicBack, setCnicBack] = useState<File | null>(null)

  // Step 3 — Portfolio
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([])
  const portfolioRef = useRef<HTMLInputElement>(null)

  // Data
  const { data: categoriesData, isLoading: categoriesLoading } = useListServiceCategories()
  const categories: Category[] = (categoriesData?.data ?? []).filter((c) => c.isActive)

  // ── Mutations ──────────────────────────────────────────────────────────────

  const { mutate: uploadPhoto, isPending: photoPending } = useUploadProfilePhoto({
    mutation: {
      onSuccess: () => {
        toast.success('Photo uploaded')
      },
      onError: (error) => {
        toast.error(getApiError(error, 'Failed to upload photo'))
      },
    },
  })

  const { mutate: updateMe, isPending: mePending } = useUpdateMe({
    mutation: {
      onSuccess: () => {
        setStep(1)
      },
      onError: (error) => {
        toast.error(getApiError(error, 'Failed to save personal info'))
      },
    },
  })

  const { mutate: updateProfile, isPending: profilePending } = useUpdateMyProviderProfile({
    mutation: {
      onSuccess: () => {
        toast.success('Services saved')
        setStep(2)
      },
      onError: (error) => {
        toast.error(getApiError(error, 'Failed to save services'))
      },
    },
  })

  const { mutate: uploadDocuments, isPending: docsPending } = useUploadServiceProviderDocuments({
    mutation: {
      onSuccess: () => {
        toast.success('Documents uploaded')
        setStep(3)
      },
      onError: (error) => {
        toast.error(getApiError(error, 'Failed to upload documents'))
      },
    },
  })

  const { mutate: uploadPortfolio, isPending: portfolioPending } = useMutation({
    mutationFn: async (files: File[]) => {
      const form = new FormData()
      for (const file of files) form.append('images', file)
      return customFetch<unknown>({ url: '/v1/api/service-providers/me/portfolio', method: 'POST', data: form })
    },
    onSuccess: () => {
      toast.success('Portfolio uploaded')
      setStep(4)
    },
    onError: (error) => {
      toast.error(getApiError(error, 'Failed to upload portfolio'))
    },
  })

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handlePhotoSelect(file: File) {
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
    uploadPhoto({ data: { photo: file } })
  }

  function handlePersonalNext() {
    if (!phone.trim()) {
      toast.error('Please enter your phone number')
      return
    }
    updateMe({ data: { phoneNumber: phone.trim() } })
  }

  function toggleCategory(id: number) {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  function handleServicesNext() {
    if (!hourlyRate || Number(hourlyRate) <= 0) {
      toast.error('Please enter a valid hourly rate')
      return
    }
    if (selectedCategoryIds.length === 0) {
      toast.error('Please select at least one service category')
      return
    }
    updateProfile({
      data: {
        bio: bio.trim() || undefined,
        hourlyRate: Number(hourlyRate),
        city: city.trim() || undefined,
        coverageRadiusKm: coverageRadius ? Number(coverageRadius) : undefined,
        categoryIds: selectedCategoryIds,
      },
    })
  }

  function handleDocumentsNext() {
    if (!cnicFront || !cnicBack) {
      toast.error('Please upload both CNIC front and back')
      return
    }
    uploadDocuments({ data: { cnicFront, cnicBack } })
  }

  function handlePortfolioNext() {
    if (portfolioFiles.length === 0) {
      toast.error('Please select at least one photo')
      return
    }
    uploadPortfolio(portfolioFiles)
  }

  function addPortfolioFiles(incoming: FileList) {
    const toAdd = Array.from(incoming).slice(0, 10 - portfolioFiles.length)
    setPortfolioFiles((prev) => [...prev, ...toAdd].slice(0, 10))
  }

  function removePortfolioFile(index: number) {
    setPortfolioFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const personalPending = photoPending || mePending

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-6">
        {step > 0 && step < 4 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        )}
        <h1 className="text-2xl font-bold">Complete your provider profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {step === 0 && 'Start with a photo and your contact info.'}
          {step === 1 && 'Tell customers about your services and pricing.'}
          {step === 2 && 'Upload your CNIC for identity verification.'}
          {step === 3 && 'Show your best work to attract more customers.'}
          {step === 4 && "You're all set — we'll review and approve your profile shortly."}
        </p>
      </div>

      <StepBar current={step} />

      {/* ── Step 0: Personal ─────────────────────────────────────────────────── */}
      {step === 0 && (
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

          <Button className="w-full" size="lg" onClick={handlePersonalNext} disabled={personalPending}>
            {mePending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…</>
            ) : (
              <>Next — Your Services <ArrowRight className="h-4 w-4 ml-2" /></>
            )}
          </Button>
        </div>
      )}

      {/* ── Step 1: Services ─────────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Bio */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Bio (optional)</label>
            <textarea
              className="w-full min-h-[90px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              placeholder="Describe your experience, skills, and what makes you stand out…"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">{bio.length}/500</p>
          </div>

          {/* Rate + City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Hourly Rate (Rs) *</label>
              <Input
                type="number"
                min={1}
                placeholder="e.g. 1500"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">City</label>
              <Input
                type="text"
                placeholder="e.g. Karachi"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          {/* Coverage radius */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Coverage Radius (km)</label>
            <Input
              type="number"
              min={1}
              placeholder="e.g. 15"
              value={coverageRadius}
              onChange={(e) => setCoverageRadius(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">How far are you willing to travel for a job?</p>
          </div>

          {/* Service categories */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Service Categories *</p>
            <p className="text-xs text-muted-foreground">Select all services you offer</p>
            {categoriesLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-10 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map((cat) => {
                  const selected = selectedCategoryIds.includes(cat.id)
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`text-sm px-3 py-2.5 rounded-lg border text-left transition-colors font-medium ${
                        selected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      {cat.name}
                    </button>
                  )
                })}
              </div>
            )}
            {selectedCategoryIds.length > 0 && (
              <p className="text-xs text-primary font-medium">{selectedCategoryIds.length} selected</p>
            )}
          </div>

          <Button className="w-full" size="lg" onClick={handleServicesNext} disabled={profilePending}>
            {profilePending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…</>
            ) : (
              <>Next — Upload Documents <ArrowRight className="h-4 w-4 ml-2" /></>
            )}
          </Button>
        </div>
      )}

      {/* ── Step 2: Documents ───────────────────────────────────────────────── */}
      {step === 2 && (
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

          <p className="text-xs text-muted-foreground text-center">
            Documents are encrypted and only reviewed by our verification team.
          </p>

          <Button className="w-full" size="lg" onClick={handleDocumentsNext} disabled={docsPending}>
            {docsPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading…</>
            ) : (
              <>Next — Add Portfolio <ArrowRight className="h-4 w-4 ml-2" /></>
            )}
          </Button>
        </div>
      )}

      {/* ── Step 3: Portfolio ───────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-5">
          <input
            ref={portfolioRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) addPortfolioFiles(e.target.files)
              e.target.value = ''
            }}
          />

          <button
            type="button"
            onClick={() => portfolioRef.current?.click()}
            disabled={portfolioFiles.length >= 10}
            className="w-full border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/60 hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Images className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium">Click to select photos</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG — max 10 photos, 5 MB each</p>
            {portfolioFiles.length > 0 && (
              <Badge variant="secondary" className="mt-2">
                {portfolioFiles.length}/10 selected
              </Badge>
            )}
          </button>

          {portfolioFiles.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {portfolioFiles.map((file, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`portfolio-${i}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePortfolioFile(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStep(4)}
              disabled={portfolioPending}
            >
              Skip for now
            </Button>
            <Button
              className="flex-1"
              onClick={handlePortfolioNext}
              disabled={portfolioPending || portfolioFiles.length === 0}
            >
              {portfolioPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading…</>
              ) : (
                <>Upload & Finish <ArrowRight className="h-4 w-4 ml-2" /></>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 4: Done ────────────────────────────────────────────────────── */}
      {step === 4 && (
        <div className="text-center py-12 space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold">Profile submitted!</h2>
          <p className="text-muted-foreground max-w-sm mx-auto text-sm">
            Our team will verify your CNIC and approve your profile within 24–48 hours. You'll be
            notified once you go live.
          </p>

          <Card className="max-w-sm mx-auto text-left">
            <CardContent className="p-4 space-y-2.5">
              {[
                'Personal info & photo saved',
                'Services & pricing configured',
                'CNIC documents uploaded',
                'Portfolio photos added',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>

          <Button size="lg" className="mt-2" onClick={() => router.push('/provider/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      )}
    </div>
  )
}
