import env from './env.config';

/**
 * Authentication configuration values
 */
export const authConfig = {
  /**
   * CSRF protection secret
   */
  csrfSecret: env.CSRF_SECRET,

  /**
   * Access token expiry time in seconds
   */
  accessTokenExpiry: env.ACCESS_TOKEN_EXPIRY,

  /**
   * Refresh token expiry time in seconds
   */
  refreshTokenExpiry: env.REFRESH_TOKEN_EXPIRY,
};
