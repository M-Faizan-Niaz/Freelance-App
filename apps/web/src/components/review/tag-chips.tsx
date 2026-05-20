'use client';

import { cn } from '@/lib/utils';

const TAGS = ['Professional', 'On Time', 'Good Work', 'Friendly', 'Great Value'] as const;

interface Props {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function TagChips({ selected, onChange }: Props) {
  function toggle(tag: string) {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {TAGS.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => toggle(tag)}
          className={cn(
            'rounded-full border px-3 py-1.5 text-sm transition-colors',
            selected.includes(tag)
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-border text-muted-foreground hover:border-primary/40',
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
