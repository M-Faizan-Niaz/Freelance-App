'use client'

import { Wallet } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'

export default function AdminPayoutsPage() {
  return (
    <div>
      <PageHeader title="Payout Requests" description="Approve provider payout requests." />
      <EmptyState icon={Wallet} title="No payout requests" message="Provider payout requests will appear here." />
    </div>
  )
}
