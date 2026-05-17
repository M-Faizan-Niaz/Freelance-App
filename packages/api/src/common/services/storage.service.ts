import { Buffer } from 'node:buffer';
import { Client } from 'minio';

import env from '@/config/env.config';
import { AppError } from '@/core/errors';

export interface FileInfo {
  fileName: string;
  size: number;
  contentType: string | null;
  lastModified: string;
  url: string;
}

export class StorageService {
  private readonly client: Client;
  private readonly bucketName: string;

  constructor() {
    this.client = new Client({
      endPoint: env.MINIO_ENDPOINT,
      port: env.MINIO_PORT,
      useSSL: env.MINIO_USE_SSL,
      accessKey: env.MINIO_ACCESS_KEY,
      secretKey: env.MINIO_SECRET_KEY,
    });
    this.bucketName = env.MINIO_BUCKET_NAME;
    void this.initBucket();
  }

  private async initBucket() {
    try {
      const exists = await this.client.bucketExists(this.bucketName);
      if (!exists) {
        await this.client.makeBucket(this.bucketName, 'us-east-1');
      }
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
          },
        ],
      };
      await this.client.setBucketPolicy(this.bucketName, JSON.stringify(policy));
    } catch (error) {
      console.error('Error initializing MinIO bucket:', error);
    }
  }

  private getPublicUrl(fileName: string): string {
    const protocol = env.MINIO_USE_SSL ? 'https' : 'http';
    const portStr =
      env.MINIO_PORT === 80 || env.MINIO_PORT === 443 ? '' : `:${env.MINIO_PORT}`;
    return `${protocol}://${env.MINIO_ENDPOINT}${portStr}/${this.bucketName}/${fileName}`;
  }

  async uploadFile(file: File, fileName: string): Promise<string> {
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      await this.client.putObject(this.bucketName, fileName, buffer, file.size, {
        'Content-Type': file.type,
      });
      return this.getPublicUrl(fileName);
    } catch (error) {
      console.error('Upload error:', error);
      throw new AppError('Failed to upload file', 500);
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      await this.client.removeObject(this.bucketName, fileName);
    } catch (error) {
      console.error('Delete error:', error);
      throw new AppError('Failed to delete file', 500);
    }
  }

  async getFileInfo(fileName: string): Promise<FileInfo> {
    try {
      const stat = await this.client.statObject(this.bucketName, fileName);
      return {
        fileName,
        size: stat.size,
        contentType: stat.metaData?.['content-type'] ?? null,
        lastModified: stat.lastModified.toISOString(),
        url: this.getPublicUrl(fileName),
      };
    } catch {
      throw new AppError('File not found', 404);
    }
  }

  async fileExists(fileName: string): Promise<boolean> {
    try {
      await this.client.statObject(this.bucketName, fileName);
      return true;
    } catch {
      return false;
    }
  }

  async getPresignedUrl(fileName: string, expiry = 3600): Promise<string> {
    try {
      return await this.client.presignedPutObject(this.bucketName, fileName, expiry);
    } catch (error) {
      console.error('Presigned URL error:', error);
      throw new AppError('Failed to generate presigned URL', 500);
    }
  }

  extractFileNameFromUrl(url: string): string | null {
    try {
      const prefix = `/${this.bucketName}/`;
      const idx = url.indexOf(prefix);
      return idx !== -1 ? url.slice(idx + prefix.length) : null;
    } catch {
      return null;
    }
  }
}

export const storageService = new StorageService();
