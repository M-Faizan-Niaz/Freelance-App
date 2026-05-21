'use client';

import { Controller, type Control } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PAKISTAN_CITIES } from '@/lib/constants';
import type { RegisterProviderValues } from '@/lib/validations';

interface StepProfessionalProps {
  control: Control<RegisterProviderValues>;
  onNext: () => void;
  onBack: () => void;
}

export function StepProfessional({ control, onNext, onBack }: StepProfessionalProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Service area</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select the city where you provide your services.
        </p>
      </div>

      <Controller
        control={control}
        name="city"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label htmlFor="city">Service city</Label>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="city"
                aria-invalid={fieldState.invalid}
                className={fieldState.invalid ? 'border-destructive focus:ring-destructive' : ''}
              >
                <SelectValue placeholder="Select your city" />
              </SelectTrigger>
              <SelectContent>
                {PAKISTAN_CITIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.error && (
              <p className="text-xs text-destructive">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      <p className="rounded-lg bg-muted px-4 py-3 text-xs text-muted-foreground">
        You can update your service areas, categories, bio, and portfolio photos from your provider
        dashboard after registration.
      </p>

      <div className="flex gap-3">
        <Button type="button" variant="outline" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button type="button" className="flex-1" onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}
