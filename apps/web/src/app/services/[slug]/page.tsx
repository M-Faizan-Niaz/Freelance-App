import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Suspense } from 'react';
import { CATEGORY_MAP } from '../_data/categories';
import { getProvidersBySlug } from '../_data/mock-providers';
import { ServiceFilterBar } from '../_components/service-filter-bar';
import { ProviderList } from '../_components/provider-list';
import { MapToggle } from '../_components/map-toggle';
import { SkeletonCard } from '@/components/ui/skeleton-card';

/* ── Types ──────────────────────────────────────────────────── */

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<Record<string, string | undefined>>;

/* ── Metadata ───────────────────────────────────────────────── */

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORY_MAP[slug];
  if (!category) return {};
  return {
    title: `${category.label} Services — HirePro`,
    description: `Find verified ${category.label.toLowerCase()} professionals near you. ${category.description}`,
  };
}

export function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((slug) => ({ slug }));
}

/* ── Page ───────────────────────────────────────────────────── */

export default async function ServiceSlugPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const category = CATEGORY_MAP[slug];
  if (!category) notFound();

  const providers = getProvidersBySlug(slug, {
    filter: sp.filter,
    minRating: sp.minRating ? parseFloat(sp.minRating) : undefined,
    maxPrice: sp.maxPrice ? parseInt(sp.maxPrice, 10) : undefined,
    sort: sp.sort,
  });

  return (
    <main>
      {/* ── Page header ───────────────────────────────────── */}
      <section className="border-b bg-surface py-8">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Breadcrumb */}
          <nav className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/services" className="hover:text-foreground transition-colors">
              Services
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">{category.label}</span>
          </nav>

          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {category.label} Professionals
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground leading-relaxed">
            {category.description}
          </p>

          {/* Subcategory pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {category.subcategories.map((sub) => (
              <span
                key={sub}
                className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground"
              >
                {sub}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Discovery shell ───────────────────────────────── */}
      <section className="py-8">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Filter bar — client component, needs Suspense for useSearchParams */}
          <div className="mb-6">
            <Suspense fallback={<div className="h-10 animate-pulse rounded-lg bg-muted" />}>
              <ServiceFilterBar resultCount={providers.length} />
            </Suspense>
          </div>

          {/* Map toggle wraps the provider list */}
          <MapToggle>
            <ProviderList providers={providers} />
          </MapToggle>
        </div>
      </section>
    </main>
  );
}
