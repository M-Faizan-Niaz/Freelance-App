'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSession } from '@/hooks/use-session'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const session = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!session.isPending && !session.data) {
      router.replace(`/auth/sign-in?callbackUrl=${encodeURIComponent(pathname)}`)
    }
  }, [session.isPending, session.data, router, pathname])

  if (session.isPending || !session.data) return null

  return <>{children}</>
}
