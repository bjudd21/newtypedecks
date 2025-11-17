/**
 * Submission image service types
 */

import { ProcessedImage } from '@/lib/storage/imageProcessing';

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
