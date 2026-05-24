import Link from 'next/link'
import { Search, Shield, Star, Clock, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CategoriesSection } from '@/components/sections/categories-section'

export const dynamic = 'force-dynamic'

const howItWorksSteps = [
  {
    step: '01',
    title: 'Browse Services',
    description: 'Search from 50+ service categories. Find verified professionals near you.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Book Instantly',
    description: 'Choose your provider, pick a time slot, and confirm your booking in minutes.',
    icon: Clock,
  },
  {
    step: '03',
    title: 'Service Done',
    description: 'Your provider arrives on time. Pay securely after the job is complete.',
    icon: CheckCircle,
  },
]

const trustStats = [
  { value: '5,000+', label: 'Verified Providers' },
  { value: '50,000+', label: 'Jobs Completed' },
  { value: '4.8★', label: 'Average Rating' },
  { value: '98%', label: 'Satisfaction Rate' },
]


export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary/90 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
            Book trusted services{' '}
            <span className="text-white/90">near you</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            From cleaning to plumbing, electricians to carpenters — find verified professionals in your city, available today.
          </p>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="What service do you need?"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-foreground bg-white border-0 outline-none text-sm"
              />
            </div>
            <Button size="lg" className="rounded-xl px-6 shrink-0" asChild>
              <Link href="/services">Search</Link>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/10 bg-transparent" asChild>
              <Link href="/services">Browse All Services</Link>
            </Button>
            <Button variant="ghost" className="rounded-full text-white hover:bg-white/10" asChild>
              <Link href="/auth/sign-up" className="flex items-center gap-2">
                Become a Provider <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="border-b bg-white py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {trustStats.map(stat => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories — live from API */}
      <CategoriesSection />

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="text-muted-foreground mt-2">Get any service done in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksSteps.map(step => (
              <div key={step.step} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="text-xs font-bold text-primary/60 tracking-widest mb-2">
                  STEP {step.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-10">Why Choose ServeEase?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Verified Providers', desc: 'Every provider is CNIC-verified and background checked before joining.' },
              { icon: Star, title: 'Rated & Reviewed', desc: 'Read real reviews from real customers before booking.' },
              { icon: CheckCircle, title: 'Secure Payments', desc: 'Your payment is safe. Only released after you confirm job completion.' },
            ].map(item => (
              <div key={item.title} className="p-6 rounded-xl border bg-white text-left">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to earn on your own terms?</h2>
          <p className="text-white/80 mb-8">
            Join thousands of verified service providers and start receiving jobs in your city today.
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-xl px-8" asChild>
            <Link href="/auth/sign-up">Become a Provider — It&apos;s Free</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
