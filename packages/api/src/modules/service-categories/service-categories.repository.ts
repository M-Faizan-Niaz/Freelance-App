import type { UpdateServiceCategoryRequest } from './service-categories.schema';
import type { NewServiceCategories } from '@/db/models/lookups.model';
import type { TX } from '@/lib/types';

type ServiceCategoryUpdate = UpdateServiceCategoryRequest & { imageUrl?: string | null };
import { asc, eq, inArray } from 'drizzle-orm';
import db from '@/db';
import { serviceCategories } from '@/db/models';

export class ServiceCategoriesRepository {
  async findById(id: number) {
    return db.query.serviceCategories.findFirst({
      where: eq(serviceCategories.id, id),
    });
  }

  async listActive() {
    return db.query.serviceCategories.findMany({
      where: (t, { and, eq }) => and(eq(t.isDeleted, false), eq(t.isActive, true)),
      orderBy: [asc(serviceCategories.name)],
    });
  }

  async create(tx: TX, data: NewServiceCategories) {
    const [result] = await tx.insert(serviceCategories).values(data).returning();
    return result;
  }

  async update(tx: TX, id: number, data: ServiceCategoryUpdate) {
    const [result] = await tx
      .update(serviceCategories)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(serviceCategories.id, id))
      .returning();
    return result;
  }

  async softDeleteMany(tx: TX, ids: number[]) {
    const result = await tx
      .update(serviceCategories)
      .set({ isDeleted: true, deletedAt: new Date().toISOString() })
      .where(inArray(serviceCategories.id, ids))
      .returning();
    return result.length > 0;
  }
}
