'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PROMO_CODES: Record<string, number> = {
  HIRE10: 10,
  HIRE20: 20,
};

interface Props {
  onApply: (discountPct: number) => void;
}

type State = 'idle' | 'loading' | 'success' | 'error';

export function PromoCodeInput({ onApply }: Props) {
  const [code, setCode] = useState('');
  const [state, setState] = useState<State>('idle');
  const [appliedPct, setAppliedPct] = useState(0);
  function handleApply() {
    if (!code.trim()) return;
    setState('loading');
    setTimeout(() => {
      const pct = PROMO_CODES[code.trim().toUpperCase()];
      if (pct) {
        setAppliedPct(pct);
        setState('success');
        onApply(pct);
      } else {
        setState('error');
        onApply(0);
      }
    }, 300);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value);
    if (state !== 'idle') {
      setState('idle');
      onApply(0);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Enter promo code"
          value={code}
          onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          className="flex-1 uppercase"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleApply}
          disabled={state === 'loading' || !code.trim()}
          className="shrink-0"
        >
          {state === 'loading' ? '…' : 'Apply'}
        </Button>
      </div>

      {state === 'success' && (
        <p className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {appliedPct}% discount applied!
        </p>
      )}
      {state === 'error' && (
        <p className="flex items-center gap-1.5 text-xs text-destructive">
          <XCircle className="h-3.5 w-3.5" />
          Invalid promo code
        </p>
      )}
    </div>
  );
}
