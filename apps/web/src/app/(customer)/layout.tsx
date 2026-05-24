import { Navbar } from '@/components/layout/navbar'
import { SidebarCustomer } from '@/components/layout/sidebar-customer'

export const dynamic = 'force-dynamic'

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="flex max-w-[1400px] mx-auto">
        <SidebarCustomer />
        <main className="flex-1 p-6 min-w-0">{children}</main>
      </div>
    </div>
  )
}
