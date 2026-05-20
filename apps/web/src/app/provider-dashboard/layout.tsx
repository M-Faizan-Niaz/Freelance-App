import { cookies } from 'next/headers';
import { ProviderSidebarNav } from '@/components/provider-dashboard/provider-sidebar-nav';
import type { NavUser } from '@/components/layout/navbar';

async function getProviderUser(): Promise<NavUser | null> {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.has('better-auth.session_token')) return null;

    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
      .join('; ');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.viteplusmono.test';
    const res = await fetch(`${apiUrl}/v1/api/auth/get-session`, {
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

export default async function ProviderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getProviderUser();

  return (
    <div className="flex min-h-screen bg-surface">
      <ProviderSidebarNav user={user} />

      <div className="flex flex-1 flex-col lg:pl-64">
        <main className="flex-1 px-4 py-6 pb-24 lg:px-8 lg:py-8 lg:pb-8">
          {children}
        </main>
      </div>

      <ProviderSidebarNav user={user} mobile />
    </div>
  );
}
