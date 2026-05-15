import { createAuthClient } from 'better-auth/client';
import { emailOTPClient, twoFactorClient } from 'better-auth/client/plugins';

/**
 * Create a better-auth client configured with the twoFactor and emailOtp plugins.
 *
 * @param baseURL - Full URL of the API server (e.g. http://localhost:9999)
 */
export function makeAuthClient(baseURL: string) {
  return createAuthClient({
    baseURL,
    basePath: '/v1/api/auth',
    plugins: [twoFactorClient(), emailOTPClient()],
  });
}

export type AuthClient = ReturnType<typeof makeAuthClient>;
