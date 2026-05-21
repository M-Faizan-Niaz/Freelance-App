import Link from 'next/link';
import { ArrowRight, Zap, Droplets, Wind, Sparkles, Brush, Truck, Hammer, Trees } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CATEGORIES } from '@/app/services/_data/categories';

const CATEGORY_UI: Record<string, { icon: LucideIcon; count: number; color: string }> = {
  electrician:   { icon: Zap,      count: 12, color: 'bg-yellow-50 text-yellow-600' },
  plumber:       { icon: Droplets, count: 9,  color: 'bg-blue-50 text-blue-600' },
  'ac-appliances': { icon: Wind,   count: 8,  color: 'bg-sky-50 text-sky-600' },
  cleaning:      { icon: Sparkles, count: 13, color: 'bg-green-50 text-green-600' },
  painting:      { icon: Brush,    count: 6,  color: 'bg-purple-50 text-purple-600' },
  moving:        { icon: Truck,    count: 7,  color: 'bg-orange-50 text-orange-600' },
  carpenter:     { icon: Hammer,   count: 10, color: 'bg-amber-50 text-amber-600' },
  outdoor:       { icon: Trees,    count: 5,  color: 'bg-emerald-50 text-emerald-600' },
};

const GRID_CATEGORIES = CATEGORIES.map((cat) => ({
  ...CATEGORY_UI[cat.slug],
  label: cat.label,
  href: `/services/${cat.slug}`,
}));

export function CategoryGrid() {
  return (
    <section className="py-16 bg-surface">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Browse Services</h2>
            <p className="mt-1 text-muted-foreground">
              Find the right professional for any home task
            </p>
          </div>
          <Link
            href="/services"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {GRID_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-5 text-center shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {cat.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{cat.count} services</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/services"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
