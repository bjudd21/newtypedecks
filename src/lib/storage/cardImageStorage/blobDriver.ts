/**
 * Vercel Blob card image storage driver (production).
 *
 * Uploads the processed variants to Vercel Blob with public access. Requires
 * the BLOB_READ_WRITE_TOKEN environment variable (added automatically when a
 * Blob store is connected to the Vercel project).
 */

import { put } from '@vercel/blob';
import { processCardImageVariants } from './processVariants';
import type { CardImageStorageDriver, StoredCardImages } from './types';

export class VercelBlobCardImageStorage implements CardImageStorageDriver {
  readonly provider = 'vercel-blob' as const;

  async store(file: File, baseName: string): Promise<StoredCardImages> {
    const { variants, metadata } = await processCardImageVariants(file);

    const uploads = await Promise.all(
      variants.map(async (v) => {
        const blob = await put(
          `cards/${v.variant}/${baseName}-${v.variant}.${v.format}`,
          v.buffer,
          {
            access: 'public',
            contentType: v.contentType,
            addRandomSuffix: false,
          }
        );
        return [v.variant, blob.url] as const;
      })
    );

    const urls = Object.fromEntries(uploads) as Record<
      'original' | 'large' | 'thumbnail',
      string
    >;

    return {
      imageUrl: urls.original,
      imageUrlSmall: urls.thumbnail,
      imageUrlLarge: urls.large,
      provider: this.provider,
      metadata,
    };
  }
}
