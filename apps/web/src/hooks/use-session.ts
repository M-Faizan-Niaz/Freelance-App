'use client'

import { useStore } from '@nanostores/react'
import { authClient } from '@/lib/auth-client'

type SessionUser = {
  id: string
  name: string
  email: string
  image?: string | null
}

type SessionStore = {
  data: { user: SessionUser; session: Record<string, unknown> } | null
  error: Error | null
  isPending: boolean
}

export function useSession(): SessionStore {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useStore(authClient.useSession as any) as SessionStore
}
