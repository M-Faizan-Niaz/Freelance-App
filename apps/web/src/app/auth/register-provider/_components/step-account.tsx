'use client';

import Link from 'next/link';
import { Controller, type Control } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { RegisterProviderValues } from '@/lib/validations';

interface StepAccountProps {
  control: Control<RegisterProviderValues>;
  onNext: () => void;
}

export function StepAccount({ control, onNext }: StepAccountProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Personal information</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This is how customers and our team will identify you.
        </p>
      </div>

      <div className="space-y-4">
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                {...field}
                id="name"
                placeholder="Ahmed Raza"
                autoComplete="name"
                aria-invalid={fieldState.invalid}
                className={cn(fieldState.invalid && 'border-destructive focus-visible:ring-destructive')}
              />
              {fieldState.error && (
                <p className="text-xs text-destructive">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                {...field}
                id="email"
                type="email"
                placeholder="ahmed@example.com"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                className={cn(fieldState.invalid && 'border-destructive focus-visible:ring-destructive')}
              />
              {fieldState.error && (
                <p className="text-xs text-destructive">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <div className="flex gap-2">
                <span className="flex items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">
                  +92
                </span>
                <Input
                  {...field}
                  id="phone"
                  type="tel"
                  placeholder="3001234567"
                  autoComplete="tel"
                  maxLength={10}
                  aria-invalid={fieldState.invalid}
                  className={cn('flex-1', fieldState.invalid && 'border-destructive focus-visible:ring-destructive')}
                  onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
              </div>
              {fieldState.error ? (
                <p className="text-xs text-destructive">{fieldState.error.message}</p>
              ) : (
                <p className="text-xs text-muted-foreground">10-digit number without country code</p>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                {...field}
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
                className={cn(fieldState.invalid && 'border-destructive focus-visible:ring-destructive')}
              />
              {fieldState.error ? (
                <p className="text-xs text-destructive">{fieldState.error.message}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Must include uppercase, lowercase, number, and special character.
                </p>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                {...field}
                id="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
                className={cn(fieldState.invalid && 'border-destructive focus-visible:ring-destructive')}
              />
              {fieldState.error && (
                <p className="text-xs text-destructive">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />
      </div>

      <Button type="button" className="w-full" size="lg" onClick={onNext}>
        Continue
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/auth/sign-in" className="underline underline-offset-4 hover:text-foreground">
          Sign in
        </Link>
      </p>
    </div>
  );
}
