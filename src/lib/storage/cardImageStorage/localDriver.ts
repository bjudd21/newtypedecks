/**
 * Local-disk card image storage driver (development).
 *
 * Writes variants under uploads/cards/<variant>/ and serves them through
 * GET /api/uploads/cards/[...path]. Not durable on Vercel — production uses
 * the Vercel Blob driver instead.
 */

import path from 'path';
import fs from 'fs/promises';
import { processCardImageVariants } from './processVariants';
import type { CardImageStorageDriver, StoredCardImages } from './types';

const UPLOAD_ROOT = ['uploads', 'cards'];
const PUBLIC_ROOT = '/api/uploads/cards';

export class LocalCardImageStorage implements CardImageStorageDriver {
  readonly provider = 'local' as const;

  async store(file: File, baseName: string): Promise<StoredCardImages> {
    const { variants, metadata } = await processCardImageVariants(file);
    const urls: Partial<Record<(typeof variants)[number]['variant'], string>> =
      {};

    for (const v of variants) {
      const dir = path.join(process.cwd(), ...UPLOAD_ROOT, v.variant);
      await fs.mkdir(dir, { recursive: true });

      const filename = `${baseName}-${v.variant}.${v.format}`;
      await fs.writeFile(path.join(dir, filename), v.buffer);
      urls[v.variant] = `${PUBLIC_ROOT}/${v.variant}/${filename}`;
    }

    if (!urls.original || !urls.large || !urls.thumbnail) {
      throw new Error('Failed to store all image variants');
    }

    return {
      imageUrl: urls.original,
      imageUrlSmall: urls.thumbnail,
      imageUrlLarge: urls.large,
      provider: this.provider,
      metadata,
    };
  }
}
