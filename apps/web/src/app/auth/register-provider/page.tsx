'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/lib/constants';
import { registerProviderSchema, type RegisterProviderValues } from '@/lib/validations';
import { StepAccount } from './_components/step-account';
import { StepProfessional } from './_components/step-professional';
import { StepIdentity } from './_components/step-identity';
import { Confirmation } from './_components/confirmation';

const STEPS = [
  { label: 'Personal Info' },
  { label: 'Service Area' },
  { label: 'Verification' },
];

const STEP_FIELDS: Record<number, (keyof RegisterProviderValues)[]> = {
  1: ['name', 'email', 'phone', 'password', 'confirmPassword'],
  2: ['city'],
  3: ['cnicNumber', 'termsAccepted'],
};

function ProgressBar({ current }: { current: number }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {STEPS.map((s, i) => {
          const done = i + 1 < current;
          const active = i + 1 === current;
          return (
            <div key={s.label} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex w-full items-center">
                {i > 0 && (
                  <div
                    className={cn(
                      'h-px flex-1 transition-colors',
                      done || active ? 'bg-primary' : 'bg-border',
                    )}
                  />
                )}
                <div
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all',
                    done
                      ? 'border-primary bg-primary text-primary-foreground'
                      : active
                        ? 'border-primary bg-background text-primary ring-4 ring-primary/20'
                        : 'border-border bg-background text-muted-foreground',
                  )}
                >
                  {done ? <CheckCircle className="h-3.5 w-3.5" /> : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'h-px flex-1 transition-colors',
                      done ? 'bg-primary' : 'bg-border',
                    )}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex justify-between">
        {STEPS.map((s, i) => (
          <span
            key={s.label}
            className={cn(
              'flex-1 text-center text-[11px] font-medium leading-tight',
              i + 1 === current ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function RegisterProviderPage() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // File inputs are managed outside RHF — File objects aren't serializable.
  // CNIC docs are uploaded from the provider dashboard after email verification.
  const cnicFrontRef = useRef<HTMLInputElement>(null);
  const cnicBackRef = useRef<HTMLInputElement>(null);
  const [cnicFrontFile, setCnicFrontFile] = useState<File | null>(null);
  const [cnicBackFile, setCnicBackFile] = useState<File | null>(null);

  const form = useForm<RegisterProviderValues>({
    resolver: zodResolver(registerProviderSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      city: '',
      cnicNumber: '',
      termsAccepted: undefined as unknown as true,
    },
    mode: 'onTouched',
  });

  async function handleNext() {
    const valid = await form.trigger(STEP_FIELDS[step] as Parameters<typeof form.trigger>[0]);
    if (valid) setStep((s) => s + 1);
  }

  async function onSubmit(data: RegisterProviderValues) {
    setApiError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/v1/api/auth/register/provider`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          phoneNumber: `+92${data.phone}`,
          cnicNumber: data.cnicNumber,
          city: data.city,
        }),
      });
      const json = (await res.json()) as {
        success: boolean;
        message?: string;
        error?: { message?: string };
      };
      if (!res.ok || !json.success) {
        setApiError(json.message ?? json.error?.message ?? 'Registration failed. Please try again.');
        return;
      }
      setDone(true);
    } catch {
      setApiError('Network error. Please check your connection and try again.');
    }
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-start justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <Confirmation />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-start justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <Link href="/" className="text-lg font-extrabold text-primary">
            HirePro
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">Apply as a Provider</h1>
          <p className="mt-1 text-sm text-muted-foreground">Step {step} of {STEPS.length}</p>
        </div>

        <ProgressBar current={step} />

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
            {step === 1 && (
              <StepAccount control={form.control} onNext={handleNext} />
            )}
            {step === 2 && (
              <StepProfessional
                control={form.control}
                onNext={handleNext}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <StepIdentity
                control={form.control}
                cnicFrontRef={cnicFrontRef}
                cnicBackRef={cnicBackRef}
                cnicFrontFile={cnicFrontFile}
                cnicBackFile={cnicBackFile}
                onCnicFrontChange={setCnicFrontFile}
                onCnicBackChange={setCnicBackFile}
                onBack={() => setStep(2)}
                isSubmitting={form.formState.isSubmitting}
                apiError={apiError}
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
