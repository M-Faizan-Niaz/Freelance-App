'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGetMe } from '@repo/api-client';
import { StepProfile } from './_components/step-profile';
import { StepRate } from './_components/step-rate';
import { StepCategories } from './_components/step-categories';
import { StepDone } from './_components/step-done';

const STEPS = [
  { label: 'Profile' },
  { label: 'Your Rate' },
  { label: 'Services' },
];

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

export default function ProviderOnboardingPage() {
  const router = useRouter();
  const { data: meData, isPending: authPending } = useGetMe({ query: { retry: false } });
  const user = meData?.data ?? null;

  useEffect(() => {
    if (!authPending && !user) {
      router.replace('/auth/sign-in?callbackUrl=/provider-onboarding');
    }
  }, [authPending, user, router]);

  const [step, setStep] = useState(1);
  const isDone = step > STEPS.length;

  if (authPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen items-start justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <Link href="/" className="text-lg font-extrabold text-primary">
            HirePro
          </Link>
          {isDone ? (
            <h1 className="mt-1 text-2xl font-semibold text-foreground">Welcome aboard!</h1>
          ) : (
            <>
              <h1 className="mt-1 text-2xl font-semibold text-foreground">Set up your provider profile</h1>
              <p className="mt-1 text-sm text-muted-foreground">Step {step} of {STEPS.length}</p>
            </>
          )}
        </div>

        {!isDone && <ProgressBar current={step} />}

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          {step === 1 && <StepProfile onNext={() => setStep(2)} />}
          {step === 2 && <StepRate onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <StepCategories onNext={() => setStep(4)} onBack={() => setStep(2)} />}
          {isDone && <StepDone />}
        </div>
      </div>
    </div>
  );
}
