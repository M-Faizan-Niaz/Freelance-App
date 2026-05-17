import { nanoid } from 'nanoid';
import { AppError } from '@/core/errors';
import * as HttpStatusCodes from '@/lib/http-status-codes';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_DOCUMENT_TYPES = [...ALLOWED_IMAGE_TYPES, 'application/pdf'];

export function validateImageFile(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new AppError(
      `Invalid file type: ${file.type}. Allowed: jpeg, png, webp, gif`,
      HttpStatusCodes.BAD_REQUEST,
    );
  }
}

export function validateDocumentFile(file: File): void {
  if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
    throw new AppError(
      `Invalid file type: ${file.type}. Allowed: jpeg, png, webp, gif, pdf`,
      HttpStatusCodes.BAD_REQUEST,
    );
  }
}

export function validateFileSize(file: File, maxMB: number): void {
  const maxBytes = maxMB * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new AppError(
      `File too large: ${file.name}. Maximum size is ${maxMB}MB`,
      HttpStatusCodes.BAD_REQUEST,
    );
  }
}

export function generateUniqueFileName(file: File, folder: string): string {
  const lastDot = file.name.lastIndexOf('.');
  const ext = lastDot !== -1 ? file.name.slice(lastDot + 1) : '';
  const base = lastDot !== -1 ? file.name.slice(0, lastDot) : file.name;
  const safeName = base.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 60);
  return `${folder}/${safeName}-${nanoid()}.${ext}`;
}
