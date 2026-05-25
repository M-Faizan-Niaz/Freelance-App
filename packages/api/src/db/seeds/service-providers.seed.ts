import { randomUUID } from 'crypto';
import { hashPassword } from '@better-auth/utils/password';
import type { Database } from '@/db';
import { roles, serviceProviders, tiers, userProfiles, accounts, users } from '@/db/models';
import { eq } from 'drizzle-orm';

// Shared seed password for all seeded providers — change before production
const SEED_PASSWORD = 'Provider@123';

interface ProviderSeedData {
  name: string;
  email: string;
  phone: string;
  cnic: string;
  city: string;
  tier: 'Basic' | 'Standard' | 'Premium';
  hourlyRate: string;
  totalJobsCompleted: number;
  averageRating: string;
  bio: string;
  isOnline: boolean;
}

const PROVIDERS: ProviderSeedData[] = [
  {
    name: 'Ahmed Khan',
    email: 'ahmed.khan@serveease.test',
    phone: '+923001234567',
    cnic: '42101-1234567-1',
    city: 'Karachi',
    tier: 'Standard',
    hourlyRate: '1200.00',
    totalJobsCompleted: 87,
    averageRating: '4.60',
    bio: 'Certified electrician with 6 years of residential and commercial wiring experience.',
    isOnline: true,
  },
  {
    name: 'Bilal Hussain',
    email: 'bilal.hussain@serveease.test',
    phone: '+923011234568',
    cnic: '35201-2345678-2',
    city: 'Lahore',
    tier: 'Basic',
    hourlyRate: '800.00',
    totalJobsCompleted: 34,
    averageRating: '4.20',
    bio: 'Reliable plumber handling leaks, pipe installation, and bathroom fittings.',
    isOnline: false,
  },
  {
    name: 'Usman Ali',
    email: 'usman.ali@serveease.test',
    phone: '+923021234569',
    cnic: '42201-3456789-3',
    city: 'Karachi',
    tier: 'Premium',
    hourlyRate: '2000.00',
    totalJobsCompleted: 210,
    averageRating: '4.90',
    bio: 'Top-rated AC technician specialising in all major brands — installation, gas refill, and PCB repair.',
    isOnline: true,
  },
  {
    name: 'Rizwan Malik',
    email: 'rizwan.malik@serveease.test',
    phone: '+923031234570',
    cnic: '61101-4567890-4',
    city: 'Islamabad',
    tier: 'Standard',
    hourlyRate: '1000.00',
    totalJobsCompleted: 65,
    averageRating: '4.50',
    bio: 'Experienced painter for interior and exterior surfaces — wall textures, wood polish, and waterproofing.',
    isOnline: true,
  },
  {
    name: 'Tariq Mahmood',
    email: 'tariq.mahmood@serveease.test',
    phone: '+923041234571',
    cnic: '42301-5678901-5',
    city: 'Karachi',
    tier: 'Basic',
    hourlyRate: '900.00',
    totalJobsCompleted: 22,
    averageRating: '4.10',
    bio: 'Furniture maker and carpenter — custom cabinets, door repairs, and fitted wardrobes.',
    isOnline: false,
  },
  {
    name: 'Imran Siddiqui',
    email: 'imran.siddiqui@serveease.test',
    phone: '+923051234572',
    cnic: '35101-6789012-6',
    city: 'Lahore',
    tier: 'Standard',
    hourlyRate: '700.00',
    totalJobsCompleted: 143,
    averageRating: '4.70',
    bio: 'Professional house cleaning team lead — deep cleaning, move-in/out, and post-construction cleanup.',
    isOnline: true,
  },
  {
    name: 'Nadeem Akhtar',
    email: 'nadeem.akhtar@serveease.test',
    phone: '+923061234573',
    cnic: '42401-7890123-7',
    city: 'Karachi',
    tier: 'Premium',
    hourlyRate: '1800.00',
    totalJobsCompleted: 178,
    averageRating: '4.85',
    bio: 'Security systems expert — IP cameras, DVR/NVR setup, and remote viewing configuration.',
    isOnline: true,
  },
  {
    name: 'Salman Raza',
    email: 'salman.raza@serveease.test',
    phone: '+923071234574',
    cnic: '61201-8901234-8',
    city: 'Islamabad',
    tier: 'Standard',
    hourlyRate: '1500.00',
    totalJobsCompleted: 58,
    averageRating: '4.55',
    bio: 'Solar panel installer with experience in on-grid and off-grid systems for homes and offices.',
    isOnline: false,
  },
  {
    name: 'Farhan Qureshi',
    email: 'farhan.qureshi@serveease.test',
    phone: '+923081234575',
    cnic: '34101-9012345-9',
    city: 'Rawalpindi',
    tier: 'Basic',
    hourlyRate: '600.00',
    totalJobsCompleted: 19,
    averageRating: '4.00',
    bio: 'Garden maintenance — lawn trimming, hedge cutting, tree pruning, and seasonal planting.',
    isOnline: true,
  },
  {
    name: 'Zeeshan Baig',
    email: 'zeeshan.baig@serveease.test',
    phone: '+923091234576',
    cnic: '42501-0123456-0',
    city: 'Karachi',
    tier: 'Premium',
    hourlyRate: '2500.00',
    totalJobsCompleted: 302,
    averageRating: '4.95',
    bio: 'Master electrician and smart-home specialist — wiring, automation, and EV charging installation.',
    isOnline: true,
  },
];

export default async function seedServiceProviders(db: Database) {
  const hashedPassword = await hashPassword(SEED_PASSWORD);

  const [spRole] = await db.select().from(roles).where(eq(roles.name, 'service_provider'));
  const allTiers = await db.select().from(tiers);

  const tierMap = Object.fromEntries(allTiers.map((t) => [t.name, t.id]));

  for (const p of PROVIDERS) {
    const userId = randomUUID();
    const accountId = randomUUID();
    const now = new Date().toISOString();

    // 1. Auth user
    await db.insert(users).values({
      id: userId,
      name: p.name,
      email: p.email,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 2. Credentials account (better-auth credential provider)
    await db.insert(accounts).values({
      id: accountId,
      accountId: userId,
      providerId: 'credential',
      userId,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 3. User profile
    await db.insert(userProfiles).values({
      userId,
      roleId: spRole.id,
      fullName: p.name,
      phoneNumber: p.phone,
      isActive: true,
    });

    // 4. Service provider record (approved, with realistic stats)
    await db.insert(serviceProviders).values({
      userId,
      cnicNumber: p.cnic,
      isCnicVerified: true,
      hourlyRate: p.hourlyRate,
      tierId: tierMap[p.tier]!,
      isOnline: p.isOnline,
      totalJobsCompleted: p.totalJobsCompleted,
      averageRating: p.averageRating,
      bio: p.bio,
      city: p.city,
      verificationStatus: 'approved',
      coverageRadiusKm: '15.00',
      createdAt: now,
      updatedAt: now,
    });
  }
}
