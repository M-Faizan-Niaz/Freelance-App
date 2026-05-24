'use client'

import Link from 'next/link'
import { useListServiceCategories } from '@repo/api-client'
import { ServiceCategoryCard } from '@/components/cards/service-category-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CategoriesSection() {
  const { data, isLoading } = useListServiceCategories()
  const categories = data?.data?.filter(c => c.isActive).slice(0, 12) ?? []

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight">Popular Services</h2>
          <p className="text-muted-foreground mt-2">Browse our most booked service categories</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {isLoading
            ? Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))
            : categories.length > 0
            ? categories.map(cat => (
                <ServiceCategoryCard
                  key={cat.id}
                  id={String(cat.id)}
                  name={cat.name}
                  imageUrl={cat.imageUrl}
                  description={cat.description}
                />
              ))
            : Array.from({ length: 12 }).map((_, i) => (
                <Link
                  key={i}
                  href="/services"
                  className="flex flex-col items-center gap-3 p-4 rounded-xl border bg-white hover:border-primary hover:shadow-sm transition-all text-center group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                    —
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Service</p>
                </Link>
              ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link href="/services" className="flex items-center gap-2">
              View All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
