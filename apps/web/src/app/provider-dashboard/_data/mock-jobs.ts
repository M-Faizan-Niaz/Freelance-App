export type JobStatus =
  | 'pending'
  | 'accepted'
  | 'travelling'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'rejected';

export interface ProviderJob {
  id: string;
  customerName: string;
  customerInitials: string;
  customerRating: number;
  service: string;
  categorySlug: string;
  date: string;       // 'YYYY-MM-DD'
  time: string;       // '9:00 AM'
  city: string;
  address: string;
  area: string;
  distance: string;   // '2.3 km'
  travelTime: string; // '8 min'
  grossAmount: number;
  commission: number; // 5%
  status: JobStatus;
  notes?: string;
}

export const MOCK_JOBS: ProviderJob[] = [
  {
    id: 'JOB-001',
    customerName: 'Sana Mirza',
    customerInitials: 'SM',
    customerRating: 4.7,
    service: 'Short Circuit Repair',
    categorySlug: 'electrician',
    date: '2026-05-20',
    time: '10:00 AM',
    city: 'Karachi',
    address: '45 Bahadurabad',
    area: 'Gulshan-e-Iqbal',
    distance: '2.3 km',
    travelTime: '8 min',
    grossAmount: 1000,
    commission: 50,
    status: 'pending',
    notes: 'Living room lights keep tripping the breaker.',
  },
  {
    id: 'JOB-002',
    customerName: 'Hamza Sheikh',
    customerInitials: 'HS',
    customerRating: 4.9,
    service: 'Wiring & Installation',
    categorySlug: 'electrician',
    date: '2026-05-20',
    time: '2:00 PM',
    city: 'Karachi',
    address: '12 Gulistan-e-Johar',
    area: 'Block 13',
    distance: '5.1 km',
    travelTime: '15 min',
    grossAmount: 1800,
    commission: 90,
    status: 'in_progress',
    notes: 'New wiring for bedroom extension.',
  },
  {
    id: 'JOB-003',
    customerName: 'Fatima Malik',
    customerInitials: 'FM',
    customerRating: 5.0,
    service: 'Panel Upgrade',
    categorySlug: 'electrician',
    date: '2026-05-18',
    time: '9:00 AM',
    city: 'Karachi',
    address: '8 Defence Phase 5',
    area: 'DHA',
    distance: '7.8 km',
    travelTime: '22 min',
    grossAmount: 2500,
    commission: 125,
    status: 'completed',
  },
  {
    id: 'JOB-004',
    customerName: 'Rashid Khan',
    customerInitials: 'RK',
    customerRating: 4.3,
    service: 'Generator Setup',
    categorySlug: 'electrician',
    date: '2026-05-15',
    time: '11:00 AM',
    city: 'Karachi',
    address: '22 North Nazimabad',
    area: 'Block H',
    distance: '4.2 km',
    travelTime: '12 min',
    grossAmount: 3500,
    commission: 175,
    status: 'completed',
  },
  {
    id: 'JOB-005',
    customerName: 'Nadia Anwar',
    customerInitials: 'NA',
    customerRating: 4.6,
    service: 'Outdoor Lighting',
    categorySlug: 'electrician',
    date: '2026-05-10',
    time: '4:00 PM',
    city: 'Karachi',
    address: '7 Clifton Block 2',
    area: 'Clifton',
    distance: '9.5 km',
    travelTime: '28 min',
    grossAmount: 1200,
    commission: 60,
    status: 'completed',
  },
  {
    id: 'JOB-006',
    customerName: 'Tariq Baig',
    customerInitials: 'TB',
    customerRating: 3.8,
    service: 'Short Circuit Repair',
    categorySlug: 'electrician',
    date: '2026-05-08',
    time: '1:00 PM',
    city: 'Karachi',
    address: 'Plot 55 Korangi',
    area: 'Korangi',
    distance: '11.2 km',
    travelTime: '35 min',
    grossAmount: 900,
    commission: 45,
    status: 'rejected',
    notes: 'Too far, outside service area.',
  },
  {
    id: 'JOB-007',
    customerName: 'Asad Iqbal',
    customerInitials: 'AI',
    customerRating: 4.8,
    service: 'Wiring & Installation',
    categorySlug: 'electrician',
    date: '2026-05-28',
    time: '9:00 AM',
    city: 'Karachi',
    address: '33 Gulshan Block 6',
    area: 'Gulshan',
    distance: '3.0 km',
    travelTime: '10 min',
    grossAmount: 1600,
    commission: 80,
    status: 'accepted',
  },
];

/* ── Weekly earnings for the chart (last 7 days) ──────────────── */
export const WEEKLY_EARNINGS = [
  { day: 'Mon', amount: 3500 },
  { day: 'Tue', amount: 0 },
  { day: 'Wed', amount: 6200 },
  { day: 'Thu', amount: 2800 },
  { day: 'Fri', amount: 8100 },
  { day: 'Sat', amount: 4500 },
  { day: 'Sun', amount: 1200 },
];

export function getJobById(id: string): ProviderJob | undefined {
  return MOCK_JOBS.find((j) => j.id === id);
}

export function getJobsByStatus(statuses: JobStatus[]): ProviderJob[] {
  return MOCK_JOBS.filter((j) => statuses.includes(j.status));
}
