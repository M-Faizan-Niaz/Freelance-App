import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

interface Props {
  name: string;
  avatarUrl?: string | null;
  bookingId?: number | null;
  onBack: () => void;
}

export function ChatHeader({ name, avatarUrl: _avatarUrl, bookingId, onBack }: Props) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-3 border-b bg-card px-4 py-3">
      <button
        type="button"
        onClick={onBack}
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="relative flex-shrink-0">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-card" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-foreground">{name}</p>
        <p className="text-xs text-green-600 dark:text-green-400">Online</p>
      </div>

      {bookingId && (
        <Link
          href={`/booking?id=${bookingId}`}
          className="flex-shrink-0 text-xs text-muted-foreground hover:text-primary"
        >
          View Booking →
        </Link>
      )}
    </div>
  );
}
