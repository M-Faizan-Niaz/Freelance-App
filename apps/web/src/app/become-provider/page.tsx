import type { Metadata } from 'next';
import Link from 'next/link';
import {
  DollarSign,
  Clock,
  ShieldCheck,
  UserPlus,
  BadgeCheck,
  TrendingUp,
  Star,
  Zap,
  Users,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Become a Provider — HirePro',
  description:
    'Join thousands of verified professionals earning on their schedule. Set your rates, choose your hours, and get paid securely.',
};

/* ── Data ─────────────────────────────────────────────────────── */

const BENEFITS = [
  {
    icon: DollarSign,
    title: 'Set Your Own Rates',
    description: 'You decide what to charge. No ceiling, no surprises.',
    color: 'text-green-600 bg-green-100 dark:bg-green-950/40',
  },
  {
    icon: Clock,
    title: 'Work When You Want',
    description: 'Accept jobs that fit your schedule. Full flexibility, every day.',
    color: 'text-primary bg-primary/10',
  },
  {
    icon: ShieldCheck,
    title: 'Get Paid Securely',
    description: 'Payment held in escrow and released right after job completion.',
    color: 'text-orange bg-orange/10',
  },
];

const STEPS = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Sign Up',
    description: 'Create your profile in minutes. Tell us about your skills and experience.',
  },
  {
    number: '02',
    icon: BadgeCheck,
    title: 'Get Verified',
    description: 'Quick CNIC & background check builds trust with customers.',
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Start Earning',
    description: 'Go live, accept job requests, and grow your client base.',
  },
];

const EARNINGS = [
  { category: 'Electrician', monthly: '₨55,000', icon: Zap, color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-950/40' },
  { category: 'Plumber', monthly: '₨45,000', icon: Star, color: 'text-blue-600 bg-blue-100 dark:bg-blue-950/40' },
  { category: 'AC Technician', monthly: '₨60,000', icon: TrendingUp, color: 'text-sky-600 bg-sky-100 dark:bg-sky-950/40' },
  { category: 'Cleaner', monthly: '₨35,000', icon: Star, color: 'text-teal-600 bg-teal-100 dark:bg-teal-950/40' },
  { category: 'Painter', monthly: '₨42,000', icon: Star, color: 'text-purple-600 bg-purple-100 dark:bg-purple-950/40' },
  { category: 'Carpenter', monthly: '₨50,000', icon: Star, color: 'text-amber-600 bg-amber-100 dark:bg-amber-950/40' },
];

const STATS = [
  { value: '5,000+', label: 'Active Providers' },
  { value: '50,000+', label: 'Jobs Completed' },
  { value: '4.8★', label: 'Avg Provider Rating' },
];

/* ── Page ─────────────────────────────────────────────────────── */

export default function BecomeProviderPage() {
  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange/90 to-orange py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_60%)]" />
        <div className="container relative mx-auto px-4 lg:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              <Users className="h-4 w-4" />
              Join 5,000+ professionals already earning
            </div>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              Earn on Your Schedule
            </h1>
            <p className="mt-4 text-lg text-white/85">
              Turn your skills into income. Join HirePro and start getting paid for the work you
              already know how to do.
            </p>

            {/* Stats row */}
            <div className="mt-10 grid grid-cols-3 gap-4 rounded-2xl bg-white/15 p-5 backdrop-blur-sm">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-extrabold">{s.value}</p>
                  <p className="mt-0.5 text-xs text-white/75">{s.label}</p>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              className="mt-8 bg-white text-orange hover:bg-white/90"
              asChild
            >
              <Link href="/auth/register-provider">
                Get Started — It&apos;s Free
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <p className="mt-3 text-xs text-white/70">
              No subscription fees · Keep up to 95% of every job
            </p>
          </div>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Why providers choose HirePro
            </h2>
            <p className="mt-2 text-muted-foreground">Everything you need to run your own business</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className="rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${b.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section className="bg-surface py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">How it works</h2>
            <p className="mt-2 text-muted-foreground">From sign-up to first paycheck in days</p>
          </div>

          <div className="relative grid gap-8 sm:grid-cols-3">
            <div className="hidden sm:block absolute top-8 left-[calc(33%+2rem)] right-[calc(33%+2rem)] h-px bg-border" aria-hidden />

            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex flex-col items-center gap-4 text-center">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-4 ring-background">
                    <Icon className="h-7 w-7 text-primary" />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {step.number}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                    <p className="max-w-xs text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Earnings by Category ─────────────────────────────── */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Average monthly earnings
            </h2>
            <p className="mt-2 text-muted-foreground">
              Top performers earn significantly more — your income grows with your reputation
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EARNINGS.map((e) => {
              const Icon = e.icon;
              return (
                <div
                  key={e.category}
                  className="flex items-center gap-4 rounded-xl border bg-card px-5 py-4 shadow-sm"
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${e.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{e.category}</p>
                    <p className="text-lg font-extrabold text-orange">{e.monthly}</p>
                    <p className="text-xs text-muted-foreground">average per month</p>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Based on platform data from verified providers. Individual earnings vary.
          </p>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────── */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center lg:px-6">
          <h2 className="text-3xl font-extrabold">Ready to start earning?</h2>
          <p className="mt-3 text-primary-foreground/80">
            Join thousands of skilled professionals across Pakistan.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 min-w-44"
              asChild
            >
              <Link href="/auth/register-provider">Apply Now</Link>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-primary-foreground hover:bg-white/10 hover:text-primary-foreground min-w-44"
              asChild
            >
              <Link href="/how-it-works">Learn more</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
