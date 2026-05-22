import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ListServiceCategories200DataItem } from '@repo/api-client';
import { ICON_MAP, COLOR_MAP } from '../_data/category-ui';
import { toSlug } from '@/lib/utils';

interface CategoryCardProps {
  category: ListServiceCategories200DataItem;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const slug = toSlug(category.name);
  const Icon = ICON_MAP[slug] ?? ICON_MAP.electrician;
  const iconColor = COLOR_MAP[slug] ?? 'bg-muted text-muted-foreground';

  return (
    <Link
      href={`/services/${slug}`}
      className="group flex flex-col gap-5 rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20"
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${iconColor}`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          {category.description && (
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
              {category.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs font-medium text-primary mt-auto">
        Browse {category.name} professionals
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
