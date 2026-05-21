'use client';

import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export function useSignOut() {
  const router = useRouter();

  return async function signOut() {
    await authClient.signOut();
    router.push('/');
    router.refresh();
  };
}
