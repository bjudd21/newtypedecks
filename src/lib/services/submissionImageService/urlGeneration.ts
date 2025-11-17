/**
 * Submission image URL generation functionality
 */

import path from 'path';
import { UPLOADS_DIR } from './constants';

/**
 * Generate image URLs for a submission
 */
export function generateImageUrls(imageFile: string) {
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? '/api/uploads/submissions'
      : process.env.CDN_BASE_URL || '/uploads/submissions';

  const _basePath = path.dirname(imageFile);
  const filename = path.basename(imageFile);
  const baseName = path.parse(filename).name;
  const ext = path.parse(filename).ext;

  const uploadsDir = path.join(process.cwd(), UPLOADS_DIR);

  const relativeOriginal = path.relative(uploadsDir, imageFile);
  const relativeThumbnail = path.join(
    'thumbnails',
    `${baseName}-thumb${ext}`
  );
  const relativeLarge = path.join('large', `${baseName}-large${ext}`);

  return {
    original: `${baseUrl}/${relativeOriginal.replace(/\\/g, '/')}`,
    thumbnail: `${baseUrl}/${relativeThumbnail.replace(/\\/g, '/')}`,
    large: `${baseUrl}/${relativeLarge.replace(/\\/g, '/')}`,
  };
}
