/**
 * Submission Image Service
 *
 * Handles image upload, processing, deletion, and management for card submissions
 */

// Export types
export type {
  SubmissionImageUploadOptions,
  SubmissionImageUploadResult,
} from './types';

// Export constants
export { UPLOADS_DIR, TEMP_DIR } from './constants';

// Import functional modules
import { uploadSubmissionImage } from './upload';
import { deleteSubmissionImage } from './deletion';
import { getImageInfo } from './imageInfo';
import { generateImageUrls } from './urlGeneration';
import { cleanupTempFiles } from './cleanup';
import {
  SubmissionImageUploadOptions,
  SubmissionImageUploadResult,
} from './types';

/**
 * Submission Image Service
 *
 * Orchestrates all submission image operations through a static class interface
 */
export class SubmissionImageService {
  private static readonly UPLOADS_DIR = 'uploads/submissions';
  private static readonly TEMP_DIR = 'uploads/temp';

  /**
   * Upload and process image for a submission
   */
  static async uploadSubmissionImage(
    file: File,
    options: SubmissionImageUploadOptions
  ): Promise<SubmissionImageUploadResult> {
    return uploadSubmissionImage(file, options);
  }

  /**
   * Delete submission image files
   */
  static async deleteSubmissionImage(
    imageFile: string
  ): Promise<{ success: boolean; error?: string }> {
    return deleteSubmissionImage(imageFile);
  }

  /**
   * Get image info and verify existence
   */
  static async getImageInfo(imageFile: string) {
    return getImageInfo(imageFile);
  }

  /**
   * Generate image URLs for a submission
   */
  static generateImageUrls(imageFile: string) {
    return generateImageUrls(imageFile);
  }

  /**
   * Clean up old temporary files
   */
  static async cleanupTempFiles(
    maxAge: number = 24 * 60 * 60 * 1000
  ): Promise<void> {
    return cleanupTempFiles(maxAge);
  }
}
