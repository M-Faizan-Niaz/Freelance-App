'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  MapPin,
  Star,
  User,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import {
  useListServiceCategories,
  useListServiceProviders,
  useCreateBooking,
  type ListServiceProviders200DataItem,
} from '@repo/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

// ─── Types ────────────────────────────────────────────────────────────────────

type Provider = ListServiceProviders200DataItem

interface BookingForm {
  scheduledDate: string
  scheduledTime: string
  customerAddress: string
  description: string
}

// ─── Step indicators ──────────────────────────────────────────────────────────

const STEPS = ['Details', 'Provider', 'Confirm']

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
              <div className={`h-px w-10 sm:w-16 ${done ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Provider Card ─────────────────────────────────────────────────────────────

function ProviderCard({
  provider,
  selected,
  onSelect,
}: {
  provider: Provider
  selected: boolean
  onSelect: () => void
}) {
  const rating = provider.averageRating ? parseFloat(provider.averageRating) : null

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 ${
        selected ? 'border-primary shadow-md ring-1 ring-primary' : 'hover:border-primary/50 hover:shadow-sm'
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-sm truncate">{provider.fullName}</p>
              {provider.isOnline && (
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" title="Online" />
              )}
            </div>
            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
              {rating !== null && (
                <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {rating.toFixed(1)}
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                {provider.totalJobsCompleted} jobs
              </span>
              {provider.city && (
                <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                  <MapPin className="h-3 w-3" />
                  {provider.city}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {provider.tierName}
              </Badge>
              <span className="text-sm font-semibold text-primary">
                Rs. {provider.hourlyRate}/hr
              </span>
            </div>
          </div>
        </div>

        <Button
          size="sm"
          variant={selected ? 'default' : 'outline'}
          className="w-full mt-3"
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          {selected ? 'Selected' : 'Select'}
        </Button>
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewBookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryId = Number(searchParams.get('categoryId')) || undefined

  const [step, setStep] = useState(0)
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [form, setForm] = useState<BookingForm>({
    scheduledDate: '',
    scheduledTime: '',
    customerAddress: '',
    description: '',
  })

  // Data
  const { data: categoriesData } = useListServiceCategories()
  const category = categoriesData?.data?.find((c) => c.id === categoryId)

  const { data: providersData, isLoading: providersLoading } = useListServiceProviders(
    { page: 1, limit: 50 },
    { query: { enabled: step === 1 } },
  )
  const providers: Provider[] = providersData?.data ?? []

  const { mutate: createBooking, isPending } = useCreateBooking({
    mutation: {
      onSuccess: (res) => {
        toast.success('Booking confirmed!')
        router.push(`/bookings/${res.data.id}`)
      },
      onError: () => {
        toast.error('Failed to create booking. Please try again.')
      },
    },
  })

  // ── Step 0 helpers ──────────────────────────────────────────────────────────

  function step0Valid() {
    return form.scheduledDate && form.scheduledTime && form.customerAddress.trim().length > 0
  }

  function handleStep0Next() {
    if (!step0Valid()) {
      toast.error('Please fill in date, time, and address.')
      return
    }
    setStep(1)
  }

  // ── Step 2 submit ───────────────────────────────────────────────────────────

  function handleConfirm() {
    if (!selectedProvider || !categoryId) return
    const scheduledAt = new Date(`${form.scheduledDate}T${form.scheduledTime}`).toISOString()
    createBooking({
      data: {
        providerId: selectedProvider.id,
        categoryId,
        scheduledAt,
        customerAddress: form.customerAddress.trim(),
        description: form.description.trim() || undefined,
      },
    })
  }

  // ── Scheduled datetime display ──────────────────────────────────────────────

  const scheduledDisplay =
    form.scheduledDate && form.scheduledTime
      ? new Date(`${form.scheduledDate}T${form.scheduledTime}`).toLocaleString('en-PK', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '—'

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => (step === 0 ? router.back() : setStep(step - 1))}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-2xl font-bold">
          {category ? `Book ${category.name}` : 'Book a Service'}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {step === 0 && 'Tell us what you need and when.'}
          {step === 1 && 'Choose a verified professional for the job.'}
          {step === 2 && 'Review your booking and confirm.'}
        </p>
      </div>

      <StepBar current={step} />

      {/* ── Step 0: Details ─────────────────────────────────────────────────── */}
      {step === 0 && (
        <div className="space-y-5">
          {category && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <span className="text-sm font-medium text-primary">{category.name}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground" /> Date
              </label>
              <Input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={form.scheduledDate}
                onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground" /> Time
              </label>
              <Input
                type="time"
                value={form.scheduledTime}
                onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-muted-foreground" /> Service Address
            </label>
            <Input
              placeholder="House 12, Street 5, DHA Phase 2, Karachi"
              value={form.customerAddress}
              onChange={(e) => setForm({ ...form, customerAddress: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Additional Notes (optional)</label>
            <textarea
              className="w-full min-h-[90px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              placeholder="Describe any specific requirements, e.g. brand of unit, floor number, access notes…"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <Button className="w-full" size="lg" onClick={handleStep0Next}>
            Next — Choose Provider <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {/* ── Step 1: Provider ────────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-4">
          {providersLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-11 h-11 rounded-full" />
                      <div className="space-y-1.5 flex-1">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-full rounded-md" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : providers.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <User className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No providers available right now</p>
              <p className="text-sm mt-1">Please try again later or browse all services.</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/services">Browse Services</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {providers.map((p) => (
                  <ProviderCard
                    key={p.id}
                    provider={p}
                    selected={selectedProvider?.id === p.id}
                    onSelect={() => setSelectedProvider(p)}
                  />
                ))}
              </div>
              <Button
                className="w-full"
                size="lg"
                disabled={!selectedProvider}
                onClick={() => setStep(2)}
              >
                Next — Review Booking <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </>
          )}
        </div>
      )}

      {/* ── Step 2: Confirm ─────────────────────────────────────────────────── */}
      {step === 2 && selectedProvider && (
        <div className="space-y-5">
          <Card>
            <CardContent className="p-5 divide-y divide-border space-y-0">
              <SummaryRow label="Service" value={category?.name ?? `Category #${categoryId}`} />
              <SummaryRow label="Provider" value={selectedProvider.fullName} />
              <SummaryRow label="Hourly Rate" value={`Rs. ${selectedProvider.hourlyRate}/hr`} />
              <SummaryRow label="Scheduled" value={scheduledDisplay} />
              <SummaryRow label="Address" value={form.customerAddress} />
              {form.description && <SummaryRow label="Notes" value={form.description} />}
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground text-center px-4">
            Payment is held securely in escrow and released only after you confirm the job is done.
          </p>

          <Button
            className="w-full"
            size="lg"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Confirming…
              </>
            ) : (
              'Confirm Booking'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  )
}
