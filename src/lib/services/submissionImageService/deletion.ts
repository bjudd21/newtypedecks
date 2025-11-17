/**
 * Submission image deletion functionality
 */

import path from 'path';
import fs from 'fs/promises';

/**
 * Delete submission image files
 */
export async function deleteSubmissionImage(
  imageFile: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Delete all variants of the image
    const basePath = path.dirname(imageFile);
    const filename = path.basename(imageFile);
    const baseName = path.parse(filename).name;
    const ext = path.parse(filename).ext;

    // Construct paths for all variants
    const originalPath = imageFile;
    const thumbnailPath = path.join(
      path.dirname(basePath),
      'thumbnails',
      `${baseName}-thumb${ext}`
    );
    const largePath = path.join(
      path.dirname(basePath),
      'large',
      `${baseName}-large${ext}`
    );

    // Delete files (ignore errors if files don't exist)
    const deletePromises = [originalPath, thumbnailPath, largePath].map(
      async (filePath) => {
        try {
          await fs.unlink(filePath);
        } catch (error) {
          // File might not exist, which is fine
          console.warn(`Could not delete ${filePath}:`, error);
        }
      }
    );

    await Promise.all(deletePromises);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
