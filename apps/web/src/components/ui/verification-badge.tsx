import * as React from 'react';
import { ShieldCheck, UserCheck, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type VerificationType = 'cnic' | 'background' | 'verified';

const config: Record<VerificationType, { icon: React.ElementType; label: string }> = {
  cnic: { icon: UserCheck, label: 'CNIC Verified' },
  background: { icon: ShieldCheck, label: 'Background Checked' },
  verified: { icon: BadgeCheck, label: 'Verified Pro' },
};

interface VerificationBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  type: VerificationType;
}

export function VerificationBadge({ type, className, ...props }: VerificationBadgeProps) {
  const { icon: Icon, label } = config[type];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700',
        className,
      )}
      {...props}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
