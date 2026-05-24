'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useListServiceCategories } from '@repo/api-client'
import { ServiceCategoryCard } from '@/components/cards/service-category-card'
import { PageHeader } from '@/components/shared/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/shared/empty-state'

function ServicesContent() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q')?.toLowerCase() ?? ''

  const { data, isLoading } = useListServiceCategories()
  const all = data?.data?.filter(c => c.isActive) ?? []
  const categories = q ? all.filter(c => c.name.toLowerCase().includes(q)) : all

  return (
    <>
      {/* Search */}
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          defaultValue={q}
          placeholder="Search services..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
          onChange={e => {
            const url = new URL(window.location.href)
            if (e.target.value) url.searchParams.set('q', e.target.value)
            else url.searchParams.delete('q')
            window.history.replaceState({}, '', url.toString())
          }}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No services found"
          message={q ? `No services match "${q}". Try a different keyword.` : 'No active services yet.'}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <ServiceCategoryCard
              key={cat.id}
              id={String(cat.id)}
              name={cat.name}
              imageUrl={cat.imageUrl}
              description={cat.description}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default function ServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageHeader
        title="Browse Services"
        description="Find verified professionals for any home service need."
      />
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <ServicesContent />
      </Suspense>
    </div>
  )
}
