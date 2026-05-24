'use client'

import { MessageSquare } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'

export default function MessagesPage() {
  return (
    <div>
      <PageHeader title="Messages" description="Your conversations with service providers." />
      <EmptyState
        icon={MessageSquare}
        title="No conversations yet"
        message="Start a conversation by booking a service and contacting your provider."
        actionLabel="Browse Services"
        actionHref="/services"
      />
    </div>
  )
}
