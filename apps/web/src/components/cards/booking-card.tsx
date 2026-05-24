import Link from 'next/link'
import { Calendar, MapPin, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'

interface BookingCardProps {
  id: string
  categoryName?: string
  providerName?: string
  scheduledAt: string
  address?: string
  status: string
  href?: string
}

export function BookingCard({
  id,
  categoryName,
  providerName,
  scheduledAt,
  address,
  status,
  href,
}: BookingCardProps) {
  const link = href ?? `/bookings/${id}`

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-medium text-sm">{categoryName ?? 'Service Booking'}</h3>
              <StatusBadge status={status} />
            </div>

            {providerName && (
              <p className="text-xs text-muted-foreground mt-1">with {providerName}</p>
            )}

            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 shrink-0" />
                <span>{new Date(scheduledAt).toLocaleDateString('en-PK', {
                  weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}</span>
              </div>

              {address && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{address}</span>
                </div>
              )}
            </div>
          </div>

          <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" asChild>
            <Link href={link}>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
