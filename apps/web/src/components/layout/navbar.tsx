import { cookies } from 'next/headers';
import { NavbarClient } from './navbar-client';

export type NavUser = {
  name: string;
  email: string;
  image?: string | null;
};

async function getServerUser(): Promise<NavUser | null> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
      .join('; ');

    // Skip the fetch entirely if no session token is present
    if (!cookieStore.has('better-auth.session_token')) return null;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.viteplusmono.test';
    const res = await fetch(`${apiUrl}/v1/api/auth/get-session`, {
      headers: { cookie: cookieHeader },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const data = await res.json() as { user?: NavUser } | null;
    return data?.user ?? null;
  } catch {
    return null;
  }
}

export async function Navbar() {
  const user = await getServerUser();
  return <NavbarClient user={user} />;
}
