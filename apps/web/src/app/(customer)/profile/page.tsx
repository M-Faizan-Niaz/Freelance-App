'use client'

import Link from 'next/link'
import { Camera, MapPin, ArrowRight, BookOpen, DollarSign, Calendar } from 'lucide-react'
import {
  useGetMe,
  useUpdateMe,
  useGetMyCustomerProfile,
  useListBookings,
  useListMyAddresses,
} from '@repo/api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/shared/page-header'
import { BookingCard } from '@/components/cards/booking-card'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { formatDateLong, formatCurrencyPKR } from '@/lib/format'

export default function ProfilePage() {
  const { data: meData, isLoading: meLoading, refetch } = useGetMe()
  const { data: profileData, isLoading: profileLoading } = useGetMyCustomerProfile()
  const { data: bookingsData, isLoading: bookingsLoading } = useListBookings()
  const { data: addressesData } = useListMyAddresses()

  const user = meData?.data
  const profile = profileData?.data
  const recentBookings = (bookingsData?.data ?? []).slice(0, 3)
  const addresses = (addressesData?.data ?? []).slice(0, 2)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    if (user) {
      setName(user.fullName ?? user.name ?? '')
      setPhone(user.phoneNumber ?? '')
    }
  }, [user])

  const { mutate: updateMe, isPending } = useUpdateMe({
    mutation: {
      onSuccess: () => {
        toast.success('Profile updated!')
        refetch()
      },
      onError: () => toast.error('Failed to update profile'),
    },
  })

  const isLoading = meLoading || profileLoading

  if (isLoading) {
    return (
      <div>
        <PageHeader title="My Profile" description="Manage your account." />
        <div className="space-y-6">
          <Skeleton className="h-48 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    )
  }

  const displayName = user?.fullName ?? user?.name ?? 'User'
  const initials = displayName.charAt(0).toUpperCase()
  const statusLabel = profile?.status ?? 'active'

  return (
    <div>
      <PageHeader title="My Profile" description="Manage your personal information and activity." />

      {/* ── Profile Hero ─────────────────────────────────────────────── */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <Avatar className="h-24 w-24 ring-2 ring-border">
                <AvatarImage src={user?.profilePhotoUrl ?? user?.image ?? undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full shadow"
                title="Change photo"
              >
                <Camera className="h-3 w-3" />
              </Button>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-bold truncate">{displayName}</h2>
                <Badge variant={statusLabel === 'active' ? 'default' : 'secondary'} className="capitalize">
                  {statusLabel}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{user?.email}</p>
              {profile?.createdAt && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Member since {formatDateLong(profile.createdAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold">{profile?.totalBookings ?? 0}</p>
                <p className="text-xs text-muted-foreground">Total Bookings</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold">{formatCurrencyPKR(profile?.totalSpent ?? '0')}</p>
                <p className="text-xs text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Two-column section ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Personal Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Full Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <input
                value={user?.email ?? ''}
                disabled
                className="w-full px-3 py-2 rounded-md border text-sm bg-muted text-muted-foreground cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="+92 3XX XXXXXXX"
              />
            </div>
            <Button
              className="w-full"
              onClick={() => updateMe({ data: { name, phoneNumber: phone || undefined } })}
              disabled={isPending}
            >
              {isPending ? 'Saving…' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader className="pb-3 flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Bookings</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/bookings" className="flex items-center gap-1 text-primary text-xs">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {bookingsLoading ? (
              <div className="space-y-3">
                {[1, 2].map(i => <Skeleton key={i} className="h-20 rounded-lg" />)}
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No bookings yet</p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link href="/services">Browse Services</Link>
                </Button>
              </div>
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
          </CardContent>
        </Card>
      </div>

      {/* ── Saved Addresses ──────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3 flex-row items-center justify-between">
          <CardTitle className="text-base">Saved Addresses</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/profile/addresses" className="flex items-center gap-1 text-primary text-xs">
              Manage <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {addresses.length === 0 ? (
            <div className="text-center py-6">
              <MapPin className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No saved addresses yet</p>
              <Button variant="outline" size="sm" className="mt-3" asChild>
                <Link href="/profile/addresses">Add Address</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addresses.map(addr => (
                <div
                  key={addr.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30"
                >
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{addr.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{addr.addressText}</p>
                    {addr.isDefault && (
                      <Badge variant="outline" className="mt-1 text-[10px] h-4 px-1">
                        Default
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
