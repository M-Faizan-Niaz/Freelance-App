export const NOTIFICATION_TYPE = {
  BOOKING_CONFIRMED: 'booking_confirmed',
  PROVIDER_ON_WAY: 'provider_on_way',
  PAYMENT_RECEIVED: 'payment_received',
  REVIEW_REMINDER: 'review_reminder',
  PROMO: 'promo',
  SYSTEM: 'system',
} as const;

export type NotificationTypeName = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];
