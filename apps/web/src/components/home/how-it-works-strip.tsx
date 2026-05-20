import Link from 'next/link';
import { Search, UserCheck, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STEPS = [
  {
    number: '01',
    icon: Search,
    title: 'Pick a Service',
    description: 'Browse categories and describe your task. Tell us what you need and when.',
  },
  {
    number: '02',
    icon: UserCheck,
    title: 'Get Matched',
    description: 'Choose from verified professionals near you. See ratings, reviews, and prices.',
  },
  {
    number: '03',
    icon: BadgeCheck,
    title: 'Done & Paid',
    description: 'Your payment is held in escrow and released only when the job is complete.',
  },
];

export function HowItWorksStrip() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">How It Works</h2>
          <p className="mt-2 text-muted-foreground">Get help in three simple steps</p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 relative">
          {/* Connector line (desktop only) */}
          <div
            className="hidden sm:block absolute top-8 left-1/3 right-1/3 h-px bg-border"
            aria-hidden
          />

          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative flex flex-col items-center text-center gap-4">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-4 ring-background">
                  <Icon className="h-7 w-7 text-primary" />
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {step.number}
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Button size="lg" asChild>
            <Link href="/services">Book Now</Link>
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            No commitment until you confirm a booking
          </p>
        </div>
      </div>
    </section>
  );
}
