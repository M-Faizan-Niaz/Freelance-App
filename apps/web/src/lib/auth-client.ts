import { makeAuthClient } from '@repo/auth-client';
import { API_BASE_URL } from '@/lib/constants';

export const authClient = makeAuthClient(`${API_BASE_URL}/v1/api/auth`);
