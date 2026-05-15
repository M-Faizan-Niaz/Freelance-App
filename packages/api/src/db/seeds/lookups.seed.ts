import type { Database } from '@/db';

import {
  actionTypes,
  bookingStatuses,
  customerStatuses,
  disputeStatuses,
  messageTypes,
  notificationTypes,
  paymentMethods,
  paymentStatuses,
  payoutStatuses,
  roles,
  serviceCategories,
  tiers,
} from '../models';

export default async function seedLookups(db: Database) {
  await db.insert(tiers).values([
    { name: 'Basic', description: 'Entry-level service providers with verified identity' },
    { name: 'Standard', description: 'Experienced providers with a solid track record' },
    { name: 'Premium', description: 'Top-rated professionals with excellent performance' },
  ]);

  await db.insert(roles).values([
    { name: 'customer', description: 'Customer who books services' },
    { name: 'service_provider', description: 'Professional who provides services' },
    { name: 'admin', description: 'Platform administrator' },
  ]);

  await db.insert(serviceCategories).values([
    { name: 'Electrician', description: 'Electrical wiring, repairs, and installations' },
    { name: 'Plumber', description: 'Plumbing repairs, installation, and maintenance' },
    { name: 'AC Repair', description: 'Air conditioner servicing, repair, and installation' },
    { name: 'Painter', description: 'Interior and exterior painting services' },
    { name: 'Carpenter', description: 'Furniture, woodwork, and carpentry services' },
    { name: 'House Cleaning', description: 'Residential cleaning and sanitation services' },
    { name: 'Mason', description: 'Brickwork, tiling, and construction services' },
    { name: 'CCTV Installation', description: 'Security camera installation and maintenance' },
    { name: 'Solar Panel', description: 'Solar panel installation and maintenance' },
    { name: 'Gardening', description: 'Garden maintenance, landscaping, and planting' },
    { name: 'Pest Control', description: 'Pest extermination and prevention services' },
    { name: 'Locksmith', description: 'Lock repair, replacement, and key duplication' },
  ]);

  await db.insert(bookingStatuses).values([
    { name: 'pending', description: 'Booking created, awaiting provider acceptance' },
    { name: 'accepted', description: 'Provider has accepted the booking' },
    { name: 'travelling', description: 'Provider is on the way to the customer' },
    { name: 'arrived', description: 'Provider has arrived at the customer location' },
    { name: 'in_progress', description: 'Service is currently being performed' },
    { name: 'completed', description: 'Service has been completed successfully' },
    { name: 'cancelled', description: 'Booking was cancelled by customer or provider' },
    { name: 'disputed', description: 'Booking is under dispute review' },
  ]);

  await db.insert(customerStatuses).values([
    { name: 'active', description: 'Customer account is active and in good standing' },
    { name: 'blocked', description: 'Customer account has been blocked' },
    { name: 'pending_verification', description: 'Awaiting identity verification' },
  ]);

  await db.insert(paymentMethods).values([
    { name: 'jazzcash', description: 'JazzCash mobile wallet payment' },
    { name: 'easypaisa', description: 'EasyPaisa mobile wallet payment' },
    { name: 'card', description: 'Credit or debit card payment' },
    { name: 'cash', description: 'Cash payment on service completion' },
  ]);

  await db.insert(paymentStatuses).values([
    { name: 'pending', description: 'Payment has been initiated' },
    { name: 'held', description: 'Payment is held in escrow until job completion' },
    { name: 'completed', description: 'Payment has been released to the provider' },
    { name: 'refunded', description: 'Payment has been refunded to the customer' },
    { name: 'failed', description: 'Payment transaction failed' },
  ]);

  await db.insert(actionTypes).values([
    { name: 'suspend', description: 'Temporarily suspend a user account' },
    { name: 'ban', description: 'Permanently ban a user account' },
    { name: 'unsuspend', description: 'Lift suspension from a user account' },
    { name: 'approve_provider', description: 'Approve a service provider application' },
    { name: 'reject_provider', description: 'Reject a service provider application' },
    { name: 'flag_fraud', description: 'Flag an account for fraudulent activity' },
  ]);

  await db.insert(disputeStatuses).values([
    { name: 'open', description: 'Dispute has been raised and is open' },
    { name: 'under_review', description: 'Dispute is under admin review' },
    { name: 'resolved', description: 'Dispute has been resolved' },
    { name: 'closed', description: 'Dispute has been closed' },
  ]);

  await db.insert(payoutStatuses).values([
    { name: 'requested', description: 'Payout has been requested by the provider' },
    { name: 'approved', description: 'Payout request has been approved by admin' },
    { name: 'processing', description: 'Payout is being processed' },
    { name: 'completed', description: 'Payout has been completed successfully' },
    { name: 'failed', description: 'Payout processing failed' },
  ]);

  await db.insert(notificationTypes).values([
    { name: 'booking_confirmed', description: 'Booking has been confirmed by the provider' },
    { name: 'provider_on_way', description: 'Provider is on the way to the customer' },
    { name: 'payment_received', description: 'Payment has been received' },
    { name: 'review_reminder', description: 'Reminder to leave a review after service' },
    { name: 'promo', description: 'Promotional offer or discount notification' },
    { name: 'system', description: 'General system notification' },
  ]);

  await db.insert(messageTypes).values([
    { name: 'text', description: 'Plain text message' },
    { name: 'image', description: 'Image message' },
    { name: 'quick_reply', description: 'Quick reply template message' },
  ]);
}
