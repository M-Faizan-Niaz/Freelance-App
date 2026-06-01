'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  MapPin,
  Star,
  Briefcase,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Images,
} from 'lucide-react'
import {
  useGetServiceProviderById,
  useListServiceProviderPortfolio,
  useGetMe,
  useCreateOrGetConversation,
} from '@repo/api-client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

const ROLE_PROVIDER = 2

export default function ProviderProfilePage() {
  const params = useParams()
  const router = useRouter()
  const providerId = Number(params.id)

  const { data: providerData, isLoading } = useGetServiceProviderById(providerId)
  const provider = providerData?.data

  const { data: portfolioData } = useListServiceProviderPortfolio(providerId)
  const portfolio = portfolioData?.data ?? []

  const { data: meData } = useGetMe()
  const roleId = meData?.data?.roleId
  const isLoggedIn = !!meData?.data
  const isCustomer = isLoggedIn && roleId !== ROLE_PROVIDER

  const { mutate: startChat, isPending: starting } = useCreateOrGetConversation({
    mutation: {
      onSuccess: (data) => {
        router.push(`/messages?c=${data.data.id}`)
      },
      onError: () => toast.error('Could not start conversation. Please try again.'),
    },
  })

  function handleMessage() {
    if (!isLoggedIn) {
      router.push(`/auth/sign-in?callbackUrl=/providers/${providerId}`)
      return
    }
    startChat({ data: { providerId } })
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-5">
        <Skeleton className="h-5 w-28" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="font-semibold text-lg">Provider not found</p>
        <Button asChild className="mt-6" variant="outline">
          <Link href="/providers">Browse Providers</Link>
        </Button>
      </div>
    )
  }

  const rating = provider.averageRating ? parseFloat(provider.averageRating) : null

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-5">
      {/* Back */}
      <Link
        href="/providers"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All Providers
      </Link>

      {/* Hero */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-2xl font-bold text-primary">
              {provider.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="text-xl font-bold">{provider.fullName}</h1>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="secondary">{provider.tierName}</Badge>
                    {provider.isCnicVerified && (
                      <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span className={`w-2 h-2 rounded-full ${provider.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
                      {provider.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>

                {/* Message button */}
                {isCustomer ? (
                  <Button onClick={handleMessage} disabled={starting} className="shrink-0">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {starting ? 'Opening…' : 'Message Provider'}
                  </Button>
                ) : !isLoggedIn ? (
                  <Button onClick={handleMessage} variant="outline" className="shrink-0">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Login to Contact
                  </Button>
                ) : null}
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                {rating !== null && (
                  <span className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{rating.toFixed(1)}</span>
                  </span>
                )}
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  {provider.totalJobsCompleted} jobs done
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  Rs. {provider.hourlyRate}/hr
                </span>
                {provider.city && (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {provider.city}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {provider.bio && (
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed border-t pt-4">
              {provider.bio}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Portfolio */}
      {portfolio.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
              <Images className="h-4 w-4" /> Portfolio
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {portfolio.map(item => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square rounded-lg overflow-hidden bg-muted hover:opacity-90 transition-opacity"
                >
                  <img
                    src={item.url}
                    alt={item.fileName}
                    className="w-full h-full object-cover"
                  />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Book CTA */}
      <div className="text-center pt-2">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href={`/bookings/new`}>Book This Provider</Link>
        </Button>
      </div>
    </div>
  )
}
