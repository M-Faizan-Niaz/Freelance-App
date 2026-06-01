'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface NavItem {
  href: string
  icon: React.ElementType
  label: string
  exact?: boolean
  badge?: string
}

export interface NavGroup {
  label?: string
  items: NavItem[]
}

interface AppSidebarProps {
  items?: NavItem[]
  groups?: NavGroup[]
  header?: string
  variant?: 'light' | 'dark'
}

function isItemActive(item: NavItem, pathname: string) {
  return item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(item.href + '/')
}

export function AppSidebar({ items, groups, header, variant = 'light' }: AppSidebarProps) {
  const pathname = usePathname()
  const isDark = variant === 'dark'

  const resolvedGroups: NavGroup[] = groups ?? (items ? [{ items }] : [])

  // Auto-expand whichever groups contain the active route; ungrouped items always show
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(
      resolvedGroups.map((g, i) => [
        i,
        g.label ? !g.items.some((item) => isItemActive(item, pathname)) : false,
      ]),
    ),
  )

  function toggleGroup(i: number) {
    setCollapsed((prev) => ({ ...prev, [i]: !prev[i] }))
  }

  function renderItem(item: NavItem) {
    const active = isItemActive(item, pathname)
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
          isDark
            ? active
              ? 'bg-primary text-white'
              : 'text-white/60 hover:bg-white/10 hover:text-white'
            : active
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary text-white leading-none">
            {item.badge}
          </span>
        )}
        {active && !item.badge && <ChevronRight className="h-3 w-3 opacity-60" />}
      </Link>
    )
  }

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
          {resolvedGroups.map((group, i) => (
            <div key={i}>
              {group.label ? (
                <>
                  <button
                    type="button"
                    onClick={() => toggleGroup(i)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-widest transition-colors select-none',
                      isDark
                        ? 'text-white/40 hover:text-white/60 hover:bg-white/5'
                        : 'text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/50',
                    )}
                  >
                    {group.label}
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 transition-transform duration-200',
                        collapsed[i] ? '-rotate-90' : 'rotate-0',
                      )}
                    />
                  </button>
                  {!collapsed[i] && (
                    <div className="mt-1 mb-2 space-y-1">
                      {group.items.map(renderItem)}
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-1">{group.items.map(renderItem)}</div>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  )
}
