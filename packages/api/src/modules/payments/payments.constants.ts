export const PAYMENT_STATUS = {
  PENDING: 'pending',
  HELD: 'held',
  COMPLETED: 'completed',
  REFUNDED: 'refunded',
  FAILED: 'failed',
} as const;

export type PaymentStatusValue = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const TERMINAL_PAYMENT_STATUSES: string[] = [
  PAYMENT_STATUS.COMPLETED,
  PAYMENT_STATUS.FAILED,
];

export const PAYABLE_BOOKING_STATUS = 'completed';

export const PAYMENT_PROOF_FOLDER = 'payments/proofs';
export const PAYMENT_PROOF_MAX_MB = 10;
