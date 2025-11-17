/**
 * Submission image info functionality
 */

import fs from 'fs/promises';

/**
 * Get image info and verify existence
 */
export async function getImageInfo(imageFile: string) {
  try {
    const stats = await fs.stat(imageFile);
    return {
      exists: true,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
    };
  } catch {
    return {
      exists: false,
    };
  }
}
