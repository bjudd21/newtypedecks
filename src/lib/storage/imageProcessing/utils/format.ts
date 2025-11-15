/**
 * Format Utilities
 */

/**
 * Determine optimal output format based on input format
 */
export function determineOptimalFormat(inputFormat: string): 'jpeg' | 'png' | 'webp' {
  switch (inputFormat.toLowerCase()) {
    case 'png':
      return 'png'; // Preserve PNG for images with transparency
    case 'gif':
      return 'png'; // Convert GIF to PNG to preserve transparency
    case 'webp':
      return 'webp'; // Keep WebP if already in WebP
    default:
      return 'jpeg'; // Default to JPEG for photos
  }
}

/**
 * Get optimal quality setting based on format and variant
 */
export function getOptimalQuality(
  format: 'jpeg' | 'png' | 'webp' | 'avif',
  variant: string
): number {
  const qualityMap = {
    jpeg: {
      original: 92,
      large: 88,
      thumbnail: 82,
    },
    png: {
      original: 95,
      large: 90,
      thumbnail: 85,
    },
    webp: {
      original: 85,
      large: 80,
      thumbnail: 75,
    },
    avif: {
      original: 80,
      large: 75,
      thumbnail: 70,
    },
  };

  return (
    qualityMap[format]?.[variant as keyof (typeof qualityMap)[typeof format]] ||
    85
  );
}
