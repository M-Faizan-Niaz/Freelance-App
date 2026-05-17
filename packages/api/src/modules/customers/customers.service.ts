import type { CreateAddressRequest, UpdateAddressRequest } from './customers.schema';

import { NotFoundError } from '@/core/errors';
import db from '@/db';

import { CustomersRepository } from './customers.repository';

export class CustomersService {
  private readonly repo: CustomersRepository;

  constructor() {
    this.repo = new CustomersRepository();
  }

  async getMyProfile(userId: string) {
    const profile = await this.repo.findProfile(userId);
    if (!profile) {
      throw new NotFoundError('Customer profile not found');
    }
    return profile;
  }

  async listMyAddresses(userId: string) {
    const customer = await this.repo.findByUserId(userId);
    if (!customer) {
      throw new NotFoundError('Customer profile not found');
    }
    return this.repo.listAddresses(customer.id);
  }

  async addAddress(userId: string, data: CreateAddressRequest) {
    const customer = await this.repo.findByUserId(userId);
    if (!customer) {
      throw new NotFoundError('Customer profile not found');
    }
    return db.transaction(async (tx) => this.repo.createAddress(tx, customer.id, data));
  }

  async updateAddress(userId: string, addressId: number, data: UpdateAddressRequest) {
    const customer = await this.repo.findByUserId(userId);
    if (!customer) {
      throw new NotFoundError('Customer profile not found');
    }
    const existing = await this.repo.findAddressById(addressId, customer.id);
    if (!existing) {
      throw new NotFoundError('Address not found');
    }
    return db.transaction(async (tx) =>
      this.repo.updateAddress(tx, addressId, customer.id, data),
    );
  }

  async deleteAddress(userId: string, addressId: number) {
    const customer = await this.repo.findByUserId(userId);
    if (!customer) {
      throw new NotFoundError('Customer profile not found');
    }
    const existing = await this.repo.findAddressById(addressId, customer.id);
    if (!existing) {
      throw new NotFoundError('Address not found');
    }
    await this.repo.deleteAddress(addressId, customer.id);
  }

  async setDefaultAddress(userId: string, addressId: number) {
    const customer = await this.repo.findByUserId(userId);
    if (!customer) {
      throw new NotFoundError('Customer profile not found');
    }
    const existing = await this.repo.findAddressById(addressId, customer.id);
    if (!existing) {
      throw new NotFoundError('Address not found');
    }
    return db.transaction(async (tx) =>
      this.repo.setDefault(tx, addressId, customer.id),
    );
  }
}
