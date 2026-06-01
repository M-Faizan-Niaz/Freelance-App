'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  MapPin,
  Calendar,
  FileText,
  User,
  Star,
  XCircle,
  Clock,
  CheckCircle2,
  Loader2,
  AlertTriangle,
} from 'lucide-react'
import {
  useGetBooking,
  useGetServiceProviderById,
  useListServiceCategories,
  useCancelBooking,
  useRescheduleBooking,
} from '@repo/api-client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/components/shared/status-badge'
import { StatusProgress } from '@/components/booking/status-progress'
import { DetailRow } from '@/components/booking/detail-row'
import { toast } from 'sonner'

const CANCELLABLE_STATUSES = ['pending', 'accepted', 'travelling']

export default function BookingDetailPage() {
  const params = useParams()
  const bookingId = Number(params.id)

  const [showCancel, setShowCancel] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [showReschedule, setShowReschedule] = useState(false)
  const [newDatetime, setNewDatetime] = useState('')

  const { data: bookingData, isLoading, refetch } = useGetBooking(bookingId)
  const booking = bookingData?.data

  const { data: providerData } = useGetServiceProviderById(booking?.providerId ?? null, {
    query: { enabled: !!booking?.providerId },
  })
  const provider = providerData?.data

  const { data: categoriesData } = useListServiceCategories()
  const category = categoriesData?.data?.find(c => c.id === booking?.categoryId)

  const { mutate: cancelBooking, isPending: cancelling } = useCancelBooking({
    mutation: {
      onSuccess: () => {
        toast.success('Booking cancelled.')
        setShowCancel(false)
        setCancelReason('')
        refetch()
      },
      onError: () => toast.error('Failed to cancel booking.'),
    },
  })

  const { mutate: rescheduleBooking, isPending: rescheduling } = useRescheduleBooking({
    mutation: {
      onSuccess: () => {
        toast.success('Booking rescheduled.')
        setShowReschedule(false)
        setNewDatetime('')
        refetch()
      },
      onError: () => toast.error('Failed to reschedule booking.'),
    },
  })

  function handleCancel() {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation.')
      return
    }
    cancelBooking({ id: bookingId, data: { reason: cancelReason.trim() } })
  }

  function handleReschedule() {
    if (!newDatetime) {
      toast.error('Please pick a new date and time.')
      return
    }
    rescheduleBooking({ id: bookingId, data: { scheduledAt: new Date(newDatetime).toISOString() } })
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 py-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="font-semibold text-lg">Booking not found</p>
        <p className="text-muted-foreground text-sm mt-1">This booking may have been removed.</p>
        <Button asChild className="mt-6" variant="outline">
          <Link href="/bookings">Back to My Bookings</Link>
        </Button>
      </div>
    )
  }

  const isCancelled = booking.statusName === 'cancelled'
  const isPending = booking.statusName === 'pending'
  const isCompleted = booking.statusName === 'completed'
  const canCancel = CANCELLABLE_STATUSES.includes(booking.statusName)

  const scheduledDisplay = new Date(booking.scheduledAt).toLocaleString('en-PK', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const providerRating = provider?.averageRating ? parseFloat(provider.averageRating) : null

  return (
    <div className="max-w-2xl mx-auto space-y-5 py-2">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/bookings"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> My Bookings
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">#{booking.id}</span>
          <StatusBadge status={booking.statusName} />
        </div>
      </div>

      {/* Cancelled banner */}
      {isCancelled && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-destructive text-sm">Booking Cancelled</p>
            {booking.cancellationReason && (
              <p className="text-sm text-muted-foreground mt-0.5">
                Reason: {booking.cancellationReason}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Status progress */}
      {!isCancelled && (
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              Status
            </p>
            <StatusProgress currentStatus={booking.statusName} />
          </CardContent>
        </Card>
      )}

      {/* Booking details */}
      <Card>
        <CardContent className="p-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Booking Details
          </p>
          <DetailRow
            icon={FileText}
            label="Service"
            value={category?.name ?? `Service #${booking.categoryId}`}
          />
          <DetailRow icon={Calendar} label="Scheduled" value={scheduledDisplay} />
          <DetailRow icon={MapPin} label="Address" value={booking.customerAddress} />
          {booking.description && (
            <DetailRow icon={FileText} label="Notes" value={booking.description} />
          )}
          {booking.estimatedPrice && (
            <DetailRow icon={FileText} label="Estimated Price" value={`Rs. ${booking.estimatedPrice}`} />
          )}
          {isCompleted && booking.finalPrice && (
            <DetailRow icon={FileText} label="Final Price" value={`Rs. ${booking.finalPrice}`} />
          )}
        </CardContent>
      </Card>

      {/* Provider card */}
      {provider && (
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Your Provider
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{provider.fullName}</p>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  {providerRating !== null && (
                    <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {providerRating.toFixed(1)}
                    </span>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {provider.tierName}
                  </Badge>
                  {provider.city && (
                    <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {provider.city}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span
                  className={`w-2 h-2 rounded-full ${provider.isOnline ? 'bg-green-500' : 'bg-muted-foreground'}`}
                />
                <span className="text-xs text-muted-foreground">
                  {provider.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions — reschedule (pending only) + cancel (pending/accepted/travelling) */}
      {(isPending || canCancel) && (
        <Card>
          <CardContent className="p-5 space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Actions
            </p>

            {/* Reschedule — pending only */}
            {isPending && !showCancel && (
              <>
                {showReschedule ? (
                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-muted-foreground" /> New Date & Time
                    </label>
                    <Input
                      type="datetime-local"
                      min={new Date().toISOString().slice(0, 16)}
                      value={newDatetime}
                      onChange={e => setNewDatetime(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleReschedule} disabled={rescheduling}>
                        {rescheduling && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                        Confirm Reschedule
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { setShowReschedule(false); setNewDatetime('') }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => setShowReschedule(true)}>
                    <Clock className="h-4 w-4 mr-2" /> Reschedule
                  </Button>
                )}
              </>
            )}

            {/* Cancel — pending/accepted/travelling */}
            {canCancel && !showReschedule && (
              <>
                {showCancel ? (
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Reason for cancellation</label>
                    <Input
                      placeholder="e.g. Plans changed, need to reschedule…"
                      value={cancelReason}
                      onChange={e => setCancelReason(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleCancel}
                        disabled={cancelling}
                      >
                        {cancelling && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                        Confirm Cancellation
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { setShowCancel(false); setCancelReason('') }}
                      >
                        Back
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full text-destructive hover:text-destructive hover:bg-destructive/5 border-destructive/30"
                    onClick={() => setShowCancel(true)}
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Cancel Booking
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Completed */}
      {isCompleted && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-5 flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-green-600 shrink-0" />
            <div>
              <p className="font-semibold text-green-800">Job Done!</p>
              <p className="text-sm text-green-700 mt-0.5">
                Thanks for using ServeEase.{' '}
                <span className="underline underline-offset-4 cursor-not-allowed opacity-60">
                  Leave a review
                </span>{' '}
                <span className="text-xs">(coming soon)</span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
