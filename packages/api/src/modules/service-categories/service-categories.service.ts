import type {
  CreateServiceCategoryRequest,
  ServiceCategoryResponse,
  UpdateServiceCategoryRequest,
} from './service-categories.schema';
import { NotFoundError, AppError } from '@/core/errors';
import db from '@/db';
import { storageService } from '@/common/services/storage.service';
import { generateUniqueFileName } from '@/common/upload-helpers';
import { ServiceCategoriesRepository } from './service-categories.repository';

export class ServiceCategoriesService {
  private readonly repo: ServiceCategoriesRepository;

  constructor() {
    this.repo = new ServiceCategoriesRepository();
  }

  async listActive() {
    return this.repo.listActive();
  }

  async create(data: CreateServiceCategoryRequest): Promise<ServiceCategoryResponse> {
    const created = await db.transaction(async (tx) => this.repo.create(tx, data));
    const fresh = await this.repo.findById(created.id);
    if (!fresh) throw new AppError('Service category could not be fetched after creation');
    return fresh;
  }

  async update(id: number, data: UpdateServiceCategoryRequest): Promise<ServiceCategoryResponse> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundError('Service category not found');

    await db.transaction(async (tx) => this.repo.update(tx, id, data));

    const fresh = await this.repo.findById(id);
    if (!fresh) throw new AppError('Service category could not be fetched after update');
    return fresh;
  }

  async deleteMany(ids: number[]) {
    const success = await db.transaction(async (tx) => this.repo.softDeleteMany(tx, ids));
    if (!success) throw new AppError('Failed to delete service categories');
  }

  async uploadImage(id: number, file: File): Promise<ServiceCategoryResponse> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundError('Service category not found');

    if (existing.imageUrl) {
      const oldName = storageService.extractFileNameFromUrl(existing.imageUrl);
      if (oldName) {
        try {
          await storageService.deleteFile(oldName);
        } catch {
          /* continue */
        }
      }
    }

    const fileName = generateUniqueFileName(file, 'service-categories');
    const imageUrl = await storageService.uploadFile(file, fileName);

    await db.transaction(async (tx) => this.repo.update(tx, id, { imageUrl }));

    const fresh = await this.repo.findById(id);
    if (!fresh) throw new AppError('Service category could not be fetched after update');
    return fresh;
  }
}
