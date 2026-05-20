'use client';

import { useRouter } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import { useListConversations } from '@repo/api-client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';

function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatTime(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (d.toDateString() === new Date().toDateString())
    return d.toLocaleTimeString('en-PK', { hour: 'numeric', minute: '2-digit', hour12: true });
  return d.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' });
}

export default function ChatListPage() {
  const router = useRouter();
  const { data, isLoading } = useListConversations({ limit: 30 });
  const conversations = data?.data ?? [];

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your conversations with service providers and customers.</p>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="divide-y">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-4">
                <Skeleton className="h-11 w-11 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="h-6 w-6" />}
            title="No conversations yet"
            description="Start a conversation by booking a service or accepting a job request."
          />
        ) : (
          <ul>
            {conversations.map((c, idx) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => router.push(`/chat/${c.id}`)}
                  className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-muted/50 active:bg-muted"
                >
                  <Avatar className="h-11 w-11 flex-shrink-0">
                    <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                      {getInitials(c.otherParty?.fullName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-foreground">
                      {c.otherParty?.fullName ?? 'Unknown'}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {c.lastMessage ?? 'No messages yet'}
                    </p>
                  </div>

                  <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
                    <span className="text-xs text-muted-foreground">
                      {formatTime(c.lastMessageAt)}
                    </span>
                    {c.unreadCount > 0 && (
                      <Badge variant="orange" className="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs">
                        {c.unreadCount > 99 ? '99+' : c.unreadCount}
                      </Badge>
                    )}
                  </div>
                </button>

                {idx < conversations.length - 1 && <Separator />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
