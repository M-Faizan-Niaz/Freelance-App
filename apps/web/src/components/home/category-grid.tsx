'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useListServiceCategories } from '@repo/api-client';
import { Skeleton } from '@/components/ui/skeleton';
import { ICON_MAP, COLOR_MAP } from '@/app/services/_data/category-ui';
import { toSlug } from '@/lib/utils';

export function CategoryGrid() {
  const { data, isLoading } = useListServiceCategories();
  const categories = data?.data ?? [];

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
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))
            : categories.map((cat) => {
                const slug = toSlug(cat.name);
                const Icon = ICON_MAP[slug] ?? ICON_MAP.electrician;
                const color = COLOR_MAP[slug] ?? 'bg-muted text-muted-foreground';
                return (
                  <Link
                    key={cat.id}
                    href={`/services/${slug}`}
                    className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-5 text-center shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {cat.name}
                    </p>
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
