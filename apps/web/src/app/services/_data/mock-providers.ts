export interface ServiceProvider {
  id: string;
  name: string;
  avatarUrl?: string;
  categorySlug: string;
  category: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  city: string;
  responseTime: string;
  tier: 'bronze' | 'silver' | 'gold';
  isVerified: boolean;
  isOnline: boolean;
  bio: string;
  jobsCompleted: number;
  availableToday: boolean;
}

export const MOCK_PROVIDERS: ServiceProvider[] = [
  /* ── Electrician ─────────────────────────────────────────── */
  {
    id: 'prov-1',
    name: 'Ahmed Raza',
    categorySlug: 'electrician',
    category: 'Electrician',
    rating: 4.9,
    reviewCount: 124,
    startingPrice: 800,
    city: 'Karachi',
    responseTime: '15 min',
    tier: 'gold',
    isVerified: true,
    isOnline: true,
    bio: '12 years of experience in residential and commercial wiring, panel upgrades, and emergency electrical work.',
    jobsCompleted: 312,
    availableToday: true,
  },
  {
    id: 'prov-2',
    name: 'Kamran Shah',
    categorySlug: 'electrician',
    category: 'Electrician',
    rating: 4.7,
    reviewCount: 89,
    startingPrice: 700,
    city: 'Lahore',
    responseTime: '20 min',
    tier: 'silver',
    isVerified: true,
    isOnline: false,
    bio: 'Specialised in solar installations, inverter setups, and generator wiring for homes and offices.',
    jobsCompleted: 201,
    availableToday: false,
  },
  {
    id: 'prov-3',
    name: 'Tariq Mehmood',
    categorySlug: 'electrician',
    category: 'Electrician',
    rating: 4.5,
    reviewCount: 47,
    startingPrice: 600,
    city: 'Islamabad',
    responseTime: '25 min',
    tier: 'bronze',
    isVerified: true,
    isOnline: true,
    bio: 'Reliable electrician for everyday repairs, short-circuit fixes, and outdoor lighting installations.',
    jobsCompleted: 98,
    availableToday: true,
  },

  /* ── Plumber ──────────────────────────────────────────────── */
  {
    id: 'prov-4',
    name: 'Bilal Khan',
    categorySlug: 'plumber',
    category: 'Plumber',
    rating: 4.8,
    reviewCount: 97,
    startingPrice: 600,
    city: 'Lahore',
    responseTime: '20 min',
    tier: 'silver',
    isVerified: true,
    isOnline: true,
    bio: 'Expert in pipe fittings, leakage detection, and bathroom renovation work across Lahore.',
    jobsCompleted: 223,
    availableToday: true,
  },
  {
    id: 'prov-5',
    name: 'Irfan Malik',
    categorySlug: 'plumber',
    category: 'Plumber',
    rating: 4.6,
    reviewCount: 63,
    startingPrice: 500,
    city: 'Karachi',
    responseTime: '30 min',
    tier: 'bronze',
    isVerified: false,
    isOnline: false,
    bio: 'Affordable plumbing services for taps, drainage, and water heater installation.',
    jobsCompleted: 134,
    availableToday: false,
  },

  /* ── AC & Appliances ─────────────────────────────────────── */
  {
    id: 'prov-6',
    name: 'Usman Tariq',
    categorySlug: 'ac-appliances',
    category: 'AC & Appliances',
    rating: 4.7,
    reviewCount: 78,
    startingPrice: 1000,
    city: 'Karachi',
    responseTime: '30 min',
    tier: 'gold',
    isVerified: true,
    isOnline: true,
    bio: 'Certified technician for all major AC brands — service, gas refill, coil cleaning, and fault diagnosis.',
    jobsCompleted: 189,
    availableToday: true,
  },
  {
    id: 'prov-7',
    name: 'Faisal Butt',
    categorySlug: 'ac-appliances',
    category: 'AC & Appliances',
    rating: 4.5,
    reviewCount: 41,
    startingPrice: 900,
    city: 'Rawalpindi',
    responseTime: '40 min',
    tier: 'bronze',
    isVerified: true,
    isOnline: false,
    bio: 'Washing machine, refrigerator, and microwave repair with same-day service in Rawalpindi.',
    jobsCompleted: 87,
    availableToday: false,
  },

  /* ── Cleaning ─────────────────────────────────────────────── */
  {
    id: 'prov-8',
    name: 'Sara Ali',
    categorySlug: 'cleaning',
    category: 'Cleaning',
    rating: 4.9,
    reviewCount: 211,
    startingPrice: 1200,
    city: 'Islamabad',
    responseTime: '10 min',
    tier: 'gold',
    isVerified: true,
    isOnline: true,
    bio: 'Professional deep-cleaning for homes, offices, and post-construction spaces. Team of 4 trained cleaners.',
    jobsCompleted: 467,
    availableToday: true,
  },
  {
    id: 'prov-9',
    name: 'Maria Hassan',
    categorySlug: 'cleaning',
    category: 'Cleaning',
    rating: 4.6,
    reviewCount: 88,
    startingPrice: 900,
    city: 'Lahore',
    responseTime: '20 min',
    tier: 'silver',
    isVerified: true,
    isOnline: true,
    bio: 'Sofa steam cleaning, carpet shampooing, and kitchen deep-clean specialist with eco-friendly products.',
    jobsCompleted: 201,
    availableToday: true,
  },

  /* ── Painting ─────────────────────────────────────────────── */
  {
    id: 'prov-10',
    name: 'Zubair Ahmed',
    categorySlug: 'painting',
    category: 'Painting',
    rating: 4.7,
    reviewCount: 56,
    startingPrice: 1500,
    city: 'Karachi',
    responseTime: '35 min',
    tier: 'silver',
    isVerified: true,
    isOnline: false,
    bio: 'Interior and exterior painting with premium emulsion paints. Clean finish, no mess left behind.',
    jobsCompleted: 132,
    availableToday: false,
  },

  /* ── Moving ───────────────────────────────────────────────── */
  {
    id: 'prov-11',
    name: 'Naveed Brothers',
    categorySlug: 'moving',
    category: 'Moving',
    rating: 4.8,
    reviewCount: 143,
    startingPrice: 2500,
    city: 'Karachi',
    responseTime: '45 min',
    tier: 'gold',
    isVerified: true,
    isOnline: true,
    bio: 'Full-service home shifting with professional packing, loading, and safe transportation across Karachi.',
    jobsCompleted: 298,
    availableToday: true,
  },

  /* ── Carpenter ────────────────────────────────────────────── */
  {
    id: 'prov-12',
    name: 'Salman Woodworks',
    categorySlug: 'carpenter',
    category: 'Carpenter',
    rating: 4.6,
    reviewCount: 72,
    startingPrice: 1000,
    city: 'Lahore',
    responseTime: '25 min',
    tier: 'silver',
    isVerified: true,
    isOnline: false,
    bio: 'Custom furniture, wardrobe fitting, and door repairs. Over 10 years of fine woodwork experience.',
    jobsCompleted: 156,
    availableToday: false,
  },

  /* ── Outdoor ──────────────────────────────────────────────── */
  {
    id: 'prov-13',
    name: 'Green Thumb Co.',
    categorySlug: 'outdoor',
    category: 'Outdoor',
    rating: 4.5,
    reviewCount: 38,
    startingPrice: 800,
    city: 'Islamabad',
    responseTime: '50 min',
    tier: 'bronze',
    isVerified: false,
    isOnline: true,
    bio: 'Garden maintenance, lawn mowing, tree trimming, and seasonal planting for residential gardens.',
    jobsCompleted: 76,
    availableToday: true,
  },
];

export function getProvidersBySlug(
  slug: string,
  opts: {
    filter?: string;
    minRating?: number;
    maxPrice?: number;
    sort?: string;
  } = {},
): ServiceProvider[] {
  let list = MOCK_PROVIDERS.filter((p) => p.categorySlug === slug);

  if (opts.filter === 'available-today') list = list.filter((p) => p.availableToday);
  if (opts.filter === 'top-rated') list = list.filter((p) => p.rating >= 4.7);
  if (opts.filter === 'verified') list = list.filter((p) => p.isVerified);
  if (opts.filter === 'under-1000') list = list.filter((p) => p.startingPrice < 1000);

  if (opts.minRating) list = list.filter((p) => p.rating >= opts.minRating!);
  if (opts.maxPrice) list = list.filter((p) => p.startingPrice <= opts.maxPrice!);

  if (opts.sort === 'price') list = [...list].sort((a, b) => a.startingPrice - b.startingPrice);
  else if (opts.sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);

  return list;
}
