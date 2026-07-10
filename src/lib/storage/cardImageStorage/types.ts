/**
 * Card Image Storage — driver types
 *
 * A storage driver takes a validated upload and returns public URLs for the
 * three image sizes the Card model stores (imageUrl / imageUrlSmall /
 * imageUrlLarge). Local disk is used in development; Vercel Blob in
 * production. Additional providers (e.g. Cloudflare R2) can be added by
 * implementing CardImageStorageDriver.
 */

export type CardImageStorageProvider = 'local' | 'vercel-blob';

export interface StoredCardImages {
  /** Primary display image (original, capped at 2048px). Maps to Card.imageUrl. */
  imageUrl: string;
  /** Thumbnail (~300px). Maps to Card.imageUrlSmall. */
  imageUrlSmall: string;
  /** Large (~800px). Maps to Card.imageUrlLarge. */
  imageUrlLarge: string;
  provider: CardImageStorageProvider;
  metadata: {
    originalWidth: number;
    originalHeight: number;
    originalFormat: string;
    originalSize: number;
  };
}

export interface ProcessedVariantBuffer {
  variant: 'original' | 'large' | 'thumbnail';
  buffer: Buffer;
  format: 'jpeg' | 'png' | 'webp';
  contentType: string;
  width: number;
  height: number;
}

export interface CardImageStorageDriver {
  readonly provider: CardImageStorageProvider;
  /**
   * Persist all size variants of a card image and return their public URLs.
   * @param file the validated uploaded file
   * @param baseName sanitized, unique base filename (no extension)
   */
  store(file: File, baseName: string): Promise<StoredCardImages>;
}
