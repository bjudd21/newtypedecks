/**
 * Submission image upload functionality
 */

import path from 'path';
import fs from 'fs/promises';
import { validateFile } from '@/lib/storage/validation';
import { processCardImage } from '@/lib/storage/imageProcessing';
import {
  SubmissionImageUploadOptions,
  SubmissionImageUploadResult,
} from './types';
import { UPLOADS_DIR, TEMP_DIR } from './constants';

/**
 * Upload and process image for a submission
 */
export async function uploadSubmissionImage(
  file: File,
  options: SubmissionImageUploadOptions
): Promise<SubmissionImageUploadResult> {
  try {
    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      return {
        success: false,
        error: 'File validation failed',
        message: validation.errors.map((e) => e.message).join(', '),
      };
    }

    // Generate safe filename based on card info
    const timestamp = Date.now();
    const safeCardName = options.cardName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const baseFilename = `${options.setCode}-${options.setNumber}-${safeCardName}-${timestamp}`;
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `${baseFilename}.${fileExtension}`;

    // Create temp directory
    const tempDir = path.join(process.cwd(), TEMP_DIR);
    await fs.mkdir(tempDir, { recursive: true });

    // Save file to temp location
    const tempPath = path.join(tempDir, filename);
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(tempPath, Buffer.from(arrayBuffer));

    // Process image and create multiple sizes with optimization
    const outputDir = path.join(process.cwd(), UPLOADS_DIR);
    const processedImage = await processCardImage(
      tempPath,
      outputDir,
      filename,
      {
        enableProgressive: true,
        enableOptimization: true,
        generateWebP: true,
        generateAVIF: false, // Disable AVIF for now due to compatibility
        preserveOriginal: true,
      }
    );

    // Clean up temp file
    try {
      await fs.unlink(tempPath);
    } catch (error) {
      console.warn('Failed to clean up temp file:', error);
    }

    // Generate URLs (for development, these are file paths)
    const baseUrl =
      process.env.NODE_ENV === 'development'
        ? '/api/uploads/submissions'
        : process.env.CDN_BASE_URL || '/uploads/submissions';

    const relativeOriginal = path.relative(
      path.join(process.cwd(), UPLOADS_DIR),
      processedImage.original.path
    );
    const relativeThumbnail = path.relative(
      path.join(process.cwd(), UPLOADS_DIR),
      processedImage.thumbnail.path
    );
    const relativeLarge = path.relative(
      path.join(process.cwd(), UPLOADS_DIR),
      processedImage.large.path
    );

    const imageUrl = `${baseUrl}/${relativeOriginal.replace(/\\/g, '/')}`;
    const thumbnailUrl = `${baseUrl}/${relativeThumbnail.replace(/\\/g, '/')}`;
    const largeUrl = `${baseUrl}/${relativeLarge.replace(/\\/g, '/')}`;

    return {
      success: true,
      imageUrl,
      imageFile: processedImage.original.path,
      thumbnailUrl,
      largeUrl,
      processedImage,
      message: 'Image uploaded and processed successfully',
    };
  } catch (error) {
    console.error('Submission image upload error:', error);
    return {
      success: false,
      error: 'Upload failed',
      message:
        error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
