'use client';

import {
  Award,
  CheckCircle,
  Lock,
  MoonStar,
  Shield,
  ShieldCheck,
  Star,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Tier config ─────────────────────────────────────────────────────────── */

const TIERS = [
  { id: 'bronze', label: 'Bronze', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800/50', Icon: Shield },
  { id: 'silver', label: 'Silver', color: 'text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800/40', border: 'border-slate-200 dark:border-slate-700', Icon: ShieldCheck },
  { id: 'gold', label: 'Gold', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950/30', border: 'border-yellow-200 dark:border-yellow-800/50', Icon: Star },
  { id: 'platinum', label: 'Platinum', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-800/50', Icon: Star },
] as const;

const CURRENT_TIER_ID = 'silver';
const PROGRESS_PERCENT = 68;

const TIER_REQUIREMENTS = [
  'Complete 50 more jobs',
  'Maintain a 4.8+ average rating',
  '0 cancellations this calendar month',
];

/* ─── Mock stats ──────────────────────────────────────────────────────────── */

const STATS = [
  { label: 'Jobs Completed', value: '127' },
  { label: 'Average Rating', value: '4.7 ★' },
  { label: 'Acceptance Rate', value: '92%' },
];

/* ─── Earned badges ───────────────────────────────────────────────────────── */

const EARNED_BADGES = [
  { id: 'first-job', name: 'First Job', desc: 'Completed your first booking', Icon: CheckCircle, date: 'Jan 2025' },
  { id: 'five-star', name: '5-Star Streak', desc: '10 consecutive 5-star ratings', Icon: Star, date: 'Feb 2025' },
  { id: 'quick-resp', name: 'Quick Responder', desc: 'Avg response time under 2 min', Icon: Zap, date: 'Mar 2025' },
  { id: 'top-earner', name: 'Top Earner', desc: 'Earned ₨50,000 in a single month', Icon: TrendingUp, date: 'Apr 2025' },
  { id: 'reliable', name: 'Reliable', desc: '0 cancellations in 90 days', Icon: ShieldCheck, date: 'Apr 2025' },
  { id: 'century', name: 'Century Club', desc: '100 jobs completed', Icon: Award, date: 'May 2025' },
];

const LOCKED_BADGES = [
  { id: 'platinum-elite', name: 'Platinum Elite', desc: 'Reach Platinum tier', Icon: Star },
  { id: 'night-owl', name: 'Night Owl', desc: '20 evening jobs completed', Icon: MoonStar },
  { id: 'weekend-warrior', name: 'Weekend Warrior', desc: '30 weekend jobs completed', Icon: Zap },
];

/* ─── Component ───────────────────────────────────────────────────────────── */

export default function BadgePage() {
  const currentTier = TIERS.find((t) => t.id === CURRENT_TIER_ID)!;
  const nextTier = TIERS[TIERS.findIndex((t) => t.id === CURRENT_TIER_ID) + 1];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Badge &amp; Tier</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your current standing and what you&apos;ve earned.</p>
      </div>

      {/* Current tier card */}
      <section className={cn('rounded-xl border p-6 shadow-sm space-y-5', currentTier.bg, currentTier.border)}>
        <div className="flex items-center gap-4">
          <div className={cn('flex h-16 w-16 items-center justify-center rounded-2xl bg-white/60 dark:bg-black/20 shadow-sm', currentTier.color)}>
            <currentTier.Icon className="h-8 w-8" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Current Tier</p>
            <h2 className={cn('text-2xl font-bold', currentTier.color)}>{currentTier.label} Provider</h2>
            <p className="text-sm text-muted-foreground">Top 30% of providers in Karachi</p>
          </div>
        </div>

        {nextTier && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Progress to {nextTier.label}</span>
              <span className="font-semibold text-foreground">{PROGRESS_PERCENT}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/60 dark:bg-black/20">
              <div
                className={cn('h-full rounded-full transition-all', currentTier.color.replace('text-', 'bg-'))}
                style={{ width: `${PROGRESS_PERCENT}%` }}
              />
            </div>
            <div className="space-y-1 pt-1">
              <p className="text-xs font-medium text-muted-foreground">To reach {nextTier.label}:</p>
              <ul className="space-y-0.5">
                {TIER_REQUIREMENTS.map((req) => (
                  <li key={req} className="flex items-start gap-1.5 text-xs text-foreground">
                    <span className="mt-0.5 text-muted-foreground">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4 shadow-sm text-center">
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tier ladder */}
      <section className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
        <h2 className="font-semibold text-foreground">Tier Levels</h2>
        <div className="flex items-center gap-0">
          {TIERS.map((tier, i) => {
            const reached = TIERS.findIndex((t) => t.id === CURRENT_TIER_ID) >= i;
            return (
              <div key={tier.id} className="flex flex-1 flex-col items-center gap-1">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                  reached ? cn(tier.color, 'border-current bg-white dark:bg-card') : 'border-border text-muted-foreground bg-muted',
                )}>
                  <tier.Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <p className={cn('text-xs font-medium', reached ? tier.color : 'text-muted-foreground')}>{tier.label}</p>
                {i < TIERS.length - 1 && (
                  <div className={cn('absolute mt-5 h-0.5 w-full', reached ? 'bg-primary/30' : 'bg-border')} style={{ display: 'none' }} />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Earned badges */}
      <section className="space-y-3">
        <h2 className="font-semibold text-foreground">Earned Badges</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {EARNED_BADGES.map((badge) => (
            <div key={badge.id} className="rounded-xl border bg-primary/5 border-primary/20 p-4 space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <badge.Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{badge.name}</p>
                <p className="text-xs text-muted-foreground leading-snug">{badge.desc}</p>
                <p className="mt-1 text-xs font-medium text-primary">{badge.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Locked badges */}
      <section className="space-y-3">
        <h2 className="font-semibold text-foreground">Locked Badges</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {LOCKED_BADGES.map((badge) => (
            <div key={badge.id} className="relative rounded-xl border bg-card p-4 space-y-2 opacity-40">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <badge.Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{badge.name}</p>
                <p className="text-xs text-muted-foreground leading-snug">{badge.desc}</p>
              </div>
              <div className="absolute right-3 top-3">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
