'use client'

import { BookOpen } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'

export default function AdminBookingsPage() {
  return (
    <div>
      <PageHeader title="All Bookings" description="Monitor and manage all platform bookings." />
      <EmptyState icon={BookOpen} title="No bookings" message="All bookings across the platform will appear here." />
    </div>
  )
}
