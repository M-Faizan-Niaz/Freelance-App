export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://api.viteplusmono.test';

export const PAKISTAN_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Peshawar',
];

export const PLATFORM_FEE_RATE = 0.05;

export const ROLE = {
  CUSTOMER: 1,
  SERVICE_PROVIDER: 2,
} as const;

export const CHAT_POLL_INTERVAL_MS = 8_000;
