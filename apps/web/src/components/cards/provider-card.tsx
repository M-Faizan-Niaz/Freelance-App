import Link from 'next/link'
import { Star, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ProviderCardProps {
  id: string
  name: string
  category?: string
  photoUrl?: string | null
  rating?: number
  reviewCount?: number
  location?: string
}

export function ProviderCard({
  id,
  name,
  category,
  photoUrl,
  rating,
  reviewCount,
  location,
}: ProviderCardProps) {
  return (
    <Card className="group hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 shrink-0 ring-2 ring-border">
            <AvatarImage src={photoUrl ?? undefined} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
              {name}
            </h3>

            {category && (
              <Badge variant="secondary" className="mt-1 text-xs">
                {category}
              </Badge>
            )}

            {location && (
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{location}</span>
              </div>
            )}

            {rating !== undefined && (
              <div className="flex items-center gap-1 mt-1.5">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                {reviewCount !== undefined && (
                  <span className="text-xs text-muted-foreground">({reviewCount})</span>
                )}
              </div>
            )}
          </div>
        </div>

        <Button className="w-full mt-4" size="sm" asChild>
          <Link href={`/providers/${id}`}>View Profile</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
