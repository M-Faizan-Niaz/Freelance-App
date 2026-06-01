'use client'

import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { CreditCard, ChevronRight } from 'lucide-react'
import { useListPayments } from '@repo/api-client'
import type { ListPayments200DataItem } from '@repo/api-client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'

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

export default function PaymentsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeKey = searchParams.get('status') ?? 'all'
  const tab = TABS.find(t => t.key === activeKey) ?? TABS[0]

  const { data, isLoading } = useListPayments(tab.statusId ? { statusId: tab.statusId } : undefined)
  const payments: ListPayments200DataItem[] = (data?.data ?? []) as ListPayments200DataItem[]

  return (
    <div className="max-w-2xl mx-auto space-y-5 py-2">
      <PageHeader title="My Payments" description="Track all your payment submissions." />

      <div className="flex gap-2 flex-wrap">
        {TABS.map(t => (
          <Button
            key={t.key}
            size="sm"
            variant={activeKey === t.key ? 'default' : 'outline'}
            onClick={() =>
              router.push(t.key === 'all' ? '/payments' : `/payments?status=${t.key}`)
            }
          >
            {t.label}
          </Button>
        ))}
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      )}

      {!isLoading && payments.length === 0 && (
        <EmptyState
          icon={CreditCard}
          title="No payments"
          message="Your payment submissions will appear here."
        />
      )}

      {!isLoading && payments.length > 0 && (
        <div className="space-y-3">
          {payments.map(p => (
            <Link key={p.id} href={`/payments/${p.id}`}>
              <Card className="hover:bg-muted/40 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CreditCard className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm">Rs. {p.amount}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.paymentMethodName} · Booking #{p.bookingId}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(p.createdAt).toLocaleDateString('en-PK', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <PaymentStatusBadge status={p.paymentStatusName} />
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
