import { SidebarNav } from '@/components/dashboard/sidebar-nav';
import { getServerSession } from '@/lib/server-auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerSession();

  return (
    <div className="flex min-h-screen bg-surface">
      <SidebarNav user={user} />

      <div className="flex flex-1 flex-col lg:pl-64">
        <main className="flex-1 px-4 py-6 pb-24 lg:px-8 lg:py-8 lg:pb-8">
          {children}
        </main>
      </div>

      <SidebarNav user={user} mobile />
    </div>
  );
}
