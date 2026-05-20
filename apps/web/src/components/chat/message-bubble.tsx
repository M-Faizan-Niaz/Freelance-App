import { cn } from '@/lib/utils';

function formatTime(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (d.toDateString() === new Date().toDateString())
    return d.toLocaleTimeString('en-PK', { hour: 'numeric', minute: '2-digit', hour12: true });
  return d.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' });
}

interface Props {
  content: string;
  isSent: boolean;
  timestamp: string;
  messageType: string;
}

export function MessageBubble({ content, isSent, timestamp, messageType }: Props) {
  return (
    <div className={cn('flex', isSent ? 'justify-end' : 'justify-start')}>
      <div className="flex max-w-[75%] flex-col">
        <div
          className={cn(
            'px-4 py-2.5 text-sm leading-relaxed',
            isSent
              ? 'rounded-2xl rounded-tr-sm bg-primary text-primary-foreground'
              : 'rounded-2xl rounded-tl-sm bg-muted text-foreground',
          )}
        >
          {content}
          {messageType === 'quick_reply' && (
            <p className={cn('mt-0.5 text-xs italic', isSent ? 'text-primary-foreground/60' : 'text-muted-foreground')}>
              Quick reply
            </p>
          )}
        </div>
        <p className={cn('mt-1 text-xs text-muted-foreground', isSent ? 'text-right' : 'text-left')}>
          {formatTime(timestamp)}
        </p>
      </div>
    </div>
  );
}
