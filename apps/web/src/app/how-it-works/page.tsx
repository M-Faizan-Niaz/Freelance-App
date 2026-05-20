import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StepsSection } from '@/components/how-it-works/steps-section';
import { TrustSection } from '@/components/how-it-works/trust-section';
import { FaqSection } from '@/components/how-it-works/faq-section';

export const metadata: Metadata = {
  title: 'How It Works — HirePro',
  description:
    'Learn how HirePro connects you with verified home service professionals in Pakistan. Simple, safe, and done right.',
};

const HERO_HIGHLIGHTS = [
  'No upfront payment',
  'Verified professionals only',
  'Cancel anytime before arrival',
];

export default function HowItWorksPage() {
  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary/90 via-primary to-blue-700 py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center lg:px-6">
          <span className="inline-block rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white/90">
            How It Works
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Simple.{' '}
            <span className="text-yellow-300">Safe.</span>{' '}
            Done.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/80 sm:text-lg">
            HirePro connects you with background-checked professionals for any home task — all
            through one secure, easy-to-use platform.
          </p>

          <ul className="mt-7 flex flex-wrap justify-center gap-4">
            {HERO_HIGHLIGHTS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white"
              >
                <CheckCircle className="h-4 w-4 text-green-300 shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" className="bg-white text-primary font-semibold hover:bg-white/90" asChild>
              <Link href="/services">Book a Service</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20"
              asChild
            >
              <Link href="/become-provider">Become a Provider</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Customer + Provider Journey ───────────────────────── */}
      <StepsSection />

      {/* ── Trust Pillars ─────────────────────────────────────── */}
      <TrustSection />

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <FaqSection />

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-primary to-blue-700 px-8 py-14 text-center shadow-xl">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/75">
              Whether you need help at home or want to earn on your own schedule — HirePro has you
              covered.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-white font-semibold text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/services">Book Now</Link>
              </Button>
              <Button
                size="lg"
                className="bg-orange font-semibold text-orange-foreground hover:bg-orange/90"
                asChild
              >
                <Link href="/become-provider">Earn with Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
