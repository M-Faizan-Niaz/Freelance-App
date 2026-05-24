'use client'

import { Camera } from 'lucide-react'
import { useGetMe, useUpdateMe } from '@repo/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/shared/page-header'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'

export default function ProfilePage() {
  const { data: meData, isLoading, refetch } = useGetMe()
  const user = meData?.data

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

  function handleSave() {
    updateMe({ data: { name, phoneNumber: phone || undefined } })
  }

  if (isLoading) {
    return (
      <div>
        <PageHeader title="My Profile" description="Manage your personal information." />
        <div className="max-w-xl space-y-4">
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="My Profile" description="Manage your personal information." />

      <div className="max-w-xl">
        <Card>
          <CardContent className="p-6">
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <Avatar className="h-20 w-20 ring-2 ring-border">
                  <AvatarImage src={user?.profilePhotoUrl ?? user?.image ?? undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {(user?.fullName ?? user?.name ?? 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full"
                  title="Change photo"
                >
                  <Camera className="h-3 w-3" />
                </Button>
              </div>
              <div>
                <p className="font-semibold text-lg">{user?.fullName ?? user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
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
              <Button className="w-full" onClick={handleSave} disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
