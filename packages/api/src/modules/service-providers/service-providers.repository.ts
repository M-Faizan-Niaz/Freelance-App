import type { TX } from '@/lib/types';
import type { NewSpPortfolioImages } from '@/db/models/sp-portfolio-images.model';

import { eq, inArray } from 'drizzle-orm';
import db from '@/db';
import { serviceProviders } from '@/db/models/service-providers.model';
import { spPortfolioImages } from '@/db/models/sp-portfolio-images.model';

export class ServiceProvidersRepository {
  async findByUserId(userId: string) {
    return db.query.serviceProviders.findFirst({
      where: eq(serviceProviders.userId, userId),
    });
  }

  async findById(id: number) {
    return db.query.serviceProviders.findFirst({
      where: eq(serviceProviders.id, id),
    });
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
