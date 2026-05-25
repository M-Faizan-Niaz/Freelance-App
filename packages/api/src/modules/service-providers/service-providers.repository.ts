import type { TX } from '@/lib/types';
import type { NewSpPortfolioImages } from '@/db/models/sp-portfolio-images.model';
import type { UpdateProviderProfileRequest } from './service-providers.schema';

import { and, count, eq, ilike, inArray } from 'drizzle-orm';
import db from '@/db';
import { tiers } from '@/db/models/lookups.model';
import { serviceProviders } from '@/db/models/service-providers.model';
import { spPortfolioImages } from '@/db/models/sp-portfolio-images.model';
import { userProfiles } from '@/db/models/user-profiles.model';
import { getPaginationValues } from '@/lib/searching-sorting';

export class ServiceProvidersRepository {
  async findByUserId(userId: string) {
    return db.query.serviceProviders.findFirst({
      where: eq(serviceProviders.userId, userId),
    });
  }

  async getFullProfileByUserId(userId: string) {
    const rows = await db
      .select({
        id: serviceProviders.id,
        fullName: userProfiles.fullName,
        bio: serviceProviders.bio,
        hourlyRate: serviceProviders.hourlyRate,
        coverageRadiusKm: serviceProviders.coverageRadiusKm,
        city: serviceProviders.city,
        cnicFrontUrl: serviceProviders.cnicFrontUrl,
        cnicBackUrl: serviceProviders.cnicBackUrl,
        isCnicVerified: serviceProviders.isCnicVerified,
        verificationStatus: serviceProviders.verificationStatus,
        isOnline: serviceProviders.isOnline,
        totalJobsCompleted: serviceProviders.totalJobsCompleted,
        averageRating: serviceProviders.averageRating,
        categoryIds: serviceProviders.categoryIds,
        createdAt: serviceProviders.createdAt,
        updatedAt: serviceProviders.updatedAt,
      })
      .from(serviceProviders)
      .innerJoin(userProfiles, eq(userProfiles.userId, serviceProviders.userId))
      .where(and(eq(serviceProviders.userId, userId), eq(serviceProviders.isDeleted, false)))
      .limit(1);
    return rows[0] ?? null;
  }

  async updateProfile(id: number, data: UpdateProviderProfileRequest) {
    const patch: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (data.bio !== undefined) patch.bio = data.bio;
    if (data.hourlyRate !== undefined) patch.hourlyRate = String(data.hourlyRate);
    if (data.coverageRadiusKm !== undefined) patch.coverageRadiusKm = String(data.coverageRadiusKm);
    if (data.categoryIds !== undefined) patch.categoryIds = data.categoryIds;

    const [row] = await db
      .update(serviceProviders)
      .set(patch)
      .where(eq(serviceProviders.id, id))
      .returning();
    return row;
  }

  async findById(id: number) {
    return db.query.serviceProviders.findFirst({
      where: eq(serviceProviders.id, id),
    });
  }

  async listApprovedProviders(params: { page: number; limit: number; city?: string }) {
    const { limit: limitVal, offset } = getPaginationValues(params.page, params.limit);

    const conditions = [
      eq(serviceProviders.isDeleted, false),
      eq(serviceProviders.verificationStatus, 'approved'),
    ];
    if (params.city) {
      conditions.push(ilike(serviceProviders.city, `%${params.city}%`));
    }
    const where = and(...conditions);

    const [{ value: total }] = await db
      .select({ value: count() })
      .from(serviceProviders)
      .where(where);

    const data = await db
      .select({
        id: serviceProviders.id,
        fullName: userProfiles.fullName,
        verificationStatus: serviceProviders.verificationStatus,
        isCnicVerified: serviceProviders.isCnicVerified,
        hourlyRate: serviceProviders.hourlyRate,
        tierId: serviceProviders.tierId,
        tierName: tiers.name,
        isOnline: serviceProviders.isOnline,
        totalJobsCompleted: serviceProviders.totalJobsCompleted,
        averageRating: serviceProviders.averageRating,
        bio: serviceProviders.bio,
        city: serviceProviders.city,
        coverageRadiusKm: serviceProviders.coverageRadiusKm,
        createdAt: serviceProviders.createdAt,
        updatedAt: serviceProviders.updatedAt,
      })
      .from(serviceProviders)
      .innerJoin(userProfiles, eq(userProfiles.userId, serviceProviders.userId))
      .innerJoin(tiers, eq(tiers.id, serviceProviders.tierId))
      .where(where)
      .orderBy(serviceProviders.id)
      .limit(limitVal)
      .offset(offset);

    return { data, total };
  }

  async getPublicProviderById(id: number) {
    const rows = await db
      .select({
        id: serviceProviders.id,
        fullName: userProfiles.fullName,
        verificationStatus: serviceProviders.verificationStatus,
        isCnicVerified: serviceProviders.isCnicVerified,
        hourlyRate: serviceProviders.hourlyRate,
        tierId: serviceProviders.tierId,
        tierName: tiers.name,
        isOnline: serviceProviders.isOnline,
        totalJobsCompleted: serviceProviders.totalJobsCompleted,
        averageRating: serviceProviders.averageRating,
        bio: serviceProviders.bio,
        city: serviceProviders.city,
        coverageRadiusKm: serviceProviders.coverageRadiusKm,
        createdAt: serviceProviders.createdAt,
        updatedAt: serviceProviders.updatedAt,
      })
      .from(serviceProviders)
      .innerJoin(userProfiles, eq(userProfiles.userId, serviceProviders.userId))
      .innerJoin(tiers, eq(tiers.id, serviceProviders.tierId))
      .where(
        and(
          eq(serviceProviders.id, id),
          eq(serviceProviders.isDeleted, false),
          eq(serviceProviders.verificationStatus, 'approved'),
        ),
      )
      .limit(1);

    return rows[0] ?? null;
  }

  async updateDocuments(tx: TX, id: number, data: { cnicFrontUrl?: string; cnicBackUrl?: string }) {
    await tx.update(serviceProviders).set(data).where(eq(serviceProviders.id, id));
  }

  async countPortfolioImages(serviceProviderId: number): Promise<number> {
    const rows = await db
      .select({ id: spPortfolioImages.id })
      .from(spPortfolioImages)
      .where(eq(spPortfolioImages.serviceProviderId, serviceProviderId));
    return rows.length;
  }

  async listPortfolioImages(serviceProviderId: number) {
    return db.query.spPortfolioImages.findMany({
      where: eq(spPortfolioImages.serviceProviderId, serviceProviderId),
      orderBy: (t, { asc }) => [asc(t.createdAt)],
    });
  }

  async insertPortfolioImage(tx: TX, data: NewSpPortfolioImages) {
    const [row] = await tx.insert(spPortfolioImages).values(data).returning();
    return row;
  }

  async findPortfolioImagesByFileNames(serviceProviderId: number, fileNames: string[]) {
    return db.query.spPortfolioImages.findMany({
      where: (t, { and, inArray: inn }) =>
        and(eq(t.serviceProviderId, serviceProviderId), inn(t.fileName, fileNames)),
    });
  }

  async deletePortfolioImages(tx: TX, ids: number[]) {
    await tx.delete(spPortfolioImages).where(inArray(spPortfolioImages.id, ids));
  }
}
