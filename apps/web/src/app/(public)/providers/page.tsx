import { Search, Users } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'

export default function ProvidersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageHeader
        title="Find Providers"
        description="Browse verified service professionals in your city."
      />

      {/* Search */}
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search providers or services..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Provider grid — wire up API here */}
      <EmptyState
        icon={Users}
        title="No providers found"
        message="Verified providers will be listed here. Try a different search."
      />
    </div>
  )
}
