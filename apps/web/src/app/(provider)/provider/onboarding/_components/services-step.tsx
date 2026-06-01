'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  useListServiceCategories,
  useUpdateMyProviderProfile,
  type ListServiceCategories200DataItem,
} from '@repo/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { getApiError } from '@/lib/error'

interface ServicesStepProps {
  onNext: () => void
}

export function ServicesStep({ onNext }: ServicesStepProps) {
  const [bio, setBio] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [city, setCity] = useState('')
  const [coverageRadius, setCoverageRadius] = useState('')
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])

  const { data: categoriesData, isLoading: categoriesLoading } = useListServiceCategories()
  const categories: ListServiceCategories200DataItem[] = (categoriesData?.data ?? []).filter(
    (c) => c.isActive,
  )

  const { mutate: updateProfile, isPending } = useUpdateMyProviderProfile({
    mutation: {
      onSuccess: () => {
        toast.success('Services saved')
        onNext()
      },
      onError: (error) => toast.error(getApiError(error, 'Failed to save services')),
    },
  })

  function toggleCategory(id: number) {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  function handleNext() {
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

  return (
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

      <Button className="w-full" size="lg" onClick={handleNext} disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
        {isPending ? 'Saving…' : 'Next — Upload Documents'}
      </Button>
    </div>
  )
}
