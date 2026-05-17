import type { TX } from '@/lib/types';

import { eq } from 'drizzle-orm';
import db from '@/db';
import users from '@/modules/users/users.model';
import { userProfiles } from '@/db/models/user-profiles.model';

export class UsersRepository {
  async findMergedProfile(userId: string) {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        emailVerified: users.emailVerified,
        image: users.image,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        fullName: userProfiles.fullName,
        phoneNumber: userProfiles.phoneNumber,
        phoneVerified: userProfiles.phoneVerified,
        profilePhotoUrl: userProfiles.profilePhotoUrl,
        roleId: userProfiles.roleId,
        isActive: userProfiles.isActive,
      })
      .from(users)
      .leftJoin(userProfiles, eq(userProfiles.userId, users.id))
      .where(eq(users.id, userId))
      .limit(1);

    return result[0] ?? null;
  }

  async updateUser(tx: TX, userId: string, data: { name?: string }) {
    await tx.update(users).set(data).where(eq(users.id, userId));
  }

  async updateUserProfile(
    tx: TX,
    userId: string,
    data: { phoneNumber?: string; profilePhotoUrl?: string },
  ) {
    await tx.update(userProfiles).set(data).where(eq(userProfiles.userId, userId));
  }
}
