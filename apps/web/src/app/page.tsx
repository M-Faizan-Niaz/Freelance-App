import { HeroSection } from '@/components/home/hero-section';
import { CategoryGrid } from '@/components/home/category-grid';
import { StatsStrip } from '@/components/home/stats-strip';
import { HowItWorksStrip } from '@/components/home/how-it-works-strip';
import { FeaturedProviders } from '@/components/home/featured-providers';
import { Testimonials } from '@/components/home/testimonials';
import { AppDownloadBanner } from '@/components/home/app-download-banner';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <CategoryGrid />
      <StatsStrip />
      <HowItWorksStrip />
      <FeaturedProviders />
      <Testimonials />
      <AppDownloadBanner />
    </main>
  );
}
