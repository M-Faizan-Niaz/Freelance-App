'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Bell,
  User,
  FileText,
  Images,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

const navItems = [
  { href: '/provider/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/provider/bookings', icon: BookOpen, label: 'My Jobs' },
  { href: '/provider/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/provider/notifications', icon: Bell, label: 'Notifications' },
  { href: '/provider/profile', icon: User, label: 'Profile' },
  { href: '/provider/documents', icon: FileText, label: 'Verification' },
  { href: '/provider/portfolio', icon: Images, label: 'Portfolio' },
]

export function SidebarProvider() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r bg-white h-[calc(100vh-64px)] sticky top-16">
      <div className="px-4 py-3 border-b">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Provider Mode
        </p>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-1">
          {navItems.map(item => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="h-3 w-3 opacity-60" />}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
    </aside>
  )
}
