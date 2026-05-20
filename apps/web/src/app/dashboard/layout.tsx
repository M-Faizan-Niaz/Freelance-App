import { cookies } from 'next/headers';
import { SidebarNav } from '@/components/dashboard/sidebar-nav';
import type { NavUser } from '@/components/layout/navbar';

async function getDashboardUser(): Promise<NavUser | null> {
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

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getDashboardUser();

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Desktop sidebar */}
      <SidebarNav user={user} />

      {/* Main content area — offset by sidebar width on desktop */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <main className="flex-1 px-4 py-6 pb-24 lg:px-8 lg:py-8 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <SidebarNav user={user} mobile />
    </div>
  );
}
