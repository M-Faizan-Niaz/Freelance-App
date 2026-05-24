'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ShieldCheck,
  CreditCard,
  ThumbsUp,
  ArrowLeft,
  CalendarCheck,
  UserCheck,
  Star,
  Wrench,
} from 'lucide-react'
import { useListServiceCategories } from '@repo/api-client'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

const trustFeatures = [
  {
    icon: ShieldCheck,
    title: 'Verified Professionals',
    desc: 'Every provider is background-checked and identity-verified before joining.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    desc: 'Funds are held in escrow and only released once you confirm the job is done.',
  },
  {
    icon: ThumbsUp,
    title: 'Satisfaction Guarantee',
    desc: "Not happy with the service? We'll make it right or give you a refund.",
  },
]

const howItWorks = [
  {
    step: '01',
    icon: CalendarCheck,
    title: 'Choose a Service',
    desc: 'Pick your service category and describe what you need.',
  },
  {
    step: '02',
    icon: UserCheck,
    title: 'Get Matched',
    desc: 'We connect you with nearby verified providers who can help.',
  },
  {
    step: '03',
    icon: Star,
    title: 'Job Done',
    desc: 'Provider arrives, completes the work, and you rate the experience.',
  },
]

export default function ServiceCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const id = String(params.id)

  const { data, isLoading } = useListServiceCategories()
  const category = data?.data?.find(c => String(c.id) === id)

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div>
        {/* Hero skeleton */}
        <div className="relative h-72 bg-muted animate-pulse" />
        <div className="max-w-5xl mx-auto px-4 py-12 space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
          <div className="flex gap-3 mt-6">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
      </div>
    )
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (!category) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Category not found</h1>
        <p className="text-muted-foreground mb-6">
          This service category doesn't exist or may have been removed.
        </p>
        <Button asChild>
          <Link href="/services">Browse All Services</Link>
        </Button>
      </div>
    )
  }

  // ── Page ──────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── Hero ── */}
      <div className="relative h-72 md:h-96 overflow-hidden bg-gray-900">
        {category.imageUrl ? (
          <img
            src={category.imageUrl}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/40" />
        )}
        <div className="relative z-10 h-full flex flex-col justify-end px-4 pb-10 max-w-5xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-white/80 hover:text-white text-sm mb-4 w-fit"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{category.name}</h1>
          {category.description && (
            <p className="text-white/80 text-base md:text-lg max-w-xl">{category.description}</p>
          )}
          <div className="flex flex-wrap gap-3 mt-6">
            <Button size="lg" asChild>
              <Link href={`/bookings/new?categoryId=${category.id}`}>Book Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white" asChild>
              <Link href="/providers">Browse Providers</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Trust features ── */}
        <section className="py-14">
          <h2 className="text-2xl font-bold text-center mb-8">
            Why book {category.name} on ServeEase?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustFeatures.map(f => (
              <Card key={f.title} className="border-0 shadow-sm">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">{f.title}</p>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="py-14 border-t">
          <h2 className="text-2xl font-bold text-center mb-10">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map(s => (
              <div key={s.step} className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <s.icon className="h-7 w-7 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {s.step}
                  </span>
                </div>
                <p className="font-semibold mb-1">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Providers placeholder ── */}
        <section className="py-14 border-t">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {category.name} Professionals
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Placeholder provider cards until providers-by-category API is available */}
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-full mb-1.5" />
                  <Skeleton className="h-3 w-3/4 mb-4" />
                  <Skeleton className="h-8 w-full rounded-lg" />
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Provider listings coming soon.{' '}
            <Link href={`/bookings/new?categoryId=${category.id}`} className="text-primary underline underline-offset-4">
              Book now
            </Link>{' '}
            and we'll match you with the best available pro.
          </p>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="py-14 border-t text-center">
          <h2 className="text-2xl font-bold mb-2">Ready to book {category.name}?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Tell us what you need and we'll match you with a verified professional near you.
          </p>
          <Button size="lg" asChild>
            <Link href={`/bookings/new?categoryId=${category.id}`}>Get Started</Link>
          </Button>
        </section>
      </div>
    </div>
  )
}
