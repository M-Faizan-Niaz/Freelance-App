import { cookies } from 'next/headers';
import { API_BASE_URL } from './constants';
import type { NavUser } from './types';

export async function getServerSession(): Promise<NavUser | null> {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.has('better-auth.session_token')) return null;

    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
      .join('; ');

    const res = await fetch(`${API_BASE_URL}/v1/api/auth/get-session`, {
      headers: { cookie: cookieHeader },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { user?: NavUser } | null;
    return data?.user ?? null;
  } catch {
    return null;
  }
}
