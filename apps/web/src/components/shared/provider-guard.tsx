'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSession } from '@/hooks/use-session'
import { useGetMe } from '@repo/api-client'

const ROLE_PROVIDER = 2

export function ProviderGuard({ children }: { children: React.ReactNode }) {
  const session = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const { data: meData, isPending: mePending } = useGetMe()
  const roleId = meData?.data?.roleId

  useEffect(() => {
    if (!session.isPending && !session.data) {
      router.replace(`/auth/sign-in?callbackUrl=${encodeURIComponent(pathname)}`)
      return
    }
    if (!session.isPending && !mePending && roleId !== undefined && roleId !== ROLE_PROVIDER) {
      router.replace('/dashboard')
    }
  }, [session.isPending, session.data, mePending, roleId, router, pathname])

  const isReady = !session.isPending && !!session.data && !mePending && roleId === ROLE_PROVIDER
  if (!isReady) return null

  return <>{children}</>
}
