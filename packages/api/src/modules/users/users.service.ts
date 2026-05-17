import type { UpdateMeRequest } from './users.schema';

import { NotFoundError } from '@/core/errors';
import db from '@/db';

import { UsersRepository } from './users.repository';

export class UsersService {
  private readonly usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  async getMyProfile(userId: string) {
    const profile = await this.usersRepository.findMergedProfile(userId);
    if (!profile) {
      throw new NotFoundError('User profile not found');
    }
    return profile;
  }

  async updateMyProfile(userId: string, data: UpdateMeRequest) {
    const existing = await this.usersRepository.findMergedProfile(userId);
    if (!existing) {
      throw new NotFoundError('User profile not found');
    }

    const { name, phoneNumber, profilePhotoUrl } = data;

    await db.transaction(async (tx) => {
      if (name !== undefined) {
        await this.usersRepository.updateUser(tx, userId, { name });
      }
      if (phoneNumber !== undefined || profilePhotoUrl !== undefined) {
        const profileUpdate: { phoneNumber?: string; profilePhotoUrl?: string } = {};
        if (phoneNumber !== undefined) profileUpdate.phoneNumber = phoneNumber;
        if (profilePhotoUrl !== undefined) profileUpdate.profilePhotoUrl = profilePhotoUrl;
        await this.usersRepository.updateUserProfile(tx, userId, profileUpdate);
      }
    });

    const updated = await this.usersRepository.findMergedProfile(userId);
    return updated!;
  }
}
