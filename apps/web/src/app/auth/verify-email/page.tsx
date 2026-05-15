import Link from 'next/link';

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-4 text-center">
        <div className="text-5xl">📬</div>
        <h1 className="text-2xl font-semibold">Check your inbox</h1>
        <p className="text-sm text-muted-foreground">
          We sent a verification link to your email address. Click it to activate your account — the
          link expires in <strong>24 hours</strong>.
        </p>
        <p className="text-xs text-muted-foreground">
          Didn&apos;t receive it? Check your spam folder or{' '}
          <Link href="/auth/sign-up" className="underline underline-offset-4 hover:text-foreground">
            try again
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
