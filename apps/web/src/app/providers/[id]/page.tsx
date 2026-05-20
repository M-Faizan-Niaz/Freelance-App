import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import {
  getProviderById,
  getAllProviderIds,
} from '@/app/providers/_data/provider-profiles';
import { ProfileHeader } from './_components/profile-header';
import { StatsBar } from './_components/stats-bar';
import { ServicesOffered } from './_components/services-offered';
import { PortfolioGallery } from './_components/portfolio-gallery';
import { AvailabilityCalendar } from './_components/availability-calendar';
import { ReviewsSection } from './_components/reviews-section';
import { BookingSidebar } from './_components/booking-sidebar';

/* ── Types ──────────────────────────────────────────────────── */

type Params = Promise<{ id: string }>;

/* ── Metadata ───────────────────────────────────────────────── */

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const provider = getProviderById(id);
  if (!provider) return {};
  return {
    title: `${provider.name} — ${provider.category} | HirePro`,
    description: provider.bio,
  };
}

export function generateStaticParams() {
  return getAllProviderIds().map((id) => ({ id }));
}

/* ── Page ───────────────────────────────────────────────────── */

export default async function ProviderProfilePage({ params }: { params: Params }) {
  const { id } = await params;
  const provider = getProviderById(id);
  if (!provider) notFound();

  const { availability, ...providerWithoutAvailability } = provider as typeof provider & {
    availability: import('@/app/providers/_data/provider-profiles').AvailabilityDay[];
  };

  return (
    /* pb-20 leaves room for the mobile bottom bar */
    <main className="pb-20 lg:pb-0">
      {/* ── Breadcrumb ──────────────────────────────────────── */}
      <div className="border-b bg-surface">
        <div className="container mx-auto px-4 py-3 lg:px-6">
          <nav className="flex items-center gap-1 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/services" className="hover:text-foreground transition-colors">Services</Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href={`/services/${provider.categorySlug}`}
              className="hover:text-foreground transition-colors"
            >
              {provider.category}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-foreground">{provider.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:px-6">
        {/* ── 2-col layout ────────────────────────────────── */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">

          {/* ── Left column (main content) ──────────────── */}
          <div className="flex flex-col gap-6 lg:flex-1 min-w-0">

            {/* Profile header */}
            <ProfileHeader provider={provider} />

            {/* Stats bar */}
            <StatsBar provider={provider} />

            {/* Bio */}
            <section className="rounded-xl border bg-card px-5 py-5 shadow-sm">
              <h2 className="mb-3 font-semibold text-foreground">About</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{provider.bio}</p>
            </section>

            {/* Services offered */}
            <ServicesOffered provider={provider} />

            {/* Portfolio gallery */}
            {provider.portfolioImages.length > 0 && (
              <PortfolioGallery images={provider.portfolioImages} />
            )}

            {/* Availability */}
            {availability && <AvailabilityCalendar days={availability} />}

            {/* Reviews */}
            {provider.reviews.length > 0 && <ReviewsSection provider={provider} />}
          </div>

          {/* ── Right column (booking sidebar) ──────────── */}
          <div className="lg:w-80 lg:shrink-0">
            <BookingSidebar provider={provider} />
          </div>
        </div>
      </div>
    </main>
  );
}
