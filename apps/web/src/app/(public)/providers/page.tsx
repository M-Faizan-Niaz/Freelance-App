'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, Star, Briefcase, CheckCircle2 } from 'lucide-react'
import { useListServiceProviders } from '@repo/api-client'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Users } from 'lucide-react'

export default function ProvidersPage() {
  const [search, setSearch] = useState('')

  const { data, isLoading } = useListServiceProviders()
  const allProviders = data?.data ?? []

  const providers = allProviders.filter(p =>
    !search.trim() ||
    p.fullName.toLowerCase().includes(search.toLowerCase()) ||
    (p.city ?? '').toLowerCase().includes(search.toLowerCase()),
  )

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
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or city…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="rounded-xl border bg-white p-5 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : providers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No providers found"
          message={search ? 'Try a different name or city.' : 'No verified providers yet.'}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map(p => {
            const rating = p.averageRating ? parseFloat(p.averageRating) : null
            return (
              <div key={p.id} className="rounded-xl border bg-white p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary shrink-0">
                    {p.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{p.fullName}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <Badge variant="secondary" className="text-xs">{p.tierName}</Badge>
                      {p.isCnicVerified && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      )}
                      <span className={`w-2 h-2 rounded-full ${p.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                  {rating !== null && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      {rating.toFixed(1)}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" />
                    {p.totalJobsCompleted} jobs
                  </span>
                  {p.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {p.city}
                    </span>
                  )}
                  <span className="ml-auto font-medium text-foreground">
                    Rs. {p.hourlyRate}/hr
                  </span>
                </div>

                <Button asChild variant="outline" size="sm" className="w-full mt-auto">
                  <Link href={`/providers/${p.id}`}>View Profile</Link>
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
