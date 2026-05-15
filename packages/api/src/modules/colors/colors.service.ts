import type {
  CreateColorsRequest,
  CreateColorsResponse,
  UpdateColorsRequest,
} from './colors.schema';
import { NotFoundError } from '@/core/errors';
import { AppError } from '@/core/errors/app-error';

import db from '@/db';

import { ColorsRepository } from './colors.repository';

export class ColorsService {
  private readonly colorsRepository: ColorsRepository;

  /**
   * Create a new ColorsService
   * Initializes the colors repository for database operations
   */
  constructor() {
    this.colorsRepository = new ColorsRepository();
  }

  /**
   * Create a new colors
   *
   * @param colorsData - Colors data
   * @returns The created colors object
   */
  async createColors(colorsData: CreateColorsRequest): Promise<CreateColorsResponse> {
    const colors = await db.transaction(async (tx) => {
      // Create colors
      const colors = await this.colorsRepository.create(tx, {
        ...colorsData,
      });

      return colors;
    });

    // fetch colors
    const colorsWithAttributeType = await this.colorsRepository.findById(colors.id);
    if (!colorsWithAttributeType) {
      throw new AppError('Colors could not be fetched after creation');
    }
    return colorsWithAttributeType as CreateColorsResponse;
  }

  /**
   * List colors with pagination, filtering, and sorting
   *
   * @param params - Search parameters
   * @param params.search - Search query
   * @param params.page - Page number
   * @param params.limit - Number of items per page
   * @param params.sortBy - Field to sort by
   * @param params.sortOrder - Sort order
   * @param params.filters - Filters to apply
   * @returns List of suppliers and total count
   */
  async listColors(params: {
    search?: string;
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: Record<string, any>;
  }) {
    return await this.colorsRepository.list(params);
  }

  /**
   * Get a colors by id
   *
   * @param id - Colors id
   * @returns The colors object
   */
  async getColorsById(id: number) {
    const colors = await this.colorsRepository.findById(id);
    if (!colors) {
      throw new NotFoundError('Colors not found');
    }
    return colors;
  }

  /**
   * Update a colors
   *
   * @param id - Colors id
   * @param colorsData - Colors data
   * @returns The updated colors object
   */
  async updateColors(id: number, colorsData: UpdateColorsRequest) {
    const colors = await this.colorsRepository.findById(id);

    if (!colors) {
      throw new NotFoundError('Colors not found');
    }

    await db.transaction(async (tx) => {
      // Update colors
      await this.colorsRepository.update(tx, id, {
        ...colorsData,
      });
    });
    // fetch colors
    const colorsWithAttributeType = await this.colorsRepository.findById(colors.id);
    if (!colorsWithAttributeType) {
      throw new AppError('Colors could not be fetched after update');
    }
    return colorsWithAttributeType as CreateColorsResponse;
  }

  /**
   * Delete multiple colors
   *
   * @param ids - Array of colors IDs to delete
   * @returns True if all deletions were successful
   */
  async deleteColors(ids: number[]) {
    const result = await db.transaction(async (tx) => {
      return await this.colorsRepository.softDeleteMany(tx, ids);
    });
    if (!result) {
      throw new AppError('Failed to delete colors');
    }
    return result;
  }
}
