/**
 * Submission temporary file cleanup functionality
 */

import path from 'path';
import fs from 'fs/promises';
import { TEMP_DIR } from './constants';

/**
 * Clean up old temporary files
 */
export async function cleanupTempFiles(
  maxAge: number = 24 * 60 * 60 * 1000
): Promise<void> {
  try {
    const tempDir = path.join(process.cwd(), TEMP_DIR);
    await fs.mkdir(tempDir, { recursive: true });

    const files = await fs.readdir(tempDir);
    const now = Date.now();

    for (const file of files) {
      if (file === '.gitkeep') continue;

      const filePath = path.join(tempDir, file);
      try {
        const stats = await fs.stat(filePath);

        if (now - stats.mtime.getTime() > maxAge) {
          await fs.unlink(filePath);
        }
      } catch (error) {
        console.warn(`Could not process temp file ${file}:`, error);
      }
    }
  } catch (error) {
    console.error('Failed to cleanup temp files:', error);
  }
}
