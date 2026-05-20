'use client';

import { Bell, CalendarDays, CreditCard, MessageSquare } from 'lucide-react';
import type { ListNotifications200DataItem } from '@repo/api-client';
import { cn } from '@/lib/utils';

function getIcon(typeName: string) {
  if (typeName.includes('booking'))
    return <CalendarDays className="h-5 w-5 text-blue-600" />;
  if (typeName.includes('payment'))
    return <CreditCard className="h-5 w-5 text-green-600" />;
  if (typeName.includes('chat') || typeName.includes('message'))
    return <MessageSquare className="h-5 w-5 text-purple-600" />;
  return <Bell className="h-5 w-5 text-muted-foreground" />;
}

function getIconBg(typeName: string): string {
  if (typeName.includes('booking'))  return 'bg-blue-50 dark:bg-blue-950/20';
  if (typeName.includes('payment'))  return 'bg-green-50 dark:bg-green-950/20';
  if (typeName.includes('chat') || typeName.includes('message'))
    return 'bg-purple-50 dark:bg-purple-950/20';
  return 'bg-muted';
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const diffMins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (diffMins < 1)  return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24)  return `${diffHrs}h ago`;
  return d.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' });
}

interface Props {
  item: ListNotifications200DataItem;
  onClick: () => void;
}

export function NotificationItem({ item, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-muted/50 active:bg-muted',
        !item.isRead && 'bg-primary/5',
      )}
    >
      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', getIconBg(item.typeName))}>
        {getIcon(item.typeName)}
      </div>

      <div className="min-w-0 flex-1">
        <p className={cn('text-sm leading-snug', !item.isRead ? 'font-semibold text-foreground' : 'font-medium text-foreground')}>
          {item.title}
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{item.body}</p>
        <p className="mt-1 text-xs text-muted-foreground">{formatTime(item.createdAt)}</p>
      </div>

      {!item.isRead && (
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
      )}
    </button>
  );
}
