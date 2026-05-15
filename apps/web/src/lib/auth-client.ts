import { makeAuthClient } from '@repo/auth-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.viteplusmono.test';
const authUrl = API_URL + '/v1/api/auth';

export const authClient = makeAuthClient(authUrl);
