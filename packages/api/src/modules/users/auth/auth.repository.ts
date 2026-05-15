import { eq } from 'drizzle-orm';

import { db } from '@/db';
import users from '../users.model';

const AUTH_USER_COLUMNS = {
  id: users.id,
  name: users.name,
  email: users.email,
  loginAttempts: users.loginAttempts,
  lockedAt: users.lockedAt,
  emailVerified: users.emailVerified,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
} as const;

export type AuthUser = Awaited<ReturnType<typeof AuthRepository.findByEmail>> & object;

/**
 * Repository for authentication-related database operations.
 * All methods are static — callers must go through AuthService, never this class directly.
 */
export class AuthRepository {
  static async updateLoginAttempts(user: { id: string }, attempts: number): Promise<void> {
    await db.update(users).set({ loginAttempts: attempts }).where(eq(users.id, user.id));
  }

  static async resetLoginAttempts(user: { id: string }): Promise<void> {
    await db
      .update(users)
      .set({
        loginAttempts: 0,
        lockedAt: null,
      })
      .where(eq(users.id, user.id));
  }

  static async findByEmail(email: string) {
    const result = await db
      .select(AUTH_USER_COLUMNS)
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result[0] ?? null;
  }

  static async lockAccount(user: { id: string }, attempts: number): Promise<void> {
    await db
      .update(users)
      .set({ lockedAt: new Date().toISOString(), loginAttempts: attempts })
      .where(eq(users.id, user.id));
  }

  static async completeUserProfile(
    userId: string,
    data: {
      firstName: string;
      lastName: string;
      city?: string;
      institution?: string;
      department?: string;
    },
  ): Promise<void> {
    await db
      .update(users)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        city: data.city ?? null,
        institution: data.institution ?? null,
        department: data.department ?? null,
        isCompleted: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }
}

export default AuthRepository;
