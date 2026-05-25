'use client'

import Link from 'next/link'
import { BookOpen, Star, Wallet, Clock, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/shared/page-header'
import { BookingCard } from '@/components/cards/booking-card'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { useListBookings, useGetMe, useGetMyProviderProfile } from '@repo/api-client'

export default function ProviderDashboardPage() {
  const { data: meData } = useGetMe()
  const firstName = meData?.data?.fullName?.split(' ')[0] ?? 'there'

  const { data: profileData } = useGetMyProviderProfile()
  const isIncomplete = profileData?.data !== undefined && profileData.data.bio === null

  const { data: bookingsData, isLoading } = useListBookings()
  const allBookings = bookingsData?.data ?? []

  const today = new Date().toDateString()
  const todayJobs = allBookings.filter(
    b => new Date(b.scheduledAt).toDateString() === today,
  )
  const totalJobs = allBookings.length
  const completedJobs = allBookings.filter(b => b.statusName === 'completed').length
  const pendingJobs = allBookings.filter(b => b.statusName === 'pending')

  return (
    <div>
      <PageHeader
        title="Provider Dashboard"
        description={`Welcome back, ${firstName}. Here's your activity today.`}
      />

      {/* Profile incomplete banner */}
      {isIncomplete && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="font-medium text-amber-800 text-sm">Your profile is incomplete</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Complete your profile to appear in search results and start receiving bookings.
            </p>
          </div>
          <Button asChild size="sm" className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white">
            <Link href="/provider/onboarding">Complete Profile →</Link>
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Today's Jobs", value: isLoading ? '—' : todayJobs.length, icon: Clock },
          { label: 'Total Jobs', value: isLoading ? '—' : totalJobs, icon: BookOpen },
          { label: 'Completed', value: isLoading ? '—' : completedJobs, icon: Star },
          { label: 'Pending', value: isLoading ? '—' : pendingJobs.length, icon: Wallet },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's jobs */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-base">Today&apos;s Jobs</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/provider/bookings" className="flex items-center gap-1 text-primary">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        ) : todayJobs.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No jobs today"
            message="You have no bookings scheduled for today."
          />
        ) : (
          <div className="space-y-3">
            {todayJobs.map(b => (
              <BookingCard
                key={b.id}
                id={String(b.id)}
                categoryName={`Job #${b.id}`}
                scheduledAt={b.scheduledAt}
                address={b.customerAddress}
                status={b.statusName ?? 'pending'}
                href={`/provider/bookings/${b.id}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pending actions */}
      {pendingJobs.length > 0 && (
        <div>
          <h2 className="font-semibold text-base mb-4">Awaiting Your Response</h2>
          <div className="space-y-3">
            {pendingJobs.slice(0, 3).map(b => (
              <BookingCard
                key={b.id}
                id={String(b.id)}
                categoryName={`Job #${b.id}`}
                scheduledAt={b.scheduledAt}
                address={b.customerAddress}
                status={b.statusName ?? 'pending'}
                href={`/provider/bookings/${b.id}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
