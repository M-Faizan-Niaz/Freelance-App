import type { TX } from '@/lib/types';
import type { CreateAddressRequest, UpdateAddressRequest } from './customers.schema';

import { asc, desc, eq, and } from 'drizzle-orm';
import db from '@/db';
import { customers } from '@/db/models/customers.model';
import { savedAddresses } from '@/db/models/saved-addresses.model';
import { customerStatuses } from '@/db/models/lookups.model';
import { userProfiles } from '@/db/models/user-profiles.model';
import users from '@/modules/users/users.model';

export class CustomersRepository {
  async findByUserId(userId: string) {
    return db.query.customers.findFirst({
      where: and(eq(customers.userId, userId), eq(customers.isDeleted, false)),
    });
  }

  async findProfile(userId: string) {
    const rows = await db
      .select({
        id: customers.id,
        userId: customers.userId,
        totalBookings: customers.totalBookings,
        totalSpent: customers.totalSpent,
        status: customerStatuses.name,
        fullName: userProfiles.fullName,
        email: users.email,
        phoneNumber: userProfiles.phoneNumber,
        profilePhotoUrl: userProfiles.profilePhotoUrl,
        createdAt: customers.createdAt,
      })
      .from(customers)
      .innerJoin(users, eq(users.id, customers.userId))
      .leftJoin(userProfiles, eq(userProfiles.userId, customers.userId))
      .innerJoin(customerStatuses, eq(customerStatuses.id, customers.customerStatusId))
      .where(and(eq(customers.userId, userId), eq(customers.isDeleted, false)))
      .limit(1);

    return rows[0] ?? null;
  }

  async listAddresses(customerId: number) {
    return db.query.savedAddresses.findMany({
      where: eq(savedAddresses.customerId, customerId),
      orderBy: [desc(savedAddresses.isDefault), asc(savedAddresses.createdAt)],
    });
  }

  async findAddressById(id: number, customerId: number) {
    return db.query.savedAddresses.findFirst({
      where: and(eq(savedAddresses.id, id), eq(savedAddresses.customerId, customerId)),
    });
  }

  async unsetDefault(tx: TX, customerId: number) {
    await tx
      .update(savedAddresses)
      .set({ isDefault: false })
      .where(eq(savedAddresses.customerId, customerId));
  }

  async createAddress(tx: TX, customerId: number, data: CreateAddressRequest) {
    if (data.isDefault) {
      await this.unsetDefault(tx, customerId);
    }
    const [row] = await tx
      .insert(savedAddresses)
      .values({
        customerId,
        label: data.label,
        addressText: data.addressText,
        latitude: data.latitude !== undefined ? String(data.latitude) : null,
        longitude: data.longitude !== undefined ? String(data.longitude) : null,
        isDefault: data.isDefault ?? false,
      })
      .returning();
    return row;
  }

  async updateAddress(tx: TX, id: number, customerId: number, data: UpdateAddressRequest) {
    if (data.isDefault) {
      await this.unsetDefault(tx, customerId);
    }
    const updateData: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };
    if (data.label !== undefined) updateData.label = data.label;
    if (data.addressText !== undefined) updateData.addressText = data.addressText;
    if (data.latitude !== undefined) updateData.latitude = String(data.latitude);
    if (data.longitude !== undefined) updateData.longitude = String(data.longitude);
    if (data.isDefault !== undefined) updateData.isDefault = data.isDefault;

    const [row] = await tx
      .update(savedAddresses)
      .set(updateData)
      .where(and(eq(savedAddresses.id, id), eq(savedAddresses.customerId, customerId)))
      .returning();
    return row;
  }

  async deleteAddress(id: number, customerId: number) {
    const result = await db
      .delete(savedAddresses)
      .where(and(eq(savedAddresses.id, id), eq(savedAddresses.customerId, customerId)))
      .returning();
    return result.length > 0;
  }

  async setDefault(tx: TX, id: number, customerId: number) {
    await this.unsetDefault(tx, customerId);
    const [row] = await tx
      .update(savedAddresses)
      .set({ isDefault: true, updatedAt: new Date().toISOString() })
      .where(and(eq(savedAddresses.id, id), eq(savedAddresses.customerId, customerId)))
      .returning();
    return row;
  }
}
