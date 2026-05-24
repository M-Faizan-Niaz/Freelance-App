'use client'

import { Suspense } from 'react'
import { BookOpen } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { useSearchParams, useRouter } from 'next/navigation'

const tabs = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

function BookingsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const status = searchParams.get('status') ?? ''

  return (
    <>
      <Tabs
        value={status}
        onValueChange={v => router.push(`/provider/bookings${v ? `?status=${v}` : ''}`)}
        className="mb-6"
      >
        <TabsList className="flex-wrap h-auto gap-1">
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className="text-xs">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <EmptyState
        icon={BookOpen}
        title="No jobs found"
        message="New booking requests will appear here once customers start booking you."
      />
    </>
  )
}

export default function ProviderBookingsPage() {
  return (
    <div>
      <PageHeader title="My Jobs" description="Manage all your service jobs." />
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <BookingsContent />
      </Suspense>
    </div>
  )
}
