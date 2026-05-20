import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProviderCard, type ProviderCardData } from '@/components/provider/provider-card';

const MOCK_PROVIDERS: ProviderCardData[] = [
  {
    id: '1',
    name: 'Ahmed Raza',
    category: 'Electrician',
    rating: 4.9,
    reviewCount: 124,
    startingPrice: 800,
    city: 'Karachi',
    responseTime: '15 min',
    tier: 'gold',
    isVerified: true,
    isOnline: true,
  },
  {
    id: '2',
    name: 'Bilal Khan',
    category: 'Plumber',
    rating: 4.7,
    reviewCount: 87,
    startingPrice: 600,
    city: 'Lahore',
    responseTime: '20 min',
    tier: 'silver',
    isVerified: true,
    isOnline: false,
  },
  {
    id: '3',
    name: 'Sara Ali',
    category: 'Cleaning',
    rating: 4.8,
    reviewCount: 211,
    startingPrice: 1200,
    city: 'Islamabad',
    responseTime: '10 min',
    tier: 'gold',
    isVerified: true,
    isOnline: true,
  },
  {
    id: '4',
    name: 'Usman Tariq',
    category: 'AC & Appliances',
    rating: 4.6,
    reviewCount: 63,
    startingPrice: 1000,
    city: 'Karachi',
    responseTime: '30 min',
    tier: 'bronze',
    isVerified: true,
    isOnline: false,
  },
];

export function FeaturedProviders() {
  return (
    <section className="py-16 bg-surface">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Top Professionals</h2>
            <p className="mt-1 text-muted-foreground">
              Highly rated providers ready to help today
            </p>
          </div>
          <Link
            href="/services"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            See all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_PROVIDERS.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/services"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            See all providers <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
