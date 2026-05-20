export interface CategoryMeta {
  slug: string;
  label: string;
  description: string;
  subcategories: string[];
}

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: 'electrician',
    label: 'Electrician',
    description:
      'Licensed electricians for wiring, panel upgrades, short-circuit repairs, and emergency callouts.',
    subcategories: [
      'Wiring & Installation',
      'Short Circuit Repair',
      'Panel Upgrades',
      'Emergency Services',
      'Outdoor Lighting',
      'Generator Setup',
    ],
  },
  {
    slug: 'plumber',
    label: 'Plumber',
    description:
      'Certified plumbers for pipe repairs, leakages, fixture installation, and drainage work.',
    subcategories: [
      'Pipe Repair & Replacement',
      'Leakage Fix',
      'Tap & Fixture Install',
      'Drainage Cleaning',
      'Water Heater Install',
      'Bathroom Renovation',
    ],
  },
  {
    slug: 'ac-appliances',
    label: 'AC & Appliances',
    description:
      'AC servicing, gas refill, installation, and general appliance repair by certified technicians.',
    subcategories: [
      'AC Service & Gas Refill',
      'AC Installation',
      'AC Repair',
      'Refrigerator Repair',
      'Washing Machine Repair',
      'Microwave & Oven Repair',
    ],
  },
  {
    slug: 'cleaning',
    label: 'Cleaning',
    description:
      'Professional home, sofa, carpet, and deep-cleaning services for residential and commercial spaces.',
    subcategories: [
      'Home Deep Cleaning',
      'Sofa & Carpet Cleaning',
      'Kitchen Cleaning',
      'Office Cleaning',
      'Post-Construction Cleanup',
      'Move-In / Move-Out Cleaning',
    ],
  },
  {
    slug: 'painting',
    label: 'Painting',
    description:
      'Interior and exterior painting, wall textures, and touch-up work by skilled painters.',
    subcategories: [
      'Interior Painting',
      'Exterior Painting',
      'Wall Texture & Stucco',
      'Touch-Up & Repair',
      'Roof Painting',
      'Furniture Painting',
    ],
  },
  {
    slug: 'moving',
    label: 'Moving',
    description:
      'Packing, loading, transportation, and unpacking services for home and office relocations.',
    subcategories: [
      'Home Shifting',
      'Office Relocation',
      'Packing & Unpacking',
      'Furniture Assembly',
      'Single-Item Delivery',
      'Storage Services',
    ],
  },
  {
    slug: 'carpenter',
    label: 'Carpenter',
    description:
      'Custom woodwork, furniture assembly, door and window repairs, and kitchen cabinet fitting.',
    subcategories: [
      'Furniture Assembly',
      'Custom Woodwork',
      'Door & Window Repair',
      'Kitchen Cabinet Install',
      'Wardrobe Fitting',
      'False Ceiling Work',
    ],
  },
  {
    slug: 'outdoor',
    label: 'Outdoor',
    description:
      'Garden maintenance, lawn mowing, tree trimming, and outdoor cleaning services.',
    subcategories: [
      'Garden Maintenance',
      'Lawn Mowing',
      'Tree & Bush Trimming',
      'Outdoor Washing',
      'Pest Control',
      'Gutter Cleaning',
    ],
  },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
) as Record<string, CategoryMeta>;
