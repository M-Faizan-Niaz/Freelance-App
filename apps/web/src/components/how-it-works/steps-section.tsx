import Link from 'next/link';
import {
  Search,
  CalendarCheck,
  MapPin,
  CheckCircle,
  Star,
  UserPlus,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ─── Customer journey ─────────────────────────────────────── */

const CUSTOMER_STEPS = [
  {
    icon: Search,
    title: 'Browse Services',
    description:
      'Search by category or describe what you need. Filter by city, rating, price, and availability.',
  },
  {
    icon: CalendarCheck,
    title: 'Book Instantly',
    description:
      'Choose your preferred professional, pick a date and time slot, and confirm your booking in seconds.',
  },
  {
    icon: MapPin,
    title: 'Provider Arrives',
    description:
      'Track your provider in real time on the map. Chat directly if you need to share extra details.',
  },
  {
    icon: CheckCircle,
    title: 'Job Done',
    description:
      'Your provider completes the work and marks the job as done. You confirm before payment is released.',
  },
  {
    icon: Star,
    title: 'Pay & Review',
    description:
      'Payment is released from escrow automatically. Leave a rating to help the community.',
  },
];

/* ─── Provider journey ─────────────────────────────────────── */

const PROVIDER_STEPS = [
  {
    icon: UserPlus,
    title: 'Sign Up',
    description: 'Create your profile, set your services, rates, and service area.',
  },
  {
    icon: ShieldCheck,
    title: 'Get Verified',
    description: 'Upload your CNIC and documents. Our team reviews and approves within 48 hours.',
  },
  {
    icon: TrendingUp,
    title: 'Start Earning',
    description: 'Go online, accept jobs, and receive secure payouts directly to your account.',
  },
];

/* ─── Component ────────────────────────────────────────────── */

export function StepsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-5 lg:gap-12">
          {/* Customer Journey — takes 3 of 5 cols on desktop */}
          <div className="lg:col-span-3">
            <div className="mb-10">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                For Customers
              </span>
              <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
                Get help in 5 easy steps
              </h2>
              <p className="mt-2 text-muted-foreground">
                From browsing to booking to paying — everything happens inside HirePro.
              </p>
            </div>

            <ol className="relative space-y-0">
              {CUSTOMER_STEPS.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === CUSTOMER_STEPS.length - 1;
                return (
                  <li key={step.title} className="relative flex gap-5">
                    {/* Timeline spine */}
                    <div className="flex flex-col items-center">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      {!isLast && <div className="mt-1 w-px flex-1 bg-border" />}
                    </div>

                    {/* Content */}
                    <div className={isLast ? 'pb-0 pt-1.5' : 'pb-8 pt-1.5'}>
                      <p className="text-sm font-semibold text-foreground">{step.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <Button className="mt-10" size="lg" asChild>
              <Link href="/services">Book a Service Now</Link>
            </Button>
          </div>

          {/* Provider Journey — takes 2 of 5 cols on desktop */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10 p-7 h-full flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-widest text-orange">
                For Professionals
              </span>
              <h3 className="mt-2 text-xl font-bold text-foreground">Want to earn?</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Join thousands of professionals already earning on HirePro.
              </p>

              <ol className="mt-8 space-y-6 flex-1">
                {PROVIDER_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <li key={step.title} className="flex items-start gap-4">
                      <div className="relative flex shrink-0 flex-col items-center">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange/10 text-orange">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange text-[9px] font-bold text-white">
                          {index + 1}
                        </span>
                      </div>
                      <div className="pt-1">
                        <p className="text-sm font-semibold text-foreground">{step.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>

              <Button
                className="mt-8 w-full bg-orange font-semibold text-orange-foreground hover:bg-orange/90"
                asChild
              >
                <Link href="/become-provider">Get Started as a Provider</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
