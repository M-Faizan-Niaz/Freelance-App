import type { Logger } from 'pino';
import { APIError, type User } from 'better-auth';
import { dbConfig } from '@/config';
import { AppError, UnauthorizedError, ValidationError } from '@/core/errors';
import { auth } from '@/lib/auth';
import { AuthRepository, type AuthUser } from '@/modules/users/auth/auth.repository';
import sendEmail, {
  otpEmailTemplate,
  resetPasswordEmailTemplate,
  verificationEmailTemplate,
} from '@/lib/send-email';
import { throwApiError } from '@/lib/throw-api-error';

// ==== AUTH CONSTANTS ====

const MAX_LOGIN_ATTEMPTS = 3;

/**
 * Service for authentication operations
 * Handles all BetterAuth API calls, email sending, and error handling
 *
 * Static methods → called by BetterAuth hooks (no request context)
 * Instance methods → called by route handlers (receive logger per-call)
 */
export class AuthService {
  /**
   * Module-level logger for BetterAuth hook methods (set once at app init).
   * NOT request-scoped — only use in static methods.
   */
  private static hookLogger: Logger | undefined;

  /** Call once at app startup to provide a logger for BetterAuth hook methods */
  static initHookLogger(logger: Logger) {
    AuthService.hookLogger = logger;
  }

  // ==== STATIC CONFIG METHODS FOR BETTER AUTH ====

  static async findUserByEmail(email: string): Promise<AuthUser | null> {
    return AuthRepository.findByEmail(email);
  }

  static async getUserOrThrow(email: string): Promise<AuthUser> {
    const user = await AuthRepository.findByEmail(email);
    if (!user) throwApiError('UNAUTHORIZED', 'User not found with provided email');
    return user;
  }

  static async recordFailedLoginAttempt(user: AuthUser): Promise<void> {
    const newAttempts = (user.loginAttempts ?? 0) + 1;
    if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
      await AuthRepository.lockAccount(user, newAttempts);
    } else {
      await AuthRepository.updateLoginAttempts(user, newAttempts);
    }
  }

  static async unlockAccount(user: { id: string }): Promise<void> {
    await AuthRepository.resetLoginAttempts(user);
  }

  static async recordSuccessfulLogin(user: AuthUser): Promise<void> {
    await AuthRepository.resetLoginAttempts(user);
  }

  static async throwIfAccountIsLocked(user: AuthUser): Promise<void> {
    if (user.lockedAt) {
      throwApiError(
        'FORBIDDEN',
        'Account is locked due to multiple failed login attempts. Please reset your password.',
      );
    }
  }

  static async throwIfEmailExists(email: string): Promise<void> {
    const existing = await AuthRepository.findByEmail(email);
    if (existing) throwApiError('CONFLICT', 'User with this email already exists');
  }

  static async sendVerificationEmail(user: User, url: string): Promise<void> {
    try {
      await sendEmail({
        email: user.email,
        subject: 'Activate your account',
        html: verificationEmailTemplate(url),
      });
      AuthService.hookLogger?.info({ email: user.email }, '[BetterAuth] Verification email sent');
    } catch (error) {
      AuthService.hookLogger?.error({ error }, '[BetterAuth] Failed to send verification email');
      throw new Error('Failed to send verification email');
    }
  }

  static async sendResetPasswordEmail(user: User, url: string): Promise<void> {
    try {
      await sendEmail({
        email: user.email,
        subject: 'Reset your password',
        html: resetPasswordEmailTemplate(url),
      });
      AuthService.hookLogger?.info({ email: user.email }, '[BetterAuth] Reset password email sent');
    } catch (error) {
      AuthService.hookLogger?.error({ error }, '[BetterAuth] Failed to send reset password email');
      throw new Error('Failed to send reset password email');
    }
  }

  static async sendOTPEmail(email: string, otp: string): Promise<void> {
    try {
      await sendEmail({
        email,
        subject: 'Your OTP',
        html: otpEmailTemplate(otp),
      });
      AuthService.hookLogger?.info({ email }, '[BetterAuth] OTP email sent');
    } catch (error) {
      AuthService.hookLogger?.error({ error }, '[BetterAuth] Failed to send OTP email');
      throw new Error('Failed to send OTP email');
    }
  }

  // ==== HANDLER METHODS ====
  // All instance methods receive a logger parameter for request-scoped logging.

  async verifyEmail(token: string, logger: Logger): Promise<void> {
    if (!token || token.length === 0) {
      throw new ValidationError('Verification token is missing or invalid');
    }

    try {
      logger?.info('Verifying email with token');

      await auth.api.verifyEmail({
        query: { token },
      });

      logger?.info('Email verified successfully');
    } catch (error) {
      logger?.error({ error }, 'Email verification failed');

      if (error instanceof APIError) {
        throw new ValidationError(error.message);
      }

      throw new ValidationError(
        'Email verification failed. Please try again or request a new verification email.',
      );
    }
  }

  async forgotPassword(email: string, headers: Headers, logger: Logger): Promise<void> {
    try {
      logger?.info({ email }, 'Processing password reset request');

      await auth.api.requestPasswordReset({
        body: {
          email,
          redirectTo: `${dbConfig.betterAuthUrl}/v1/auth-reset-password`,
        },
        headers,
      });

      logger?.info({ email }, 'Password reset email sent');
    } catch (error) {
      logger?.error({ error, email }, 'Password reset request failed');
      // Rethrow infrastructure errors so they surface in monitoring,
      // but the handler will always return a generic response to the client.
      throw error;
    }
  }

  async resetPassword(
    token: string,
    password: string,
    headers: Headers,
    logger: Logger,
  ): Promise<void> {
    try {
      logger?.info('Attempting password reset');

      await auth.api.resetPassword({
        body: { token, newPassword: password },
        headers,
      });

      logger?.info('Password reset successful');
    } catch (error) {
      logger?.error({ error }, 'Password reset failed');
      throw new UnauthorizedError(
        'Failed to reset password. Invalid or expired token. Please request a new reset link.',
      );
    }
  }

  async completeUserProfile(
    data: {
      firstName: string;
      lastName: string;
      city?: string;
      institution?: string;
      department?: string;
    },
    headers: Headers,
    logger: Logger,
  ): Promise<void> {
    const session = await auth.api.getSession({ headers });

    if (!session?.user?.id) {
      logger?.error('Failed to complete user profile - user not authenticated');
      throw new UnauthorizedError('You must be authenticated to complete your profile');
    }

    const userId = session.user.id;

    try {
      await AuthRepository.completeUserProfile(userId, data);

      logger?.info({ userId }, 'User profile completed successfully');
    } catch (error) {
      logger?.error({ userId, error }, 'Failed to complete user profile');
      throw new AppError('Failed to complete user profile. Please try again.');
    }
  }

  async updateEmail(data: { newEmail: string }, headers: Headers, logger: Logger): Promise<void> {
    try {
      logger?.info({ newEmail: data.newEmail }, 'Requesting email change');

      await auth.api.changeEmail({
        body: {
          newEmail: data.newEmail,
        },
        headers,
      });

      logger?.info('Email change verification sent successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update email';
      logger?.error({ error }, 'Email change failed');
      throw new ValidationError(errorMessage);
    }
  }
}

export default AuthService;
