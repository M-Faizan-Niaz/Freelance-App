import type { Database } from '@/db';

import { commissionSettings, tiers } from '../models';

const DEFAULT_RATES: Record<string, string> = {
  Basic: '20.00',
  Standard: '15.00',
  Premium: '10.00',
};

export default async function seedCommissionSettings(db: Database) {
  const allTiers = await db.select().from(tiers);

  const data = allTiers.map((tier) => ({
    tierId: tier.id,
    commissionRate: DEFAULT_RATES[tier.name] ?? '15.00',
    effectiveFrom: new Date().toISOString(),
  }));

  await db.insert(commissionSettings).values(data);
}
