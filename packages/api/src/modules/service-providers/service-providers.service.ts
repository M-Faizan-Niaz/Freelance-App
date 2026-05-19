import { AppError, NotFoundError } from '@/core/errors';
import db from '@/db';
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

  async uploadDocuments(
    userId: string,
    data: { cnicFrontUrl: string; cnicBackUrl: string },
  ) {
    const sp = await this.requireServiceProvider(userId);
    const oldUrls = {
      cnicFrontUrl: sp.cnicFrontUrl ?? null,
      cnicBackUrl: sp.cnicBackUrl ?? null,
    };

    await db.transaction(async (tx) => {
      await this.repo.updateDocuments(tx, sp.id, data);
    });

    return { ...data, oldUrls };
  }

  async listPortfolioImages(serviceProviderId: number) {
    const sp = await this.repo.findById(serviceProviderId);
    if (!sp) throw new NotFoundError('Service provider not found');
    return this.repo.listPortfolioImages(serviceProviderId);
  }

  async uploadPortfolioImages(
    userId: string,
    photos: { imageUrl: string; fileName: string }[],
  ) {
    const sp = await this.requireServiceProvider(userId);

    const existing = await this.repo.countPortfolioImages(sp.id);
    if (existing + photos.length > MAX_PORTFOLIO_IMAGES) {
      throw new AppError(
        `Cannot upload ${photos.length} image(s). You have ${existing} and the limit is ${MAX_PORTFOLIO_IMAGES}.`,
        HttpStatusCodes.BAD_REQUEST,
      );
    }

    const rows = await Promise.all(
      photos.map(({ imageUrl, fileName }) =>
        db.transaction((tx) =>
          this.repo.insertPortfolioImage(tx, { serviceProviderId: sp.id, url: imageUrl, fileName }),
        ),
      ),
    );

    return rows;
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

    return images.map((img) => img.fileName);
  }
}
