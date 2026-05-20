import { MOCK_PROVIDERS, type ServiceProvider } from '@/app/services/_data/mock-providers';

/* ── Extended types ─────────────────────────────────────────── */

export interface ServiceOffered {
  label: string;
  price: number;
}

export interface PortfolioImage {
  id: string;
  /** Tailwind gradient classes used as a placeholder until real uploads exist */
  gradient: string;
  alt: string;
}

export interface AvailabilityDay {
  dateLabel: string;   // "Mon 20"
  dayKey: string;      // ISO date string used as key
  available: boolean;
}

export interface Review {
  id: string;
  name: string;
  initials: string;
  date: string;
  rating: number;
  comment: string;
  service: string;
}

export interface RatingBreakdown {
  stars: number;
  count: number;
}

export interface ProviderExtended {
  memberSince: string;
  responseRate: number;          // percentage 0–100
  servicesOffered: ServiceOffered[];
  portfolioImages: PortfolioImage[];
  ratingBreakdown: RatingBreakdown[];
  reviews: Review[];
}

export type ProviderProfile = ServiceProvider & ProviderExtended;

/* ── Palette for portfolio placeholder tiles ────────────────── */

const GRADIENTS = [
  'from-blue-400 to-blue-600',
  'from-emerald-400 to-emerald-600',
  'from-purple-400 to-purple-600',
  'from-amber-400 to-amber-600',
  'from-rose-400 to-rose-600',
  'from-sky-400 to-sky-600',
  'from-indigo-400 to-indigo-600',
  'from-teal-400 to-teal-600',
  'from-orange-400 to-orange-600',
  'from-cyan-400 to-cyan-600',
  'from-lime-400 to-lime-600',
  'from-pink-400 to-pink-600',
];

