export type BookingStatus = 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface MockBooking {
  id: string;
  providerId: string;
  providerName: string;
  providerInitials: string;
  providerCategory: string;
  service: string;
  date: string;        // 'YYYY-MM-DD'
  time: string;        // '9:00 AM'
  city: string;
  addressStreet: string;
  addressArea: string;
  status: BookingStatus;
  price: number;
  platformFee: number;
  reviewLeft: boolean;
  notes?: string;
}

export const MOCK_BOOKINGS: MockBooking[] = [
  {
    id: 'BKG-001',
    providerId: 'prov-1',
    providerName: 'Ahmed Raza',
    providerInitials: 'AR',
    providerCategory: 'Electrician',
    service: 'Short Circuit Repair',
    date: '2026-05-25',
    time: '10:00 AM',
    city: 'Karachi',
    addressStreet: '45 Bahadurabad',
    addressArea: 'Gulshan-e-Iqbal',
    status: 'confirmed',
    price: 1000,
    platformFee: 50,
    reviewLeft: false,
  },
  {
    id: 'BKG-002',
    providerId: 'prov-8',
    providerName: 'Bilal Hussain',
    providerInitials: 'BH',
    providerCategory: 'Plumber',
    service: 'Pipe Repair & Replacement',
    date: '2026-05-22',
    time: '9:00 AM',
    city: 'Karachi',
    addressStreet: '12 Gulistan-e-Johar',
    addressArea: 'Block 13',
    status: 'in_progress',
    price: 1500,
    platformFee: 75,
    reviewLeft: false,
    notes: 'Main water line has a slow leak near the kitchen.',
  },
  {
    id: 'BKG-003',
    providerId: 'prov-1',
    providerName: 'Ahmed Raza',
    providerInitials: 'AR',
    providerCategory: 'Electrician',
    service: 'Wiring & Installation',
    date: '2026-05-10',
    time: '2:00 PM',
    city: 'Karachi',
    addressStreet: '8 Defence Phase 5',
    addressArea: 'DHA',
    status: 'completed',
    price: 800,
    platformFee: 40,
    reviewLeft: true,
  },
  {
    id: 'BKG-004',
    providerId: 'prov-3',
    providerName: 'Sara Khan',
    providerInitials: 'SK',
    providerCategory: 'Cleaning',
    service: 'Home Deep Cleaning',
    date: '2026-04-28',
    time: '9:00 AM',
    city: 'Karachi',
    addressStreet: '22 North Nazimabad',
    addressArea: 'Block H',
    status: 'completed',
    price: 3500,
    platformFee: 175,
    reviewLeft: false,
    notes: 'Full house deep clean, 3 bedrooms + 2 bathrooms.',
  },
  {
    id: 'BKG-005',
    providerId: 'prov-4',
    providerName: 'Usman Ali',
    providerInitials: 'UA',
    providerCategory: 'AC & Appliances',
    service: 'AC Service & Gas Refill',
    date: '2026-04-15',
    time: '11:00 AM',
    city: 'Lahore',
    addressStreet: '33 Johar Town',
    addressArea: 'Phase 2',
    status: 'completed',
    price: 2500,
    platformFee: 125,
    reviewLeft: false,
  },
  {
    id: 'BKG-006',
    providerId: 'prov-5',
    providerName: 'Zain Abbas',
    providerInitials: 'ZA',
    providerCategory: 'Painting',
    service: 'Interior Painting',
    date: '2026-04-02',
    time: '8:00 AM',
    city: 'Karachi',
    addressStreet: '7 Clifton Block 2',
    addressArea: 'Clifton',
    status: 'cancelled',
    price: 8000,
    platformFee: 400,
    reviewLeft: false,
    notes: 'Customer cancelled due to schedule conflict.',
  },
  {
    id: 'BKG-007',
    providerId: 'prov-6',
    providerName: 'Tariq Mehmood',
    providerInitials: 'TM',
    providerCategory: 'Carpenter',
    service: 'Furniture Assembly',
    date: '2026-05-28',
    time: '1:00 PM',
    city: 'Islamabad',
    addressStreet: 'Plot 14 F-8/1',
    addressArea: 'F-8',
    status: 'confirmed',
    price: 2000,
    platformFee: 100,
    reviewLeft: false,
  },
];

export function getBookingById(id: string): MockBooking | undefined {
  return MOCK_BOOKINGS.find((b) => b.id === id);
}

export function getBookingsByStatus(statuses: BookingStatus[]): MockBooking[] {
  return MOCK_BOOKINGS.filter((b) => statuses.includes(b.status));
}
