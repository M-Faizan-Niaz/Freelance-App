import { Banknote, CreditCard, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

const METHODS = [
  { id: 1, name: 'JazzCash',            Icon: Smartphone, color: 'text-red-600',            bg: 'bg-red-50 dark:bg-red-950/20' },
  { id: 2, name: 'EasyPaisa',           Icon: Smartphone, color: 'text-green-600',          bg: 'bg-green-50 dark:bg-green-950/20' },
  { id: 3, name: 'Debit / Credit Card', Icon: CreditCard, color: 'text-blue-600',           bg: 'bg-blue-50 dark:bg-blue-950/20' },
  { id: 4, name: 'Cash on Completion',  Icon: Banknote,   color: 'text-muted-foreground',   bg: 'bg-muted' },
] as const;

interface Props {
  selected: number;
  onChange: (id: number) => void;
}

export function PaymentMethodSelector({ selected, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {METHODS.map(({ id, name, Icon, color, bg }) => {
        const isSelected = selected === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              'flex flex-col items-start gap-2.5 rounded-xl border-2 p-4 text-left transition-colors',
              isSelected
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/40',
            )}
          >
            <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', bg)}>
              <Icon className={cn('h-5 w-5', color)} />
            </div>
            <span className={cn('text-sm font-medium leading-tight', isSelected ? 'text-foreground' : 'text-muted-foreground')}>
              {name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
