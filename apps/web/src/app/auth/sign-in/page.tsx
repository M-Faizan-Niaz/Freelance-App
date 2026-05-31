'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { useSession } from '@/hooks/use-session';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';
  const session = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Holds the destination URL while we wait for the session atom to update
  const [pendingNav, setPendingNav] = useState<string | null>(null);

  // Navigate only after the session atom has been populated post-sign-in.
  // Without this guard, router.push fires before better-auth's 10 ms internal
  // setTimeout flips the session signal, causing AuthGuard to see stale
  // { data: null, isPending: false } and redirect back to sign-in.
  useEffect(() => {
    if (pendingNav && session.data) {
      setPendingNav(null);
      router.push(pendingNav);
    }
  }, [pendingNav, session.data, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: err } = await authClient.signIn.email({
      email,
      password,
      callbackURL: callbackUrl,
    });

    setLoading(false);

    if (err) {
      setError(err.message ?? 'Sign-in failed. Please check your credentials.');
      return;
    }

    // better-auth signals that 2FA is required
    if ((data as { twoFactorRedirect?: boolean } | null)?.twoFactorRedirect) {
      router.push(`/auth/otp?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    // Wait for session atom to confirm the new session before navigating.
    setPendingNav(callbackUrl);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="text-sm text-muted-foreground">Enter your email and password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="jane@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading || !!pendingNav}>
            {loading || pendingNav ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/auth/sign-up" className="underline underline-offset-4 hover:text-foreground">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
