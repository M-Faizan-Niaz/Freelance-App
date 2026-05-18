import { AppError, NotFoundError } from '@/core/errors';
import db from '@/db';
import { storageService } from '@/common/services/storage.service';
import {
  generateUniqueFileName,
  validateFileSize,
  validateImageFile,
} from '@/common/upload-helpers';
import * as HttpStatusCodes from '@/lib/http-status-codes';

import { ServiceProvidersRepository } from './service-providers.repository';

const MAX_PORTFOLIO_IMAGES = 10;

export class ServiceProvidersService {
  private readonly repo: ServiceProvidersRepository;

  constructor() {
    this.repo = new ServiceProvidersRepository();
  }

  async requireServiceProvider(userId: string) {
    const sp = await this.repo.findByUserId(userId);
    if (!sp) {
      throw new NotFoundError('Service provider profile not found');
    }
    return sp;
  }

  async uploadDocuments(userId: string, cnicFront: File, cnicBack: File) {
    const sp = await this.requireServiceProvider(userId);

    if (sp.cnicFrontUrl) {
      const oldName = storageService.extractFileNameFromUrl(sp.cnicFrontUrl);
      if (oldName) {
        try {
          await storageService.deleteFile(oldName);
        } catch {
          /* continue */
        }
      }
    }
    if (sp.cnicBackUrl) {
      const oldName = storageService.extractFileNameFromUrl(sp.cnicBackUrl);
      if (oldName) {
        try {
          await storageService.deleteFile(oldName);
        } catch {
          /* continue */
        }
      }
    }

    const frontFileName = generateUniqueFileName(cnicFront, 'sp-documents');
    const backFileName = generateUniqueFileName(cnicBack, 'sp-documents');

    const [cnicFrontUrl, cnicBackUrl] = await Promise.all([
      storageService.uploadFile(cnicFront, frontFileName),
      storageService.uploadFile(cnicBack, backFileName),
    ]);

    await db.transaction(async (tx) => {
      await this.repo.updateDocuments(tx, sp.id, { cnicFrontUrl, cnicBackUrl });
    });

    return { cnicFrontUrl, cnicBackUrl };
  }

  async listPortfolioImages(serviceProviderId: number) {
    const sp = await this.repo.findById(serviceProviderId);
    if (!sp) throw new NotFoundError('Service provider not found');
    return this.repo.listPortfolioImages(serviceProviderId);
  }

  async uploadPortfolioImages(userId: string, files: File[]) {
    const sp = await this.requireServiceProvider(userId);

    const existing = await this.repo.countPortfolioImages(sp.id);
    if (existing + files.length > MAX_PORTFOLIO_IMAGES) {
      throw new AppError(
        `Cannot upload ${files.length} image(s). You have ${existing} and the limit is ${MAX_PORTFOLIO_IMAGES}.`,
        HttpStatusCodes.BAD_REQUEST,
      );
    }

    const uploaded = [];
    const failed = [];

    for (const file of files) {
      try {
        validateImageFile(file);
        validateFileSize(file, 5);

        const fileName = generateUniqueFileName(file, 'sp-portfolio');
        const url = await storageService.uploadFile(file, fileName);

        const row = await db.transaction(async (tx) =>
          this.repo.insertPortfolioImage(tx, { serviceProviderId: sp.id, fileName, url }),
        );
        uploaded.push(row);
      } catch (error) {
        failed.push({
          fileName: file.name,
          error: error instanceof Error ? error.message : 'Upload failed',
        });
      }
    }

    return { uploaded, failed };
  }

  async deletePortfolioImages(userId: string, fileNames: string[]) {
    const sp = await this.requireServiceProvider(userId);

    const images = await this.repo.findPortfolioImagesByFileNames(sp.id, fileNames);
    if (images.length === 0) {
      throw new NotFoundError('No matching portfolio images found');
    }

    const ids = images.map((img) => img.id);
    await db.transaction(async (tx) => {
      await this.repo.deletePortfolioImages(tx, ids);
    });

    await Promise.allSettled(images.map((img) => storageService.deleteFile(img.fileName)));

    return { deleted: images.map((img) => img.fileName) };
  }
}
