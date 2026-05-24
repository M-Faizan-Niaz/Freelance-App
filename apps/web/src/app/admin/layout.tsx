import { SidebarAdmin } from '@/components/layout/sidebar-admin'
import { Navbar } from '@/components/layout/navbar'

export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex max-w-[1400px] mx-auto">
        <SidebarAdmin />
        <main className="flex-1 p-6 min-w-0">{children}</main>
      </div>
    </div>
  )
}
