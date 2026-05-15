import { makeAuthClient } from '@repo/auth-client';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:9999';

export const authClient = makeAuthClient(API_URL);
