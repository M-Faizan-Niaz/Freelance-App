'use client'

import { MapPin, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'

export default function AddressesPage() {
  return (
    <div>
      <PageHeader title="My Addresses" description="Manage your saved service locations.">
        <Button size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Address
        </Button>
      </PageHeader>
      <EmptyState
        icon={MapPin}
        title="No addresses saved"
        message="Add a saved address to speed up the booking process."
      />
    </div>
  )
}
