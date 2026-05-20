import Link from 'next/link';
import {
  Zap,
  Droplets,
  Wind,
  Sparkles,
  Brush,
  Truck,
  Hammer,
  Trees,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import type { CategoryMeta } from '../_data/categories';

const ICON_MAP: Record<string, LucideIcon> = {
  electrician: Zap,
  plumber: Droplets,
  'ac-appliances': Wind,
  cleaning: Sparkles,
  painting: Brush,
  moving: Truck,
  carpenter: Hammer,
  outdoor: Trees,
};

const COLOR_MAP: Record<string, string> = {
  electrician: 'bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100',
  plumber: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
  'ac-appliances': 'bg-sky-50 text-sky-600 group-hover:bg-sky-100',
  cleaning: 'bg-green-50 text-green-600 group-hover:bg-green-100',
  painting: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100',
  moving: 'bg-orange-50 text-orange-600 group-hover:bg-orange-100',
  carpenter: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
  outdoor: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100',
};

interface CategoryCardProps {
  category: CategoryMeta;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = ICON_MAP[category.slug] ?? Zap;
  const iconColor = COLOR_MAP[category.slug] ?? 'bg-muted text-muted-foreground';

  return (
    <Link
      href={`/services/${category.slug}`}
      className="group flex flex-col gap-5 rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20"
    >
      {/* Icon + title */}
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${iconColor}`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {category.label}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
            {category.description}
          </p>
        </div>
      </div>

      {/* Subcategory pills */}
      <div className="flex flex-wrap gap-1.5">
        {category.subcategories.slice(0, 4).map((sub) => (
          <span
            key={sub}
            className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
          >
            {sub}
          </span>
        ))}
        {category.subcategories.length > 4 && (
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
            +{category.subcategories.length - 4} more
          </span>
        )}
      </div>

      {/* CTA row */}
      <div className="flex items-center gap-1 text-xs font-medium text-primary mt-auto">
        Browse {category.label} professionals
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
