'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Paperclip, Send, ShieldCheck } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getListMessagesQueryKey,
  useListConversations,
  useListMessages,
  useSendMessage,
} from '@repo/api-client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { ChatHeader } from '@/components/chat/chat-header';
import { MessageBubble } from '@/components/chat/message-bubble';
import { QuickReplyChips } from '@/components/chat/quick-reply-chips';
import { authClient } from '@/lib/auth-client';
import { CHAT_POLL_INTERVAL_MS } from '@/lib/constants';

const MESSAGES_PARAMS = { limit: 50 } as const;

export default function ActiveChatPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const id = Number(conversationId);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(0);

  // Fetch conversation metadata for the header
  const { data: convListData } = useListConversations({ limit: 100 });
  const conversation = convListData?.data?.find((c) => c.id === id) ?? null;

  // Resolve current user once
  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      if (data?.user) setCurrentUserId(data.user.id);
    });
  }, []);

  // Poll messages every 3 seconds
  const { data: messagesData, isLoading } = useListMessages(id, MESSAGES_PARAMS, {
    query: { refetchInterval: CHAT_POLL_INTERVAL_MS, enabled: !!id },
  });

  // API returns newest-first → reverse for display (oldest at top)
  const messages = useMemo(
    () => [...(messagesData?.data ?? [])].reverse(),
    [messagesData],
  );

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > prevCountRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: messages.length <= 1 ? 'instant' : 'smooth' });
    }
    prevCountRef.current = messages.length;
  }, [messages.length]);

  // Optimistic send
  const { mutateAsync: sendMsg, isPending: sending } = useSendMessage({
    mutation: {
      onMutate: async (vars) => {
        const qKey = getListMessagesQueryKey(vars.id, MESSAGES_PARAMS);
        await queryClient.cancelQueries({ queryKey: qKey });
        const snapshot = queryClient.getQueryData(qKey);
        queryClient.setQueryData(qKey, (old: any) => ({
          ...old,
          data: [
            {
              id: -Date.now(),
              conversationId: id,
              senderId: currentUserId,
              content: vars.data.content,
              messageType: vars.data.messageType ?? 'text',
              createdAt: new Date().toISOString(),
              isRead: false,
              isDeleted: false,
            },
            ...(old?.data ?? []),
          ],
        }));
        return { snapshot };
      },
      onError: (_e, vars, ctx) => {
        queryClient.setQueryData(getListMessagesQueryKey(vars.id, MESSAGES_PARAMS), ctx?.snapshot);
      },
      onSettled: (_d, _e, vars) => {
        queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey(vars.id) });
      },
    },
  });

  async function handleSend() {
    const content = input.trim();
    if (!content || sending) return;
    setInput('');
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    await sendMsg({ id, data: { content, messageType: 'text' } });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6">
      <div
        className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm"
        style={{ height: 'calc(100vh - 160px)', minHeight: '480px' }}
      >
        {/* Header */}
        <ChatHeader
          name={conversation?.otherParty?.fullName ?? 'Chat'}
          bookingId={conversation?.bookingId}
          onBack={() => router.back()}
        />

        {/* Safety banner */}
        <div className="flex items-center gap-2 border-b bg-yellow-50 px-4 py-2 text-xs text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-300">
          <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" />
          Never share payment outside the app. All transactions are protected.
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <Skeleton className={`h-10 rounded-2xl ${i % 2 === 0 ? 'w-48 rounded-tl-sm' : 'w-36 rounded-tr-sm'}`} />
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No messages yet. Say hello!
            </p>
          ) : (
            messages.map((m) => (
              <MessageBubble
                key={m.id}
                content={m.content}
                isSent={m.senderId === currentUserId}
                timestamp={m.createdAt}
                messageType={m.messageType}
              />
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick reply chips */}
        <div className="border-t px-4 pt-2.5 pb-1">
          <QuickReplyChips onSelect={(t) => setInput(t)} disabled={sending} />
        </div>

        {/* Input row */}
        <div className="flex items-end gap-2 border-t bg-card px-4 py-3">
          <label
            htmlFor="chat-img-upload"
            className="mb-1 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
            title="Attach photo"
          >
            <Paperclip className="h-5 w-5" />
            <input id="chat-img-upload" type="file" accept="image/*" className="hidden" />
          </label>

          <Textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send)"
            className="flex-1 resize-none leading-relaxed"
            style={{ minHeight: '38px', maxHeight: '120px' }}
          />

          <Button
            size="icon"
            onClick={handleSend}
            disabled={sending || !input.trim()}
            className="mb-0.5 h-9 w-9 flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
