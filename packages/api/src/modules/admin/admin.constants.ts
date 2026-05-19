export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  INFO_REQUESTED: 'info_requested',
} as const;

export const USER_ACTION = {
  SUSPEND: 'suspend',
  BAN: 'ban',
  UNSUSPEND: 'unsuspend',
  APPROVE_PROVIDER: 'approve_provider',
  REJECT_PROVIDER: 'reject_provider',
  FLAG_FRAUD: 'flag_fraud',
} as const;

export const FRAUD_ACTION = {
  INVESTIGATE: 'investigate',
  SUSPEND: 'suspend',
  CLEAR: 'clear',
} as const;

export const CUSTOMER_STATUS = {
  ACTIVE: 'active',
  BLOCKED: 'blocked',
} as const;

export const PAYOUT_STATUS = {
  REQUESTED: 'requested',
  APPROVED: 'approved',
} as const;

export const BOOKING_STATUS = {
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_STATUS = {
  REFUNDED: 'refunded',
} as const;

export const REASSIGNABLE_BOOKING_STATUSES = ['pending', 'accepted'] as const;

export const ACTIVE_BOOKING_STATUSES = [
  'pending',
  'accepted',
  'travelling',
  'arrived',
  'in_progress',
] as const;
