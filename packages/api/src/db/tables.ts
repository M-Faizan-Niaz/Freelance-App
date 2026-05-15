import type { Table } from 'drizzle-orm';

import * as schema from '@/db/models';

/**
 * Centralized list of all database tables.
 * Used for operations like truncating, seeding, and resetting sequences.
 *
 * Note: Tables are ordered to respect foreign key dependencies.
 * Parent tables should come before child tables.
 */
export const allTables: Table[] = [
  // lookup tables (no FK deps — must come before any entity that references them)
  schema.tiers,
  schema.roles,
  schema.serviceCategories,
  schema.bookingStatuses,
  schema.customerStatuses,
  schema.paymentMethods,
  schema.paymentStatuses,
  schema.actionTypes,
  schema.disputeStatuses,
  schema.payoutStatuses,
  schema.notificationTypes,
  schema.messageTypes,
  // admin tables (FK → tiers)
  schema.commissionSettings,
  // auth tables (user must come first — sessions, accounts, etc. reference it)
  schema.users,
  schema.sessions,
  schema.accounts,
  schema.verifications,
  schema.twoFactors,
  // core entity tables (FK → users + lookups)
  schema.userProfiles,
  schema.customers,
  schema.serviceProviders,
  // domain tables
  schema.colors,
  schema.countries,
  schema.cities,
].filter(Boolean);
