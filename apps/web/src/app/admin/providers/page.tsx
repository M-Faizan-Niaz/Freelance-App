'use client'

import { Suspense } from 'react'
import { UserCheck } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { useSearchParams, useRouter } from 'next/navigation'

const tabs = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

function ProvidersContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const status = searchParams.get('status') ?? ''

  return (
    <>
      <Tabs
        value={status}
        onValueChange={v => router.push(`/admin/providers${v ? `?status=${v}` : ''}`)}
        className="mb-6"
      >
        <TabsList>
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className="text-xs">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <EmptyState
        icon={UserCheck}
        title="No providers found"
        message="Provider registrations will appear here for review."
      />
    </>
  )
}

export default function AdminProvidersPage() {
  return (
    <div>
      <PageHeader title="Service Providers" description="Review and manage provider accounts." />
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <ProvidersContent />
      </Suspense>
    </div>
  )
}
