/**
 * CDN Utilities
 * Helper functions for CDN operations
 */

/**
 * Convert absolute path to relative path for URL generation
 */
export function relativizePath(absolutePath: string): string {
  // Remove the uploads directory prefix for URL generation
  const uploadsPrefix = /.*\/uploads\//;
  return absolutePath.replace(uploadsPrefix, '');
}
