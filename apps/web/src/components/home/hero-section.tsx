'use client';

import Link from 'next/link';
import { Search, MapPin, ShieldCheck, UserCheck, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PAKISTAN_CITIES } from '@/lib/constants';

const QUICK_LINKS = [
  { label: 'Electrician', href: '/services/electrician' },
  { label: 'Plumber', href: '/services/plumber' },
  { label: 'AC Repair', href: '/services/ac-appliances' },
  { label: 'Cleaning', href: '/services/cleaning' },
  { label: 'Painter', href: '/services/painting' },
  { label: 'Moving', href: '/services/moving' },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'Background Checked' },
  { icon: UserCheck, label: 'Verified CNIC' },
  { icon: Lock, label: 'Secure Payment' },
];

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('Karachi');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (city) params.set('city', city);
    router.push(`/services?${params.toString()}`);
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-blue-700 py-20 lg:py-28">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

      <div className="container relative mx-auto px-4 lg:px-6">
        <div className="mx-auto max-w-2xl text-center">
          {/* Headline */}
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Book Trusted Help —{' '}
            <span className="text-yellow-300">Instantly</span>
          </h1>
          <p className="mt-4 text-base text-white/80 sm:text-lg">
            Verified professionals for home services across Pakistan. Fast, reliable, and secure.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="mt-8 flex flex-col sm:flex-row gap-2 rounded-xl bg-white p-2 shadow-xl"
          >
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                type="text"
                placeholder="What do you need help with?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>

            <div className="h-px sm:h-auto sm:w-px bg-border" />

            <div className="flex items-center gap-2 px-3">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-transparent text-sm text-foreground outline-none cursor-pointer pr-1"
              >
                {PAKISTAN_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <Button type="submit" className="shrink-0 rounded-lg px-6">
              Find Help
            </Button>
          </form>

          {/* Quick-link pills */}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white hover:bg-white/25 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 text-sm text-white/80">
                <Icon className="h-4 w-4 text-green-300" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
