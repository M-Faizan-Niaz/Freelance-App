import { Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface CardData {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

interface Props {
  data: CardData;
  onChange: (d: CardData) => void;
}

function formatCardNumber(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

export function CardForm({ data, onChange }: Props) {
  function set<K extends keyof CardData>(key: K, value: CardData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="card-number">Card Number</Label>
        <Input
          id="card-number"
          inputMode="numeric"
          placeholder="1234 5678 9012 3456"
          value={data.number}
          maxLength={19}
          onChange={(e) => set('number', formatCardNumber(e.target.value))}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="card-expiry">Expiry</Label>
          <Input
            id="card-expiry"
            inputMode="numeric"
            placeholder="MM/YY"
            value={data.expiry}
            maxLength={5}
            onChange={(e) => set('expiry', formatExpiry(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="card-cvv" className="flex items-center gap-1">
            CVV <Lock className="h-3 w-3 text-muted-foreground" />
          </Label>
          <Input
            id="card-cvv"
            type="password"
            inputMode="numeric"
            placeholder="•••"
            value={data.cvv}
            maxLength={4}
            onChange={(e) => set('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="card-name">Name on Card</Label>
        <Input
          id="card-name"
          placeholder="As it appears on your card"
          value={data.name}
          onChange={(e) => set('name', e.target.value)}
        />
      </div>
    </div>
  );
}
