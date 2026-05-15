import { Link, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

type VerifyState = 'loading' | 'success' | 'error';

export function VerifyEmailPage() {
  const search = useSearch({ strict: false }) as { token?: string; error?: string };
  const [state, setState] = useState<VerifyState>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function verify() {
      if (search.error || !search.token) {
        setState('error');
        setErrorMessage('This verification link is invalid or has expired.');
        return;
      }

      const { error } = await authClient.verifyEmail({ query: { token: search.token } });

      if (error) {
        setState('error');
        setErrorMessage(error.message ?? 'Verification failed. The link may have expired.');
      } else {
        setState('success');
      }
    }

    verify();
  }, []); // run once on mount

  if (state === 'loading') {
    return (
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-medium">Verifying email…</h1>
          <p className="text-sm text-muted-foreground">
            Please wait while we verify your email address.
          </p>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-medium">Verification failed</h1>
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
        </div>
        <div className="text-center">
          <Link
            to="/auth/sign-in"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-medium">Email verified!</h1>
        <p className="text-sm text-muted-foreground">
          Your email address has been verified. You can now sign in to your account.
        </p>
      </div>
      <Button asChild className="w-full">
        <Link to="/auth/sign-in">Sign in</Link>
      </Button>
    </div>
  );
}
