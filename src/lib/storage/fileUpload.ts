// File upload utilities for local development
import { NextRequest } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { validateFile, generateSafeFilename, getFileExtension } from './validation';
import { processCardImage, ProcessedImage } from './imageProcessing';

export interface UploadResult {
  success: boolean;
  data?: ProcessedImage;
  error?: string;
  message?: string;
}

/**
 * Handle file upload for card images
 */
export async function handleCardImageUpload(
  request: NextRequest,
  uploadDir: string = 'uploads/cards'
): Promise<UploadResult> {
  try {
    // Get form data from request
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return {
        success: false,
        error: 'No file provided',
        message: 'Please select an image file to upload',
      };
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      return {
        success: false,
        error: 'File validation failed',
        message: validation.errors.map(e => e.message).join(', '),
      };
    }

    // Generate safe filename
    const fileExtension = getFileExtension(file.name);
    const safeFilename = generateSafeFilename(file.name, 'card');
    const tempFilename = `${safeFilename}.${fileExtension}`;

    // Create temp directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'uploads', 'temp');
    await fs.mkdir(tempDir, { recursive: true });

    // Save file to temp directory
    const tempPath = path.join(tempDir, tempFilename);
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(tempPath, Buffer.from(arrayBuffer));

    // Process image and create multiple sizes
    const outputDir = path.join(process.cwd(), uploadDir);
    const processedImage = await processCardImage(tempPath, outputDir, tempFilename);

    // Clean up temp file
    await fs.unlink(tempPath);

    return {
      success: true,
      data: processedImage,
      message: 'Image uploaded and processed successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: 'Upload failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Save file to local storage
 */
export async function saveFileToLocal(
  file: File,
  directory: string,
  filename?: string
): Promise<{ success: boolean; path?: string; error?: string }> {
  try {
    // Generate filename if not provided
    const finalFilename = filename || generateSafeFilename(file.name);
    
    // Create directory if it doesn't exist
    const fullPath = path.join(process.cwd(), directory);
    await fs.mkdir(fullPath, { recursive: true });

    // Save file
    const filePath = path.join(fullPath, finalFilename);
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));

    return {
      success: true,
      path: filePath,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Delete file from local storage
 */
export async function deleteFileFromLocal(filePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    await fs.unlink(filePath);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get file info from local storage
 */
export async function getFileInfo(filePath: string) {
  try {
    const stats = await fs.stat(filePath);
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
 * List files in directory
 */
export async function listFilesInDirectory(directory: string): Promise<string[]> {
  try {
    const fullPath = path.join(process.cwd(), directory);
    const files = await fs.readdir(fullPath);
    return files.filter(file => !file.startsWith('.'));
  } catch {
    return [];
  }
}

/**
 * Clean up old temporary files
 */
export async function cleanupTempFiles(maxAge: number = 24 * 60 * 60 * 1000): Promise<void> {
  try {
    const tempDir = path.join(process.cwd(), 'uploads', 'temp');
    const files = await fs.readdir(tempDir);
    const now = Date.now();

    for (const file of files) {
      if (file === '.gitkeep') continue;
      
      const filePath = path.join(tempDir, file);
      const stats = await fs.stat(filePath);
      
      if (now - stats.mtime.getTime() > maxAge) {
        await fs.unlink(filePath);
      }
    }
  } catch (error) {
    console.error('Failed to cleanup temp files:', error);
  }
}
