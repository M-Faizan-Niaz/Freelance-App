'use client'

import { useRef, useState, useEffect } from 'react'
import {
  Camera,
  MapPin,
  Star,
  Briefcase,
  CheckCircle2,
  Clock,
  Shield,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import {
  useGetMe,
  useUpdateMe,
  useGetMyProviderProfile,
  useUpdateMyProviderProfile,
  useListServiceCategories,
  useUploadProfilePhoto,
  type ListServiceCategories200DataItem,
} from '@repo/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import Link from 'next/link'

type Category = ListServiceCategories200DataItem

function apiMsg(error: unknown, fallback: string) {
  return (error as { data?: { message?: string } })?.data?.message ?? fallback
}

function statusBadge(status: string) {
  if (status === 'approved')
    return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">Verified</Badge>
  if (status === 'rejected')
    return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">Rejected</Badge>
  return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">Pending Review</Badge>
}

export default function ProviderProfilePage() {
  const photoInputRef = useRef<HTMLInputElement>(null)

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data: meData, isLoading: meLoading, refetch: refetchMe } = useGetMe()
  const { data: spData, isLoading: spLoading, refetch: refetchSp } = useGetMyProviderProfile()
  const { data: categoriesData } = useListServiceCategories()

  const user = meData?.data
  const sp = spData?.data
  const categories: Category[] = (categoriesData?.data ?? []).filter((c) => c.isActive)

  // ── Personal state ────────────────────────────────────────────────────────
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  // ── Professional state ────────────────────────────────────────────────────
  const [bio, setBio] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [city, setCity] = useState('')
  const [coverageRadius, setCoverageRadius] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])

  useEffect(() => {
    if (user) {
      setName(user.fullName ?? user.name ?? '')
      setPhone(user.phoneNumber ?? '')
    }
  }, [user])

  useEffect(() => {
    if (sp) {
      setBio(sp.bio ?? '')
      setHourlyRate(sp.hourlyRate ?? '')
      setCity(sp.city ?? '')
      setCoverageRadius(sp.coverageRadiusKm ?? '')
      setSelectedCategories(sp.categoryIds ?? [])
    }
  }, [sp])

  // ── Mutations ─────────────────────────────────────────────────────────────
  const { mutate: uploadPhoto, isPending: photoPending } = useUploadProfilePhoto({
    mutation: {
      onSuccess: () => { toast.success('Profile photo updated'); refetchMe() },
      onError: (e) => toast.error(apiMsg(e, 'Failed to upload photo')),
    },
  })

  const { mutate: updateMe, isPending: mePending } = useUpdateMe({
    mutation: {
      onSuccess: () => { toast.success('Personal info saved'); refetchMe() },
      onError: (e) => toast.error(apiMsg(e, 'Failed to save personal info')),
    },
  })

  const { mutate: updateProfile, isPending: profilePending } = useUpdateMyProviderProfile({
    mutation: {
      onSuccess: () => { toast.success('Profile updated'); refetchSp() },
      onError: (e) => toast.error(apiMsg(e, 'Failed to update profile')),
    },
  })

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoPreview(URL.createObjectURL(file))
    uploadPhoto({ data: { photo: file } })
    e.target.value = ''
  }

  function handleSavePersonal() {
    updateMe({ data: { name: name.trim() || undefined, phoneNumber: phone.trim() || undefined } })
  }

  function handleSaveProfessional() {
    if (!hourlyRate || Number(hourlyRate) <= 0) {
      toast.error('Please enter a valid hourly rate')
      return
    }
    updateProfile({
      data: {
        bio: bio.trim() || undefined,
        hourlyRate: Number(hourlyRate),
        city: city.trim() || undefined,
        coverageRadiusKm: coverageRadius ? Number(coverageRadius) : undefined,
        categoryIds: selectedCategories.length ? selectedCategories : undefined,
      },
    })
  }

  function toggleCategory(id: number) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const isLoading = meLoading || spLoading

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  const displayPhoto = photoPreview ?? user?.profilePhotoUrl ?? user?.image ?? undefined
  const initials = (user?.fullName ?? user?.name ?? 'P').charAt(0).toUpperCase()
  const memberYear = sp?.createdAt ? new Date(sp.createdAt).getFullYear() : new Date().getFullYear()
  const rating = sp?.averageRating ? Number(sp.averageRating).toFixed(1) : '—'

  // ── Page ───────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          This is how customers see you — keep it complete to get more jobs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left sidebar: identity card ─────────────────────────────── */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            {/* Coloured banner */}
            <div className="h-20 bg-gradient-to-r from-primary/80 to-primary" />

            <CardContent className="px-6 pb-6 -mt-10">
              {/* Avatar */}
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <Avatar className="h-20 w-20 ring-4 ring-background shadow-md">
                    <AvatarImage src={displayPhoto} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                      {photoPending ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : initials}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={photoPending}
                    className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center shadow hover:bg-primary/90 transition-colors disabled:opacity-50"
                    title="Change photo"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoSelect}
                  />
                </div>

                <h2 className="font-semibold text-lg leading-tight">
                  {user?.fullName ?? user?.name}
                </h2>
                <p className="text-xs text-muted-foreground mb-2">{user?.email}</p>
                {sp && statusBadge(sp.verificationStatus)}
              </div>

              <Separator className="my-4" />

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-xl font-bold text-foreground">{sp?.totalJobsCompleted ?? 0}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Jobs Done</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <p className="text-xl font-bold text-foreground">{rating}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Rating</p>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Meta */}
              <div className="space-y-2 text-sm">
                {sp?.city && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>{sp.city}</span>
                  </div>
                )}
                {sp?.hourlyRate && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4 shrink-0" />
                    <span>Rs {Number(sp.hourlyRate).toLocaleString()} / hr</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>Member since {memberYear}</span>
                </div>
                {sp?.isCnicVerified && (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Shield className="h-4 w-4 shrink-0" />
                    <span className="font-medium">CNIC Verified</span>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              {/* Quick links */}
              <div className="space-y-1">
                <Link
                  href="/provider/documents"
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted text-sm transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    Verification Docs
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
                <Link
                  href="/provider/portfolio"
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted text-sm transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-muted-foreground" />
                    Portfolio Photos
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right column: edit sections ─────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Personal info */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-base mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <input
                    value={user?.email ?? ''}
                    disabled
                    className="w-full px-3 py-2 rounded-lg border text-sm bg-muted text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 3XX XXXXXXX"
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                  />
                </div>
                <Button onClick={handleSavePersonal} disabled={mePending} className="w-full sm:w-auto">
                  {mePending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</> : 'Save Personal Info'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Professional info */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-base mb-4">Professional Details</h3>
              <div className="space-y-4">
                {/* Bio */}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">About You</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={500}
                    rows={4}
                    placeholder="Describe your experience, skills, and what sets you apart…"
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none bg-background"
                  />
                  <p className="text-xs text-muted-foreground text-right mt-1">{bio.length}/500</p>
                </div>

                {/* Rate + City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Hourly Rate (Rs)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rs</span>
                      <input
                        type="number"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        min={0}
                        placeholder="e.g. 1500"
                        className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">City</label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Karachi"
                      className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                    />
                  </div>
                </div>

                {/* Coverage radius */}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Coverage Radius</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={coverageRadius}
                      onChange={(e) => setCoverageRadius(e.target.value)}
                      min={0}
                      placeholder="e.g. 15"
                      className="w-full pr-12 px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">km</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum distance you're willing to travel for a job.
                  </p>
                </div>

                <Button onClick={handleSaveProfessional} disabled={profilePending} className="w-full sm:w-auto">
                  {profilePending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</> : 'Save Professional Details'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Service categories */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-base">Services You Offer</h3>
                {selectedCategories.length > 0 && (
                  <span className="text-xs text-muted-foreground">{selectedCategories.length} selected</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Select every service you can provide — customers search by category.
              </p>

              {categories.length === 0 ? (
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-24 rounded-full" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const selected = selectedCategories.includes(cat.id)
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          selected
                            ? 'bg-primary text-white border-primary'
                            : 'bg-background text-foreground border-border hover:border-primary/50 hover:bg-primary/5'
                        }`}
                      >
                        {selected && <CheckCircle2 className="h-3.5 w-3.5" />}
                        {cat.name}
                      </button>
                    )
                  })}
                </div>
              )}

              <Button
                onClick={handleSaveProfessional}
                disabled={profilePending}
                className="mt-5 w-full sm:w-auto"
              >
                {profilePending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</> : 'Save Categories'}
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
