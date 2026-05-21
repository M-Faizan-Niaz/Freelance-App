'use client';

import { type RefObject } from 'react';
import Link from 'next/link';
import { Controller, type Control } from 'react-hook-form';
import { CheckCircle, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { RegisterProviderValues } from '@/lib/validations';

interface StepIdentityProps {
  control: Control<RegisterProviderValues>;
  cnicFrontRef: RefObject<HTMLInputElement | null>;
  cnicBackRef: RefObject<HTMLInputElement | null>;
  cnicFrontFile: File | null;
  cnicBackFile: File | null;
  onCnicFrontChange: (file: File | null) => void;
  onCnicBackChange: (file: File | null) => void;
  onBack: () => void;
  isSubmitting: boolean;
  apiError: string | null;
}

function formatCnic(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 13);
  if (digits.length <= 5) return digits;
  if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
}

interface UploadButtonProps {
  label: string;
  uploaded: boolean;
  onUpload: () => void;
  optional?: boolean;
}

function UploadButton({ label, uploaded, onUpload, optional }: UploadButtonProps) {
  return (
    <button
      type="button"
      onClick={onUpload}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg border-2 border-dashed px-4 py-3 text-sm transition-colors',
        uploaded
          ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400'
          : 'border-border text-muted-foreground hover:border-primary hover:text-primary',
      )}
    >
      {uploaded ? (
        <CheckCircle className="h-4 w-4 shrink-0" />
      ) : (
        <Upload className="h-4 w-4 shrink-0" />
      )}
      <span className="flex-1 text-left">{uploaded ? `${label} — uploaded` : label}</span>
      {optional && !uploaded && (
        <span className="text-xs text-muted-foreground">Optional</span>
      )}
    </button>
  );
}

export function StepIdentity({
  control,
  cnicFrontRef,
  cnicBackRef,
  cnicFrontFile,
  cnicBackFile,
  onCnicFrontChange,
  onCnicBackChange,
  onBack,
  isSubmitting,
  apiError,
}: StepIdentityProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Identity verification</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Required to build trust with customers. Your data is encrypted and never shared.
        </p>
      </div>

      <div className="space-y-4">
        <Controller
          control={control}
          name="cnicNumber"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <Label htmlFor="cnicNumber">CNIC number</Label>
              <Input
                id="cnicNumber"
                placeholder="XXXXX-XXXXXXX-X"
                value={field.value}
                maxLength={15}
                aria-invalid={fieldState.invalid}
                className={cn(fieldState.invalid && 'border-destructive focus-visible:ring-destructive')}
                onChange={(e) => field.onChange(formatCnic(e.target.value))}
                onBlur={field.onBlur}
              />
              {fieldState.error ? (
                <p className="text-xs text-destructive">{fieldState.error.message}</p>
              ) : (
                <p className="text-xs text-muted-foreground">Format: 42101-1234567-8</p>
              )}
            </div>
          )}
        />

        <Separator />

        {/* CNIC photo uploads — optional at registration, uploaded from dashboard post-auth */}
        <div className="space-y-2">
          <Label>CNIC photos</Label>
          <p className="text-xs text-muted-foreground">
            You can upload these now or from your provider dashboard after email verification.
          </p>
          <div className="space-y-2">
            <input
              ref={cnicFrontRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => onCnicFrontChange(e.target.files?.[0] ?? null)}
            />
            <UploadButton
              label="CNIC — Front side"
              uploaded={!!cnicFrontFile}
              onUpload={() => cnicFrontRef.current?.click()}
              optional
            />

            <input
              ref={cnicBackRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => onCnicBackChange(e.target.files?.[0] ?? null)}
            />
            <UploadButton
              label="CNIC — Back side"
              uploaded={!!cnicBackFile}
              onUpload={() => cnicBackRef.current?.click()}
              optional
            />
          </div>
        </div>

        <Separator />

        <Controller
          control={control}
          name="termsAccepted"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4">
                <Checkbox
                  id="terms"
                  checked={field.value === true}
                  onCheckedChange={(checked) => field.onChange(checked === true ? true : undefined)}
                  className="mt-0.5 shrink-0"
                  aria-invalid={fieldState.invalid}
                />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  I agree to the{' '}
                  <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
                    Privacy Policy
                  </Link>
                  . I confirm all information provided is accurate.
                </span>
              </label>
              {fieldState.error && (
                <p className="text-xs text-destructive">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />

        <div className="flex items-start gap-2 rounded-lg bg-primary/5 p-3 text-xs text-muted-foreground">
          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p>
            Your documents are reviewed within 24–48 hours. You&apos;ll receive an SMS once your
            account is approved and ready to go live.
          </p>
        </div>
      </div>

      {apiError && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {apiError}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="outline" className="flex-1" onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Submit Application'}
        </Button>
      </div>
    </div>
  );
}
