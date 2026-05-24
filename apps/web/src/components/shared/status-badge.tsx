import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type Status =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'approved'
  | 'rejected'
  | 'suspended'
  | 'banned'

const statusConfig: Record<Status, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  confirmed: { label: 'Confirmed', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  in_progress: { label: 'In Progress', className: 'bg-orange-100 text-orange-800 border-orange-200' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800 border-red-200' },
  approved: { label: 'Approved', className: 'bg-green-100 text-green-800 border-green-200' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800 border-red-200' },
  suspended: { label: 'Suspended', className: 'bg-orange-100 text-orange-800 border-orange-200' },
  banned: { label: 'Banned', className: 'bg-red-100 text-red-800 border-red-200' },
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status as Status] ?? {
    label: status,
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  }

  return (
    <Badge
      variant="outline"
      className={cn('font-medium capitalize', config.className, className)}
    >
      {config.label}
    </Badge>
  )
}
