import { Navbar } from '@/components/layout/navbar'
import { SidebarProvider } from '@/components/layout/sidebar-provider'
import { ProviderGuard } from '@/components/shared/provider-guard'

export const dynamic = 'force-dynamic'

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProviderGuard>
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <div className="flex max-w-[1400px] mx-auto">
          <SidebarProvider />
          <main className="flex-1 p-6 min-w-0">{children}</main>
        </div>
      </div>
    </ProviderGuard>
  )
}
