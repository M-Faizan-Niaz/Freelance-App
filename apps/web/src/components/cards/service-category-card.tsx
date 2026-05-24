import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ServiceCategoryCardProps {
  id: string
  name: string
  imageUrl?: string | null
  description?: string | null
  className?: string
}

export function ServiceCategoryCard({
  id,
  name,
  imageUrl,
  description,
  className,
}: ServiceCategoryCardProps) {
  return (
    <Link
      href={`/services/${id}`}
      className={cn(
        'flex flex-col items-center gap-3 p-4 rounded-xl border bg-white hover:border-primary hover:shadow-sm transition-all duration-200 group text-center',
        className,
      )}
    >
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl font-bold text-primary">{name.charAt(0)}</span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium group-hover:text-primary transition-colors">{name}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{description}</p>
        )}
      </div>
    </Link>
  )
}
