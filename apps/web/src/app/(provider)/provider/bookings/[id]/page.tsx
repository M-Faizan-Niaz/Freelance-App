'use client'

import { useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  MapPin,
  Calendar,
  FileText,
  XCircle,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Camera,
  ChevronRight,
} from 'lucide-react'
import {
  useGetBooking,
  useListServiceCategories,
  useUpdateBookingStatus,
  useCancelBooking,
  useUploadCompletionPhoto,
  UpdateBookingStatusBodyStatus,
} from '@repo/api-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/components/shared/status-badge'
import { StatusProgress } from '@/components/booking/status-progress'
import { DetailRow } from '@/components/booking/detail-row'
import { toast } from 'sonner'

// Maps current status → next action label + status value
const NEXT_ACTION: Record<string, { label: string; status: string }> = {
  pending: { label: 'Accept Booking', status: UpdateBookingStatusBodyStatus.accepted },
  accepted: { label: "I'm On My Way", status: UpdateBookingStatusBodyStatus.travelling },
  travelling: { label: 'Mark as Arrived', status: UpdateBookingStatusBodyStatus.arrived },
  arrived: { label: 'Start Job', status: UpdateBookingStatusBodyStatus.in_progress },
  in_progress: { label: 'Mark Complete', status: UpdateBookingStatusBodyStatus.completed },
}

const CANCELLABLE_STATUSES = ['pending', 'accepted', 'travelling']
const PHOTO_UPLOAD_STATUSES = ['in_progress', 'completed']

export default function ProviderBookingDetailPage() {
  const params = useParams()
  const bookingId = Number(params.id)

  const [showCancel, setShowCancel] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: bookingData, isLoading, refetch } = useGetBooking(bookingId)
  const booking = bookingData?.data

  const { data: categoriesData } = useListServiceCategories()
  const category = categoriesData?.data?.find(c => c.id === booking?.categoryId)

  const { mutate: updateStatus, isPending: updating } = useUpdateBookingStatus({
    mutation: {
      onSuccess: () => {
        toast.success('Status updated.')
        refetch()
      },
      onError: () => toast.error('Failed to update status.'),
    },
  })

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

  const { mutate: uploadPhoto, isPending: uploading } = useUploadCompletionPhoto({
    mutation: {
      onSuccess: () => {
        toast.success('Photo uploaded.')
        if (fileInputRef.current) fileInputRef.current.value = ''
      },
      onError: () => toast.error('Failed to upload photo.'),
    },
  })

  function handleStatusUpdate(status: string) {
    updateStatus({ id: bookingId, data: { status: status as never } })
  }

  function handleCancel() {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation.')
      return
    }
    cancelBooking({ id: bookingId, data: { reason: cancelReason.trim() } })
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    uploadPhoto({ id: bookingId, data: { images: file } })
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
          <Link href="/provider/bookings">Back to My Jobs</Link>
        </Button>
      </div>
    )
  }

  const isCancelled = booking.statusName === 'cancelled'
  const isCompleted = booking.statusName === 'completed'
  const canCancel = CANCELLABLE_STATUSES.includes(booking.statusName)
  const canUploadPhoto = PHOTO_UPLOAD_STATUSES.includes(booking.statusName)
  const nextAction = NEXT_ACTION[booking.statusName]

  const scheduledDisplay = new Date(booking.scheduledAt).toLocaleString('en-PK', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="max-w-2xl mx-auto space-y-5 py-2">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/provider/bookings"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> My Jobs
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
            {booking.cancelledBy && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Cancelled by: {booking.cancelledBy}
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
              Progress
            </p>
            <StatusProgress currentStatus={booking.statusName} />
          </CardContent>
        </Card>
      )}

      {/* Booking details */}
      <Card>
        <CardContent className="p-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Job Details
          </p>
          <DetailRow
            icon={FileText}
            label="Service"
            value={category?.name ?? `Service #${booking.categoryId}`}
          />
          <DetailRow icon={Calendar} label="Scheduled" value={scheduledDisplay} />
          <DetailRow icon={MapPin} label="Customer Address" value={booking.customerAddress} />
          {booking.description && (
            <DetailRow icon={FileText} label="Notes" value={booking.description} />
          )}
          {booking.estimatedPrice && (
            <DetailRow icon={FileText} label="Estimated Price" value={`Rs. ${booking.estimatedPrice}`} />
          )}
          {isCompleted && booking.finalPrice && (
            <DetailRow icon={FileText} label="Final Price" value={`Rs. ${booking.finalPrice}`} />
          )}
          {isCompleted && booking.commissionAmount && (
            <DetailRow icon={FileText} label="Platform Commission" value={`Rs. ${booking.commissionAmount}`} />
          )}
        </CardContent>
      </Card>

      {/* Next status action */}
      {nextAction && !showCancel && (
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Next Step
            </p>
            <Button
              className="w-full"
              onClick={() => handleStatusUpdate(nextAction.status)}
              disabled={updating}
            >
              {updating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2" />
              )}
              {nextAction.label}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Cancel */}
      {canCancel && (
        <Card>
          <CardContent className="p-5 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Cancel Job
            </p>
            {showCancel ? (
              <>
                <Input
                  placeholder="Reason for cancellation…"
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
              </>
            ) : (
              <Button
                variant="outline"
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/5 border-destructive/30"
                onClick={() => setShowCancel(true)}
              >
                <XCircle className="h-4 w-4 mr-2" /> Cancel Booking
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Completion photos */}
      {canUploadPhoto && (
        <Card>
          <CardContent className="p-5 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Completion Photos
            </p>
            <p className="text-sm text-muted-foreground">
              Upload photos to document the completed work (up to 5 photos).
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Camera className="h-4 w-4 mr-2" />
              )}
              {uploading ? 'Uploading…' : 'Upload Photo'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Completed */}
      {isCompleted && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-5 flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-green-600 shrink-0" />
            <div>
              <p className="font-semibold text-green-800">Job Completed!</p>
              <p className="text-sm text-green-700 mt-0.5">
                Great work. Payment will be processed after review.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
