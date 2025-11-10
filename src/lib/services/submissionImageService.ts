import path from 'path';
import fs from 'fs/promises';
import { validateFile } from '@/lib/storage/validation';
import {
  processCardImage,
  ProcessedImage,
} from '@/lib/storage/imageProcessing';

export interface SubmissionImageUploadOptions {
  cardName: string;
  setCode: string;
  setNumber: string;
}

export interface SubmissionImageUploadResult {
  success: boolean;
  imageUrl?: string;
  imageFile?: string;
  thumbnailUrl?: string;
  largeUrl?: string;
  processedImage?: ProcessedImage;
  error?: string;
  message?: string;
}

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
      const tempDir = path.join(process.cwd(), this.TEMP_DIR);
      await fs.mkdir(tempDir, { recursive: true });

      // Save file to temp location
      const tempPath = path.join(tempDir, filename);
      const arrayBuffer = await file.arrayBuffer();
      await fs.writeFile(tempPath, Buffer.from(arrayBuffer));

      // Process image and create multiple sizes with optimization
      const outputDir = path.join(process.cwd(), this.UPLOADS_DIR);
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
        path.join(process.cwd(), this.UPLOADS_DIR),
        processedImage.original.path
      );
      const relativeThumbnail = path.relative(
        path.join(process.cwd(), this.UPLOADS_DIR),
        processedImage.thumbnail.path
      );
      const relativeLarge = path.relative(
        path.join(process.cwd(), this.UPLOADS_DIR),
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

  /**
   * Delete submission image files
   */
  static async deleteSubmissionImage(
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

  /**
   * Get image info and verify existence
   */
  static async getImageInfo(imageFile: string) {
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

  /**
   * Generate image URLs for a submission
   */
  static generateImageUrls(imageFile: string) {
    const baseUrl =
      process.env.NODE_ENV === 'development'
        ? '/api/uploads/submissions'
        : process.env.CDN_BASE_URL || '/uploads/submissions';

    const _basePath = path.dirname(imageFile);
    const filename = path.basename(imageFile);
    const baseName = path.parse(filename).name;
    const ext = path.parse(filename).ext;

    const uploadsDir = path.join(process.cwd(), this.UPLOADS_DIR);

    const relativeOriginal = path.relative(uploadsDir, imageFile);
    const relativeThumbnail = path.join(
      'thumbnails',
      `${baseName}-thumb${ext}`
    );
    const relativeLarge = path.join('large', `${baseName}-large${ext}`);

    return {
      original: `${baseUrl}/${relativeOriginal.replace(/\\/g, '/')}`,
      thumbnail: `${baseUrl}/${relativeThumbnail.replace(/\\/g, '/')}`,
      large: `${baseUrl}/${relativeLarge.replace(/\\/g, '/')}`,
    };
  }

  /**
   * Clean up old temporary files
   */
  static async cleanupTempFiles(
    maxAge: number = 24 * 60 * 60 * 1000
  ): Promise<void> {
    try {
      const tempDir = path.join(process.cwd(), this.TEMP_DIR);
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
}
