/**
 * Card Image Storage — driver selection.
 *
 * Provider is chosen by environment:
 *  - CARD_IMAGE_STORAGE=local | vercel-blob (explicit override)
 *  - otherwise: Vercel Blob when BLOB_READ_WRITE_TOKEN is present (production),
 *    local disk when it is not (development).
 */

import { LocalCardImageStorage } from './localDriver';
import { VercelBlobCardImageStorage } from './blobDriver';
import type { CardImageStorageDriver } from './types';

export type {
  CardImageStorageDriver,
  CardImageStorageProvider,
  StoredCardImages,
} from './types';
export { processCardImageVariants } from './processVariants';

export function getCardImageStorage(): CardImageStorageDriver {
  const override = process.env.CARD_IMAGE_STORAGE;

  if (override === 'local') return new LocalCardImageStorage();
  if (override === 'vercel-blob') return new VercelBlobCardImageStorage();

  return process.env.BLOB_READ_WRITE_TOKEN
    ? new VercelBlobCardImageStorage()
    : new LocalCardImageStorage();
}
