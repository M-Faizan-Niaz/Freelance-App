'use client'

import { CreditCard } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'

export default function AdminPaymentsPage() {
  return (
    <div>
      <PageHeader title="Payments" description="Review and approve payment submissions." />
      <EmptyState icon={CreditCard} title="No payments" message="Payment submissions will appear here for review." />
    </div>
  )
}
