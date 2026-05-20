'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { BookingState, BookingAction } from './booking-shell';
import type { ProviderProfile } from '@/app/providers/_data/provider-profiles';

const CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Peshawar'];

interface StepAddressProps {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  provider: ProviderProfile | null;
}

export function StepAddress({ state, dispatch }: StepAddressProps) {
  function field(key: keyof BookingState) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatch({ type: 'SET_FIELD', field: key, value: e.target.value });
  }

  const canContinue = !!state.addressStreet.trim() && !!state.addressArea.trim();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Where is the job?</h2>
        <p className="mt-1 text-sm text-muted-foreground">Enter the address where you need the service.</p>
      </div>

      <div className="space-y-4">
        {/* Street */}
        <div className="space-y-2">
          <Label htmlFor="street">Street address</Label>
          <Input
            id="street"
            placeholder="e.g. 45 Bahadurabad"
            value={state.addressStreet}
            onChange={field('addressStreet')}
          />
        </div>

        {/* Area */}
        <div className="space-y-2">
          <Label htmlFor="area">Area / Neighbourhood</Label>
          <Input
            id="area"
            placeholder="e.g. Gulshan-e-Iqbal"
            value={state.addressArea}
            onChange={field('addressArea')}
          />
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="city-select">City</Label>
          <Select
            value={state.addressCity}
            onValueChange={(v) => dispatch({ type: 'SET_FIELD', field: 'addressCity', value: v })}
          >
            <SelectTrigger id="city-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Unit */}
        <div className="space-y-2">
          <Label htmlFor="unit">
            Floor / Unit{' '}
            <span className="text-xs font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="unit"
            placeholder="e.g. Flat 3, Floor 2"
            value={state.addressUnit}
            onChange={field('addressUnit')}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => dispatch({ type: 'PREV_STEP' })}>
          Back
        </Button>
        <Button className="flex-1" disabled={!canContinue} onClick={() => dispatch({ type: 'NEXT_STEP' })}>
          Continue
        </Button>
      </div>
    </div>
  );
}
