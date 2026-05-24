'use client'

import Link from 'next/link'
import { BookOpen, MessageSquare, Plus, ArrowRight, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/shared/page-header'
import { BookingCard } from '@/components/cards/booking-card'
import { EmptyState } from '@/components/shared/empty-state'
import { useListBookings, useGetMe } from '@repo/api-client'

export default function CustomerDashboardPage() {
  const { data: meData } = useGetMe()
  const user = meData?.data
  const firstName = user?.fullName?.split(' ')[0] ?? user?.name?.split(' ')[0] ?? 'there'

  const { data: bookingsData, isLoading } = useListBookings()
  const allBookings = bookingsData?.data ?? []

  const totalBookings = allBookings.length
  const activeBookings = allBookings.filter(b =>
    ['pending', 'confirmed', 'in_progress'].includes(b.statusName ?? ''),
  ).length
  const completedBookings = allBookings.filter(b => b.statusName === 'completed').length
  const recentBookings = allBookings.slice(0, 3)

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${firstName} 👋`}
        description="Here's what's happening with your bookings today."
      >
        <Button asChild>
          <Link href="/services" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Book a Service
          </Link>
        </Button>
      </PageHeader>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: 'Total Bookings',
            value: isLoading ? '—' : totalBookings,
            icon: BookOpen,
            href: '/bookings',
          },
          {
            label: 'Active Bookings',
            value: isLoading ? '—' : activeBookings,
            icon: Clock,
            href: '/bookings?status=confirmed',
          },
          {
            label: 'Completed',
            value: isLoading ? '—' : completedBookings,
            icon: CheckCircle,
            href: '/bookings?status=completed',
          },
        ].map(item => (
          <Link key={item.label} href={item.href}>
            <Card className="hover:shadow-sm transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-base">Recent Bookings</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/bookings" className="flex items-center gap-1 text-primary">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        ) : recentBookings.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No bookings yet"
            message="Browse our services and book your first appointment."
            actionLabel="Browse Services"
            actionHref="/services"
          />
        ) : (
          <div className="space-y-3">
            {recentBookings.map(b => (
              <BookingCard
                key={b.id}
                id={String(b.id)}
                categoryName={b.categoryId ? `Service #${b.categoryId}` : 'Service'}
                scheduledAt={b.scheduledAt}
                address={b.customerAddress}
                status={b.statusName ?? 'pending'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-semibold text-base mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Browse Services', href: '/services', icon: Plus },
            { label: 'My Bookings', href: '/bookings', icon: BookOpen },
            { label: 'Messages', href: '/messages', icon: MessageSquare },
          ].map(action => (
            <Button key={action.label} variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href={action.href}>
                <action.icon className="h-5 w-5" />
                <span className="text-xs">{action.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
