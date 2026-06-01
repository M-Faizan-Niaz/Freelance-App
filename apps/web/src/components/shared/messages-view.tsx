'use client'

import { Suspense, useRef, useEffect, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { Send, MessageSquare, ArrowLeft } from 'lucide-react'
import {
  useGetMe,
  useListConversations,
  useListMessages,
  useSendMessage,
  getListMessagesQueryKey,
  getListConversationsQueryKey,
} from '@repo/api-client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { cn } from '@/lib/utils'

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })
}

function initials(name: string | null) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function MessagesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  const selectedId = searchParams.get('c') ? Number(searchParams.get('c')) : null
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const { data: meData } = useGetMe()
  const currentUserId = meData?.data?.id

  const { data: convsData, isLoading: convsLoading } = useListConversations(undefined, {
    query: { refetchInterval: 10_000 },
  })
  const conversations = [...new Map((convsData?.data ?? []).map(c => [c.id, c])).values()]

  const { data: msgsData, isLoading: msgsLoading } = useListMessages(selectedId, undefined, {
    query: { enabled: !!selectedId, refetchInterval: 3_000 },
  })
  const messages = msgsData?.data ?? []

  const { mutate: send, isPending: sending } = useSendMessage({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey(selectedId) })
        queryClient.invalidateQueries({ queryKey: getListConversationsQueryKey() })
        setInput('')
      },
    },
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function selectConversation(id: number) {
    router.push(`?c=${id}`, { scroll: false })
  }

  function handleSend() {
    if (!input.trim() || !selectedId || sending) return
    send({ id: selectedId, data: { content: input.trim(), messageType: 'text' } })
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const selectedConv = conversations.find(c => c.id === selectedId)
  const mobileShowThread = !!selectedId

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Messages" description="Your conversations." />

      <div className="flex gap-3 h-[calc(100vh-220px)] min-h-[400px]">
        {/* Conversation List */}
        <div className={cn(
          'w-full md:w-72 shrink-0 flex flex-col rounded-xl border bg-white overflow-hidden',
          mobileShowThread && 'hidden md:flex',
        )}>
          <div className="px-4 py-3 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Conversations
          </div>

          {convsLoading ? (
            <div className="space-y-1 p-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <EmptyState
                icon={MessageSquare}
                title="No conversations"
                message="Start by booking a service."
                actionLabel="Browse Services"
                actionHref="/services"
              />
            </div>
          ) : (
            <ScrollArea className="flex-1">
              {conversations.map(conv => {
                const isActive = conv.id === selectedId
                return (
                  <button
                    key={conv.id}
                    onClick={() => selectConversation(conv.id)}
                    className={cn(
                      'w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50',
                      isActive && 'bg-primary/5 border-r-2 border-primary',
                    )}
                  >
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={conv.otherParty.profilePhotoUrl ?? undefined} />
                      <AvatarFallback className="text-xs">{initials(conv.otherParty.fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium truncate">
                          {conv.otherParty.fullName ?? 'Unknown'}
                        </p>
                        {conv.lastMessageAt && (
                          <span className="text-[11px] text-muted-foreground shrink-0">
                            {formatTime(conv.lastMessageAt)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className="text-xs text-muted-foreground truncate">
                          {conv.lastMessage ?? 'No messages yet'}
                        </p>
                        {conv.unreadCount > 0 && (
                          <Badge className="h-4 min-w-4 px-1 text-[10px] shrink-0 rounded-full">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </ScrollArea>
          )}
        </div>

        {/* Message Thread */}
        <div className={cn(
          'flex-1 flex flex-col rounded-xl border bg-white overflow-hidden min-w-0',
          !mobileShowThread && 'hidden md:flex',
        )}>
          {!selectedId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-2">
              <MessageSquare className="h-10 w-10 opacity-20" />
              <p className="text-sm">Select a conversation to start messaging</p>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-8 w-8"
                  onClick={() => router.push('?', { scroll: false })}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                {selectedConv && (
                  <>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedConv.otherParty.profilePhotoUrl ?? undefined} />
                      <AvatarFallback className="text-xs">{initials(selectedConv.otherParty.fullName)}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-semibold">{selectedConv.otherParty.fullName ?? 'Unknown'}</p>
                  </>
                )}
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 px-4 py-3">
                {msgsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={cn('flex', i % 2 === 0 ? 'justify-end' : 'justify-start')}>
                        <Skeleton className={cn('h-10 rounded-2xl', i % 2 === 0 ? 'w-36' : 'w-48')} />
                      </div>
                    ))}
                  </div>
                ) : messages.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No messages yet. Say hello!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {messages.map(msg => {
                      const isOwn = msg.senderId === currentUserId
                      return (
                        <div key={msg.id} className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
                          <div className={cn(
                            'max-w-[70%] px-3 py-2 rounded-2xl text-sm',
                            isOwn
                              ? 'bg-primary text-primary-foreground rounded-br-sm'
                              : 'bg-muted text-foreground rounded-bl-sm',
                          )}>
                            <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                            <p className={cn(
                              'text-[10px] mt-0.5',
                              isOwn ? 'text-primary-foreground/60 text-right' : 'text-muted-foreground',
                            )}>
                              {formatTime(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={bottomRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Send input */}
              <div className="px-4 py-3 border-t flex items-end gap-2 shrink-0">
                <Textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
                  className="resize-none min-h-[40px] max-h-32 text-sm leading-relaxed"
                  rows={1}
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  className="shrink-0 h-10 w-10"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function MessagesView() {
  return (
    <Suspense>
      <MessagesContent />
    </Suspense>
  )
}
