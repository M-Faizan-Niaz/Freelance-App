'use client'

import { BookOpen, Users, CreditCard, UserCheck, TrendingUp, DollarSign } from 'lucide-react'
import { useGetAdminDashboard, useGetAdminAnalytics } from '@repo/api-client'
import { StatCard } from '@/components/cards/stat-card'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminDashboardPage() {
  const { data: dashData, isLoading: dashLoading } = useGetAdminDashboard()
  const { data: analyticsData, isLoading: analyticsLoading } = useGetAdminAnalytics()

  const dash = dashData?.data as Record<string, unknown> | undefined
  const analytics = analyticsData?.data as Record<string, unknown> | undefined

  return (
    <div>
      <PageHeader title="Admin Dashboard" description="Platform overview and key metrics." />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {dashLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))
        ) : (
          <>
            <StatCard
              title="Total Bookings"
              value={String(dash?.totalBookings ?? '—')}
              icon={BookOpen}
              trend={dash?.bookingsTrend as { value: number; label: string } | undefined}
            />
            <StatCard
              title="Total Revenue"
              value={dash?.totalRevenue ? `PKR ${Number(dash.totalRevenue).toLocaleString()}` : '—'}
              icon={DollarSign}
            />
            <StatCard
              title="Active Providers"
              value={String(dash?.activeProviders ?? '—')}
              icon={UserCheck}
            />
            <StatCard
              title="Total Customers"
              value={String(dash?.totalCustomers ?? '—')}
              icon={Users}
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Bookings Over Time
            </h3>
            {analyticsLoading ? (
              <Skeleton className="h-48 rounded-lg" />
            ) : (
              <div className="h-48 bg-muted rounded-lg flex items-center justify-center text-sm text-muted-foreground">
                {analytics ? 'Connect recharts to render chart data' : 'No analytics data'}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" /> Revenue Trend
            </h3>
            {analyticsLoading ? (
              <Skeleton className="h-48 rounded-lg" />
            ) : (
              <div className="h-48 bg-muted rounded-lg flex items-center justify-center text-sm text-muted-foreground">
                {analytics ? 'Connect recharts to render chart data' : 'No analytics data'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
