'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { BookOpen } from 'lucide-react'
import { useListBookings, useListServiceCategories, ListBookingsRole } from '@repo/api-client'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/shared/page-header'
import { BookingCard } from '@/components/cards/booking-card'
import { EmptyState } from '@/components/shared/empty-state'

const tabs = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

function BookingsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const status = searchParams.get('status') ?? ''

  const { data, isLoading } = useListBookings({ role: ListBookingsRole.customer })
  const { data: categoriesData } = useListServiceCategories()
  const categories = categoriesData?.data ?? []

  const allBookings = data?.data ?? []
  const bookings = status ? allBookings.filter(b => b.statusName === status) : allBookings

  function getCategoryName(id: number) {
    return categories.find(c => c.id === id)?.name ?? `Service #${id}`
  }

  function handleTabChange(value: string) {
    const params = new URLSearchParams()
    if (value) params.set('status', value)
    router.push(`/bookings?${params.toString()}`)
  }

  return (
    <>
      <Tabs value={status} onValueChange={handleTabChange} className="mb-6">
        <TabsList className="flex-wrap h-auto gap-1">
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className="text-xs">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No bookings found"
          message={
            status
              ? `No ${status.replace('_', ' ')} bookings yet.`
              : 'You have no bookings yet. Browse services to get started.'
          }
          actionLabel="Browse Services"
          actionHref="/services"
        />
      ) : (
        <div className="space-y-3">
          {bookings.map(b => (
            <BookingCard
              key={b.id}
              id={String(b.id)}
              categoryName={getCategoryName(b.categoryId)}
              scheduledAt={b.scheduledAt}
              address={b.customerAddress}
              status={b.statusName ?? 'pending'}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default function BookingsPage() {
  return (
    <div>
      <PageHeader title="My Bookings" description="View and manage all your service bookings." />
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <BookingsContent />
      </Suspense>
    </div>
  )
}
