'use client';

import { useRef } from 'react';
import { ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { BookingState, BookingAction } from './booking-shell';
import type { ProviderProfile } from '@/app/providers/_data/provider-profiles';

const FALLBACK_SERVICES = [
  'General Repair',
  'Installation',
  'Inspection',
  'Maintenance',
  'Emergency Service',
];

interface StepServiceProps {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  provider: ProviderProfile | null;
  photosRef: React.MutableRefObject<File[]>;
}

export function StepService({ state, dispatch, provider, photosRef }: StepServiceProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const services = provider?.servicesOffered.map((s) => s.label) ?? FALLBACK_SERVICES;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 3);
    photosRef.current = files;
    dispatch({ type: 'SET_FIELD', field: 'photoCount', value: files.length });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">What do you need done?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a service and describe your job so the provider can prepare.
        </p>
      </div>

      {/* Service selector */}
      <div className="space-y-2">
        <Label htmlFor="service-select">Service</Label>
        <Select
          value={state.serviceLabel}
          onValueChange={(v) => dispatch({ type: 'SET_FIELD', field: 'serviceLabel', value: v })}
        >
          <SelectTrigger id="service-select">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {services.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Describe your job</Label>
        <Textarea
          id="description"
          placeholder="e.g. I need a fan installed in the bedroom ceiling, wiring already exists..."
          rows={4}
          maxLength={500}
          value={state.description}
          onChange={(e) =>
            dispatch({ type: 'SET_FIELD', field: 'description', value: e.target.value })
          }
        />
        <p className="text-right text-xs text-muted-foreground">
          {state.description.length}/500
        </p>
      </div>

      {/* Photo upload */}
      <div className="space-y-2">
        <Label>Photos (optional)</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-6 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <ImagePlus className="h-5 w-5" />
          {state.photoCount > 0
            ? `${state.photoCount} photo${state.photoCount > 1 ? 's' : ''} added`
            : 'Add up to 3 photos'}
        </button>
      </div>

      {/* Action */}
      <Button
        className="w-full"
        size="lg"
        disabled={!state.serviceLabel}
        onClick={() => dispatch({ type: 'NEXT_STEP' })}
      >
        Continue
      </Button>
    </div>
  );
}
