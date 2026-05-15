import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';

export function OtpPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { callbackUrl?: string };
  const callbackUrl = search.callbackUrl ?? '/';

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    authClient.twoFactor
      .sendOtp()
      .then(() => setSent(true))
      .catch(() => setError('Failed to send verification code. Please sign in again.'));
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

    await navigate({ to: callbackUrl as '/' });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold">Verify your identity</h1>
          <p className="text-sm text-muted-foreground">
            {sent ? 'Enter the code we sent to your email.' : 'Sending verification code…'}
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

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading || !sent}>
            {loading ? 'Verifying…' : 'Verify'}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Didn&apos;t receive the code?{' '}
          <button
            type="button"
            className="underline underline-offset-4"
            onClick={() => {
              setSent(false);
              authClient.twoFactor.sendOtp().then(() => setSent(true));
            }}
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}
