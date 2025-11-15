/**
 * Directory Utilities
 */

import path from 'path';
import fs from 'fs/promises';

/**
 * Create output directories for different formats
 */
export async function createOutputDirectories(
  outputDir: string,
  generateWebP: boolean,
  generateAVIF: boolean
): Promise<void> {
  const directories = [
    path.join(outputDir, 'original'),
    path.join(outputDir, 'thumbnails'),
    path.join(outputDir, 'large'),
  ];

  if (generateWebP) {
    directories.push(
      path.join(outputDir, 'webp', 'original'),
      path.join(outputDir, 'webp', 'thumbnails'),
      path.join(outputDir, 'webp', 'large')
    );
  }

  if (generateAVIF) {
    directories.push(
      path.join(outputDir, 'avif', 'original'),
      path.join(outputDir, 'avif', 'thumbnails'),
      path.join(outputDir, 'avif', 'large')
    );
  }

  for (const dir of directories) {
    await fs.mkdir(dir, { recursive: true });
  }
}
