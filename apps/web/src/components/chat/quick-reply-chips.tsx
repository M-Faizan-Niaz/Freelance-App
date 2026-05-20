import { cn } from '@/lib/utils';

const CHIPS = ['On my way', 'Running 15 min late', 'Job complete'] as const;

interface Props {
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export function QuickReplyChips({ onSelect, disabled }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {CHIPS.map((chip) => (
        <button
          key={chip}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(chip)}
          className={cn(
            'flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
            'border-border text-muted-foreground hover:border-primary hover:bg-primary/5 hover:text-primary',
            'disabled:pointer-events-none disabled:opacity-50',
          )}
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
