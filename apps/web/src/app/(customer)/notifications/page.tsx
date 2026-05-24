'use client'

import { Bell, CheckCheck } from 'lucide-react'
import { useListNotifications, useMarkAllNotificationsRead } from '@repo/api-client'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { cn } from '@/lib/utils'

export default function NotificationsPage() {
  const { data, isLoading, refetch } = useListNotifications()
  const notifications = data?.data ?? []
  const unreadCount = notifications.filter(n => !n.isRead).length

  const { mutate: markAllRead, isPending } = useMarkAllNotificationsRead({
    mutation: { onSuccess: () => refetch() },
  })

  return (
    <div>
      <PageHeader
        title="Notifications"
        description={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
      >
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllRead()}
            disabled={isPending}
            className="flex items-center gap-2"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        )}
      </PageHeader>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="All caught up"
          message="You have no notifications right now."
        />
      ) : (
        <div className="space-y-1">
          {notifications.map(n => (
            <div
              key={n.id}
              className={cn(
                'flex items-start gap-3 p-4 rounded-xl border transition-colors',
                n.isRead ? 'bg-white' : 'bg-primary/5 border-primary/20',
              )}
            >
              <div className={cn(
                'w-2 h-2 rounded-full mt-2 shrink-0',
                n.isRead ? 'bg-transparent' : 'bg-primary',
              )} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
              </div>
              <p className="text-xs text-muted-foreground shrink-0">
                {new Date(n.createdAt).toLocaleDateString('en-PK', {
                  month: 'short', day: 'numeric',
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
