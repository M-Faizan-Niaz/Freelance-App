'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';

function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // Request the OTP email as soon as the page mounts
  useEffect(() => {
    authClient.twoFactor
      .sendOtp()
      .then(() => setSent(true))
      .catch(() => {
        setError('Failed to send verification code. Please go back and sign in again.');
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: err } = await authClient.twoFactor.verifyOtp({ code });

    setLoading(false);

    if (err) {
      setError(err.message ?? 'Invalid code. Please try again.');
      return;
    }

    router.push(callbackUrl);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            {sent
              ? 'We sent a 6-digit verification code to your email.'
              : 'Sending verification code…'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="code">
              Verification code
            </label>
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="123456"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              autoComplete="one-time-code"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading || !sent}>
            {loading ? 'Verifying…' : 'Verify'}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Didn&apos;t receive the code? Check your spam folder or{' '}
          <button
            type="button"
            className="underline underline-offset-4 hover:text-foreground"
            onClick={() => {
              setSent(false);
              authClient.twoFactor.sendOtp().then(() => setSent(true));
            }}
          >
            resend
          </button>
          .
        </p>
      </div>
    </div>
  );
}

export default function OtpPage() {
  return (
    <Suspense>
      <OtpForm />
    </Suspense>
  );
}
