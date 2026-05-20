import type { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { CATEGORIES } from './_data/categories';
import { CategoryCard } from './_components/category-card';

export const metadata: Metadata = {
  title: 'All Services — HirePro',
  description:
    'Browse all home service categories available on HirePro — electricians, plumbers, cleaners, painters, and more across Pakistan.',
};

type SearchParams = Promise<{ q?: string }>;

export default async function ServicesPage({ searchParams }: { searchParams: SearchParams }) {
  const { q } = await searchParams;

  const filtered = q
    ? CATEGORIES.filter(
        (c) =>
          c.label.toLowerCase().includes(q.toLowerCase()) ||
          c.subcategories.some((s) => s.toLowerCase().includes(q.toLowerCase())),
      )
    : CATEGORIES;

  return (
    <main>
      {/* ── Page header ─────────────────────────────────────── */}
      <section className="border-b bg-surface py-10">
        <div className="container mx-auto px-4 lg:px-6">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">All Services</h1>
          <p className="mt-1 text-muted-foreground">
            {CATEGORIES.length} service categories · Pakistan-wide
          </p>

          {/* Search bar */}
          <div className="mt-5 flex max-w-md items-center gap-2 rounded-lg border bg-background px-3 shadow-sm focus-within:ring-2 focus-within:ring-ring">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <form method="GET" className="flex-1">
              <input
                name="q"
                defaultValue={q}
                type="text"
                placeholder="Search services (e.g. painting, AC repair…)"
                className="h-10 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
            </form>
            {q && (
              <Link
                href="/services"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Category grid ───────────────────────────────────── */}
      <section className="py-10">
        <div className="container mx-auto px-4 lg:px-6">
          {q && (
            <p className="mb-5 text-sm text-muted-foreground">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{q}&rdquo;
            </p>
          )}

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((category) => (
                <CategoryCard key={category.slug} category={category} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="font-semibold text-foreground">No services found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different search term.{' '}
                <Link href="/services" className="text-primary hover:underline">
                  Browse all
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
