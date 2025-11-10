/**
 * Directory initialization utilities
 *
 * Ensures required directories exist for file uploads and processing
 */

import fs from 'fs/promises';
import path from 'path';

export async function initializeUploadDirectories(): Promise<void> {
  const directories = [
    // General uploads
    'uploads',

    // Submission directories
    'uploads/submissions',
    'uploads/submissions/original',
    'uploads/submissions/thumbnails',
    'uploads/submissions/large',

    // Temporary directories
    'uploads/temp',

    // Card directories (existing system)
    'uploads/cards',
    'uploads/cards/original',
    'uploads/cards/thumbnails',
    'uploads/cards/large',
  ];

  for (const dir of directories) {
    const fullPath = path.join(process.cwd(), dir);
    try {
      await fs.mkdir(fullPath, { recursive: true });
    } catch (error) {
      console.warn(`Could not create directory ${dir}:`, error);
    }
  }

  // Create .gitkeep files to ensure directories are tracked
  const gitkeepDirs = [
    'uploads/temp',
    'uploads/submissions/original',
    'uploads/submissions/thumbnails',
    'uploads/submissions/large',
  ];

  for (const dir of gitkeepDirs) {
    const gitkeepPath = path.join(process.cwd(), dir, '.gitkeep');
    try {
      await fs.writeFile(gitkeepPath, '# Keep this directory in git\n', {
        flag: 'wx',
      });
    } catch (_error) {
      // File might already exist, which is fine
    }
  }
}

export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.warn(`Could not create directory ${dirPath}:`, error);
  }
}
