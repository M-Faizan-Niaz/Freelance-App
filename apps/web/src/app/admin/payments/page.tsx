'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CreditCard, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { useGetAdminPayments, useApprovePayment, useRejectPayment } from '@repo/api-client'
import type { GetAdminPayments200DataItem } from '@repo/api-client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { toast } from 'sonner'

const TABS = [
  { label: 'All', key: 'all', statusId: undefined },
  { label: 'Pending', key: 'pending', statusId: 1 },
  { label: 'Completed', key: 'completed', statusId: 3 },
  { label: 'Failed', key: 'failed', statusId: 5 },
]

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  held: { label: 'Held', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-800 border-green-200' },
  refunded: { label: 'Refunded', className: 'bg-purple-100 text-purple-800 border-purple-200' },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-800 border-red-200' },
}

function PaymentStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  }
  return (
    <Badge variant="outline" className={`font-medium capitalize ${config.className}`}>
      {config.label}
    </Badge>
  )
}

export default function AdminPaymentsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeKey = searchParams.get('status') ?? 'all'
  const tab = TABS.find(t => t.key === activeKey) ?? TABS[0]

  const [approveId, setApproveId] = useState<number | null>(null)
  const [rejectTarget, setRejectTarget] = useState<{
    id: number
    amount: string
  } | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const { data, isLoading, refetch } = useGetAdminPayments(
    tab.statusId ? { statusId: tab.statusId } : undefined,
  )
  const payments: GetAdminPayments200DataItem[] = (data?.data ?? []) as GetAdminPayments200DataItem[]

  const { mutate: approve, isPending: approving } = useApprovePayment({
    mutation: {
      onSuccess: () => {
        toast.success('Payment approved.')
        setApproveId(null)
        refetch()
      },
      onError: () => toast.error('Failed to approve payment.'),
    },
  })

  const { mutate: reject, isPending: rejecting } = useRejectPayment({
    mutation: {
      onSuccess: () => {
        toast.success('Payment rejected.')
        setRejectTarget(null)
        setRejectReason('')
        refetch()
      },
      onError: () => toast.error('Failed to reject payment.'),
    },
  })

  return (
    <div className="space-y-5">
      <PageHeader title="Payments" description="Review and approve payment submissions." />

      <div className="flex gap-2 flex-wrap">
        {TABS.map(t => (
          <Button
            key={t.key}
            size="sm"
            variant={activeKey === t.key ? 'default' : 'outline'}
            onClick={() =>
              router.push(
                t.key === 'all' ? '/admin/payments' : `/admin/payments?status=${t.key}`,
              )
            }
          >
            {t.label}
          </Button>
        ))}
      </div>

      {isLoading && (
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      )}

      {!isLoading && payments.length === 0 && (
        <EmptyState
          icon={CreditCard}
          title="No payments"
          message="Payment submissions will appear here for review."
        />
      )}

      {!isLoading && payments.length > 0 && (
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Booking</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-sm">#{p.id}</TableCell>
                  <TableCell className="text-sm">{p.customerName}</TableCell>
                  <TableCell className="text-sm">#{p.bookingId}</TableCell>
                  <TableCell className="text-sm font-medium">Rs. {p.amount}</TableCell>
                  <TableCell className="text-sm capitalize">{p.paymentMethodName}</TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={p.paymentStatusName} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(p.createdAt).toLocaleDateString('en-PK', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {p.paymentStatusName === 'pending' && (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-700 border-green-300 hover:bg-green-50"
                          onClick={() => setApproveId(p.id)}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive border-destructive/30 hover:bg-destructive/5"
                          onClick={() => setRejectTarget({ id: p.id, amount: p.amount })}
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Approve confirm dialog */}
      <Dialog open={approveId !== null} onOpenChange={open => !open && setApproveId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Payment</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to approve payment <strong>#{approveId}</strong>? This cannot be
            undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveId(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => approveId !== null && approve({ id: approveId })}
              disabled={approving}
            >
              {approving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject dialog */}
      <Dialog
        open={rejectTarget !== null}
        onOpenChange={open => {
          if (!open) {
            setRejectTarget(null)
            setRejectReason('')
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Payment</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-2">
            Provide a reason for rejecting payment <strong>#{rejectTarget?.id}</strong> (Rs.{' '}
            {rejectTarget?.amount}).
          </p>
          <Textarea
            placeholder="e.g. Screenshot is unclear, amount mismatch, invalid reference…"
            rows={4}
            maxLength={1000}
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectTarget(null)
                setRejectReason('')
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!rejectReason.trim() || rejecting}
              onClick={() =>
                rejectTarget !== null &&
                reject({ id: rejectTarget.id, data: { rejectionReason: rejectReason.trim() } })
              }
            >
              {rejecting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
