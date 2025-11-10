/**
 * Cleanup Service
 *
 * Handles cleanup tasks like removing temporary files and orphaned data
 */

import { SubmissionImageService } from './submissionImageService';
import { cleanupTempFiles as cleanupGeneralTempFiles } from '@/lib/storage/fileUpload';

export class CleanupService {
  private static instance: CleanupService;

  private constructor() {}

  public static getInstance(): CleanupService {
    if (!CleanupService.instance) {
      CleanupService.instance = new CleanupService();
    }
    return CleanupService.instance;
  }

  /**
   * Run all cleanup tasks
   */
  async runCleanup(): Promise<void> {
    console.warn('Starting cleanup tasks...');

    try {
      // Clean up temporary files
      await this.cleanupTempFiles();

      // Clean up orphaned submission images (future enhancement)
      // await this.cleanupOrphanedImages();

      console.warn('Cleanup tasks completed successfully');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  /**
   * Clean up temporary files
   */
  private async cleanupTempFiles(): Promise<void> {
    console.warn('Cleaning up temporary files...');

    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    try {
      // Clean submission temp files
      await SubmissionImageService.cleanupTempFiles(maxAge);

      // Clean general temp files
      await cleanupGeneralTempFiles(maxAge);

      console.warn('Temporary files cleanup completed');
    } catch (error) {
      console.error('Error cleaning up temp files:', error);
    }
  }

  /**
   * Clean up orphaned submission images
   * (Images that exist on disk but have no corresponding database record)
   */
  private async cleanupOrphanedImages(): Promise<void> {
    console.warn('Cleaning up orphaned images...');
    // TODO: Implement orphaned image cleanup
    // This would involve:
    // 1. Scanning the uploads/submissions directory
    // 2. Checking if each image has a corresponding submission record
    // 3. Removing images that have no database record (older than X days)
  }

  /**
   * Schedule cleanup to run periodically
   */
  startPeriodicCleanup(intervalMs: number = 6 * 60 * 60 * 1000): void {
    // Default: every 6 hours
    console.warn(`Starting periodic cleanup with interval: ${intervalMs}ms`);

    // Run cleanup immediately
    this.runCleanup();

    // Schedule recurring cleanup
    setInterval(() => {
      this.runCleanup();
    }, intervalMs);
  }
}
