'use client';

import { useRouter } from 'next/navigation';
import { Bell, CheckCheck } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useListNotifications,
  useMarkAllNotificationsRead,
} from '@repo/api-client';
import type { ListNotifications200DataItem } from '@repo/api-client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { NotificationItem } from '@/components/notifications/notification-item';

function groupNotifications(items: ListNotifications200DataItem[]) {
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const yesterdayStart = new Date(todayStart); yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  return {
    today:     items.filter(n => new Date(n.createdAt) >= todayStart),
    yesterday: items.filter(n => { const d = new Date(n.createdAt); return d >= yesterdayStart && d < todayStart; }),
    earlier:   items.filter(n => new Date(n.createdAt) < yesterdayStart),
  };
}

function getHref(n: ListNotifications200DataItem): string {
  const d = n.data as Record<string, unknown> | null | undefined;
  if (n.typeName.includes('booking') || n.typeName.includes('payment')) {
    const id = d?.bookingId ?? d?.id;
    return id ? `/booking/${id}` : '/dashboard';
  }
  if (n.typeName.includes('chat') || n.typeName.includes('message')) {
    return d?.conversationId ? `/chat/${d.conversationId}` : '/chat';
  }
  return '/dashboard';
}

export default function NotificationsPage() {
  const router = useRouter();
  const qc = useQueryClient();

  const { data, isLoading } = useListNotifications({ limit: 100 });
  const notifications = data?.data ?? [];
  const hasUnread = notifications.some(n => !n.isRead);

  const { mutateAsync: markAll, isPending: markingAll } = useMarkAllNotificationsRead();

  async function handleMarkAll() {
    await markAll();
    qc.invalidateQueries({ queryKey: ['/v1/api/notifications'] });
  }

  const { today, yesterday, earlier } = groupNotifications(notifications);
  const groups = [
    { label: 'Today', items: today },
    { label: 'Yesterday', items: yesterday },
    { label: 'Earlier', items: earlier },
  ].filter(g => g.items.length > 0);

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Stay updated on your bookings and messages.
          </p>
        </div>
        {hasUnread && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleMarkAll}
            disabled={markingAll}
          >
            <CheckCheck className="h-4 w-4" />
            {markingAll ? 'Marking…' : 'Mark all read'}
          </Button>
        )}
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden divide-y">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-4">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-64" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && notifications.length === 0 && (
        <EmptyState
          icon={<Bell className="h-8 w-8" />}
          title="No notifications yet"
          description="You're all caught up! Check back later."
        />
      )}

      {/* Grouped list */}
      {!isLoading && groups.length > 0 && (
        <div className="space-y-6">
          {groups.map(({ label, items }) => (
            <div key={label}>
              <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
              <div className="rounded-xl border bg-card shadow-sm overflow-hidden divide-y">
                {items.map(n => (
                  <NotificationItem
                    key={n.id}
                    item={n}
                    onClick={() => router.push(getHref(n))}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
