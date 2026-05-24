'use client'

import { ShieldAlert } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'

export default function AdminFraudPage() {
  return (
    <div>
      <PageHeader title="Fraud Flags" description="Review and act on flagged accounts." />
      <EmptyState icon={ShieldAlert} title="No fraud flags" message="Flagged accounts will appear here for investigation." />
    </div>
  )
}
