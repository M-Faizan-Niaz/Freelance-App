'use client'

import { Tag, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'

export default function AdminCategoriesPage() {
  return (
    <div>
      <PageHeader title="Service Categories" description="Manage the service categories available on the platform.">
        <Button size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </PageHeader>
      <EmptyState icon={Tag} title="No categories" message="Add service categories to let providers list their services." />
    </div>
  )
}
