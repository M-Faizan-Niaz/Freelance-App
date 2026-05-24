'use client'

import { Users } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'

export default function AdminCustomersPage() {
  return (
    <div>
      <PageHeader title="Customers" description="View and manage customer accounts." />
      <EmptyState icon={Users} title="No customers yet" message="Customer accounts will appear here." />
    </div>
  )
}
