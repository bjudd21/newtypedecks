// File validation utilities
import { ValidationError } from '@/lib/api/validation';

export interface FileValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Supported image file types
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
] as const;

// Maximum file size (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

// Image dimension limits
export const MAX_IMAGE_WIDTH = 2048;
export const MAX_IMAGE_HEIGHT = 2048;
export const MIN_IMAGE_WIDTH = 100;
export const MIN_IMAGE_HEIGHT = 100;

/**
 * Validate uploaded file
 */
export function validateFile(file: File): FileValidationResult {
  const errors: ValidationError[] = [];

  // Check file type
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type as (typeof SUPPORTED_IMAGE_TYPES)[number])) {
    errors.push({
      field: 'file',
      message: `Unsupported file type. Supported types: ${SUPPORTED_IMAGE_TYPES.join(', ')}`,
    });
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    errors.push({
      field: 'file',
      message: `File size too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    });
  }

  // Check if file is empty
  if (file.size === 0) {
    errors.push({
      field: 'file',
      message: 'File is empty',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate image dimensions
 */
export function validateImageDimensions(
  width: number,
  height: number
): FileValidationResult {
  const errors: ValidationError[] = [];

  if (width < MIN_IMAGE_WIDTH || width > MAX_IMAGE_WIDTH) {
    errors.push({
      field: 'dimensions',
      message: `Image width must be between ${MIN_IMAGE_WIDTH} and ${MAX_IMAGE_WIDTH} pixels`,
    });
  }

  if (height < MIN_IMAGE_HEIGHT || height > MAX_IMAGE_HEIGHT) {
    errors.push({
      field: 'dimensions',
      message: `Image height must be between ${MIN_IMAGE_HEIGHT} and ${MAX_IMAGE_HEIGHT} pixels`,
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Generate safe filename
 */
export function generateSafeFilename(originalName: string, prefix?: string): string {
  // Remove file extension
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  
  // Sanitize filename (remove special characters, spaces, etc.)
  const sanitized = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  // Add prefix if provided
  const finalName = prefix ? `${prefix}-${sanitized}` : sanitized;
  
  // Add timestamp to ensure uniqueness
  const timestamp = Date.now();
  
  return `${finalName}-${timestamp}`;
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