function makePortfolio(id: string, count: number): PortfolioImage[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${id}-img-${i + 1}`,
    gradient: GRADIENTS[i % GRADIENTS.length],
    alt: `Portfolio photo ${i + 1}`,
  }));
}

/* ── Extended data keyed by provider id ─────────────────────── */

const EXTENDED: Record<string, ProviderExtended> = {
  'prov-1': {
    memberSince: 'March 2020',
    responseRate: 97,
    servicesOffered: [
      { label: 'Wiring & Installation', price: 800 },
      { label: 'Short Circuit Repair', price: 1000 },
      { label: 'Panel Upgrade', price: 2500 },
      { label: 'Generator Setup', price: 3500 },
      { label: 'Outdoor Lighting', price: 1200 },
    ],
    portfolioImages: makePortfolio('prov-1', 9),
    ratingBreakdown: [
      { stars: 5, count: 98 },
      { stars: 4, count: 18 },
      { stars: 3, count: 5 },
      { stars: 2, count: 2 },
      { stars: 1, count: 1 },
    ],
    reviews: [
      {
        id: 'r1',
        name: 'Fatima Malik',
        initials: 'FM',
        date: '2 days ago',
        rating: 5,
        comment: 'Ahmed fixed a dangerous short circuit in under an hour. Very professional and clean work.',
        service: 'Short Circuit Repair',
      },
      {
        id: 'r2',
        name: 'Hamza Sheikh',
        initials: 'HS',
        date: '1 week ago',
        rating: 5,
        comment: 'Wired our entire new office. Showed up on time, worked efficiently, and cleaned up after himself.',
        service: 'Wiring & Installation',
      },
      {
        id: 'r3',
        name: 'Nadia Qureshi',
        initials: 'NQ',
        date: '2 weeks ago',
        rating: 4,
        comment: 'Good work on the panel upgrade. Took a bit longer than expected but the result was solid.',
        service: 'Panel Upgrade',
      },
      {
        id: 'r4',
        name: 'Omar Farooq',
        initials: 'OF',
        date: '1 month ago',
        rating: 5,
        comment: 'Set up outdoor lights for our garden. They look amazing and the wiring is very neat.',
        service: 'Outdoor Lighting',
      },
      {
        id: 'r5',
        name: 'Ayesha Siddiqui',
        initials: 'AS',
        date: '1 month ago',
        rating: 5,
        comment: 'Extremely knowledgeable. Diagnosed and fixed an intermittent fault that two other electricians missed.',
        service: 'Wiring & Installation',
      },
    ],
  },
  'prov-8': {
    memberSince: 'January 2019',
    responseRate: 99,
    servicesOffered: [
      { label: 'Home Deep Cleaning', price: 1200 },
      { label: 'Office Cleaning', price: 2000 },
      { label: 'Post-Construction Cleanup', price: 3500 },
      { label: 'Move-In / Move-Out Cleaning', price: 2500 },
      { label: 'Kitchen Deep Clean', price: 800 },
    ],
    portfolioImages: makePortfolio('prov-8', 12),
    ratingBreakdown: [
      { stars: 5, count: 187 },
      { stars: 4, count: 17 },
      { stars: 3, count: 4 },
      { stars: 2, count: 2 },
      { stars: 1, count: 1 },
    ],
    reviews: [
      {
        id: 'r1',
        name: 'Zara Ahmed',
        initials: 'ZA',
        date: '3 days ago',
        rating: 5,
        comment: "Sara's team did an incredible job on our post-renovation cleanup. The place was spotless in 3 hours.",
        service: 'Post-Construction Cleanup',
      },
      {
        id: 'r2',
        name: 'Bilal Chaudhry',
        initials: 'BC',
        date: '1 week ago',
        rating: 5,
        comment: 'Monthly home cleaning — always on time, always thorough. Best cleaning service in Islamabad.',
        service: 'Home Deep Cleaning',
      },
      {
        id: 'r3',
        name: 'Sana Malik',
        initials: 'SM',
        date: '2 weeks ago',
        rating: 5,
        comment: 'Move-out cleaning done to perfection. Got our full deposit back from the landlord!',
        service: 'Move-In / Move-Out Cleaning',
      },
    ],
  },
};

/** Generates a 7-day availability array starting from today */
function buildAvailability(availableToday: boolean): AvailabilityDay[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result: AvailabilityDay[] = [];
  const now = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const available = i === 0 ? availableToday : i === 5 || i === 6 ? false : Math.random() > 0.3;
    result.push({
      dateLabel: `${days[d.getDay()]} ${d.getDate()}`,
      dayKey: d.toISOString().split('T')[0],
      available,
    });
  }
  return result;
}

/** Returns a full ProviderProfile merging base + extended data */
export function getProviderById(id: string): ProviderProfile | null {
  const base = MOCK_PROVIDERS.find((p) => p.id === id);
  if (!base) return null;

  const ext = EXTENDED[id] ?? {
    memberSince: 'January 2022',
    responseRate: 90,
    servicesOffered: [{ label: base.category + ' Service', price: base.startingPrice }],
    portfolioImages: makePortfolio(id, 6),
    ratingBreakdown: [
      { stars: 5, count: Math.round(base.reviewCount * 0.75) },
      { stars: 4, count: Math.round(base.reviewCount * 0.15) },
      { stars: 3, count: Math.round(base.reviewCount * 0.06) },
      { stars: 2, count: Math.round(base.reviewCount * 0.03) },
      { stars: 1, count: Math.round(base.reviewCount * 0.01) },
    ],
    reviews: [
      {
        id: 'r1',
        name: 'A. Customer',
        initials: 'AC',
        date: '1 week ago',
        rating: 5,
        comment: 'Great work, very professional and on time.',
        service: base.category,
      },
    ],
  };

  return {
    ...base,
    ...ext,
    availability: buildAvailability(base.availableToday),
  } as ProviderProfile & { availability: AvailabilityDay[] };
}

export function getAllProviderIds(): string[] {
  return MOCK_PROVIDERS.map((p) => p.id);
}
