'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'

function VerifyEmailContent() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get('token')

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!token) return

    setStatus('loading')

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/api/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(json?.message ?? 'Verification failed. The link may have expired.')
        setStatus('success')
        const session = await authClient.getSession()
        const roleId = (session?.data?.user as { roleId?: number } | null)?.roleId
        setTimeout(() => {
          if (roleId === 2) router.push('/provider/onboarding')
          else if (roleId === 1) router.push('/dashboard')
          else router.push('/auth/sign-in')
        }, 1500)
      })
      .catch((err: Error) => {
        setStatus('error')
        setErrorMsg(err.message ?? 'Verification failed.')
      })
  }, [token, router])

  // ── Token in URL — verifying ───────────────────────────────────────────────

  if (token && status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-4 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <h1 className="text-xl font-semibold">Verifying your email…</h1>
          <p className="text-sm text-muted-foreground">Please wait a moment.</p>
        </div>
      </div>
    )
  }

  if (token && status === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-4 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
          <h1 className="text-xl font-semibold">Email verified!</h1>
          <p className="text-sm text-muted-foreground">Redirecting you to complete your profile…</p>
        </div>
      </div>
    )
  }

  if (token && status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-4 text-center">
          <XCircle className="h-12 w-12 text-destructive mx-auto" />
          <h1 className="text-xl font-semibold">Verification failed</h1>
          <p className="text-sm text-muted-foreground">{errorMsg}</p>
          <Button asChild variant="outline">
            <Link href="/auth/sign-up">Back to sign up</Link>
          </Button>
        </div>
      </div>
    )
  }

  // ── No token — check your inbox ────────────────────────────────────────────

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
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  )
}
