'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface NavItem {
  href: string
  icon: React.ElementType
  label: string
  exact?: boolean
}

interface AppSidebarProps {
  items: NavItem[]
  header?: string
  variant?: 'light' | 'dark'
}

export function AppSidebar({ items, header, variant = 'light' }: AppSidebarProps) {
  const pathname = usePathname()
  const isDark = variant === 'dark'

  return (
    <aside
      className={cn(
        'hidden md:flex w-60 shrink-0 flex-col border-r h-[calc(100vh-64px)] sticky top-16',
        isDark ? 'bg-gray-950 text-white' : 'bg-white',
      )}
    >
      {header && (
        <div className={cn('px-4 py-3 border-b', isDark ? 'border-white/10' : '')}>
          <p
            className={cn(
              'text-xs font-semibold uppercase tracking-wider',
              isDark ? 'text-white/50' : 'text-muted-foreground',
            )}
          >
            {header}
          </p>
        </div>
      )}
      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-1">
          {items.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isDark
                    ? isActive
                      ? 'bg-primary text-white'
                      : 'text-white/60 hover:bg-white/10 hover:text-white'
                    : isActive
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
