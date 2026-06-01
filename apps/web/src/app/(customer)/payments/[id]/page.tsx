'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  CreditCard,
  Hash,
  Calendar,
  FileText,
  BookOpen,
  AlertTriangle,
  Clock,
} from 'lucide-react'
import { useGetPayment } from '@repo/api-client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { DetailRow } from '@/components/booking/detail-row'

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending Review', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  held: { label: 'Held', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  completed: { label: 'Approved', className: 'bg-green-100 text-green-800 border-green-200' },
  refunded: { label: 'Refunded', className: 'bg-purple-100 text-purple-800 border-purple-200' },
  failed: { label: 'Rejected', className: 'bg-red-100 text-red-800 border-red-200' },
}

function PaymentStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  }
  return (
    <Badge variant="outline" className={`font-medium ${config.className}`}>
      {config.label}
    </Badge>
  )
}

export default function PaymentDetailPage() {
  const params = useParams()
  const paymentId = Number(params.id)

  const { data, isLoading } = useGetPayment(paymentId)
  const payment = data?.data

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto space-y-4 py-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center">
        <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="font-semibold">Payment not found</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/payments">Back to Payments</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-5 py-2">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/payments"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> My Payments
        </Link>
        <PaymentStatusBadge status={payment.paymentStatusName} />
      </div>

      {payment.paymentStatusName === 'failed' && payment.rejectionReason && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-destructive text-sm">Payment Rejected</p>
            <p className="text-sm text-muted-foreground mt-0.5">{payment.rejectionReason}</p>
          </div>
        </div>
      )}

      <Card>
        <CardContent className="p-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Payment Details
          </p>
          <DetailRow icon={Hash} label="Payment ID" value={`#${payment.id}`} />
          <DetailRow icon={BookOpen} label="Booking" value={`#${payment.bookingId}`} />
          <DetailRow icon={CreditCard} label="Amount" value={`Rs. ${payment.amount}`} />
          <DetailRow icon={CreditCard} label="Method" value={payment.paymentMethodName} />
          <DetailRow
            icon={Calendar}
            label="Submitted"
            value={new Date(payment.createdAt).toLocaleString('en-PK', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          />
          {payment.transactionReference && (
            <DetailRow icon={Hash} label="Transaction Ref" value={payment.transactionReference} />
          )}
          {payment.notes && (
            <DetailRow icon={FileText} label="Notes" value={payment.notes} />
          )}
          {payment.reviewedAt && (
            <DetailRow
              icon={Clock}
              label="Reviewed"
              value={new Date(payment.reviewedAt).toLocaleString('en-PK', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            />
          )}
        </CardContent>
      </Card>

      {payment.proofImageUrl && (
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Payment Proof
            </p>
            <a href={payment.proofImageUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={payment.proofImageUrl}
                alt="Payment proof"
                className="rounded-lg border w-full object-cover max-h-80 hover:opacity-90 transition-opacity"
              />
              <p className="text-xs text-muted-foreground mt-1.5 text-center">
                Click to view full image
              </p>
            </a>
          </CardContent>
        </Card>
      )}

      <Button asChild variant="outline" className="w-full">
        <Link href={`/bookings/${payment.bookingId}`}>
          View Booking #{payment.bookingId}
        </Link>
      </Button>
    </div>
  )
}
