// Card image upload API endpoint (admin only)
import { NextRequest } from 'next/server';
import { requireAdmin } from '@/middleware/adminAuth';
import { getCardImageStorage } from '@/lib/storage/cardImageStorage';
import { validateFile, generateSafeFilename } from '@/lib/storage/validation';
import { createSuccessResponse, createErrorResponse } from '@/lib/api/response';

// POST /api/upload/card-image - Upload and process a card image.
// Returns public URLs for the three stored sizes, ready to save on a Card.
export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const formData = await request.formData();
    const file = formData.get('image');

    if (!(file instanceof File)) {
      return createErrorResponse(
        'No file provided',
        'Please select an image file to upload',
        400
      );
    }

    const validation = validateFile(file);
    if (!validation.isValid) {
      return createErrorResponse(
        'File validation failed',
        validation.errors.map((e) => e.message).join(', '),
        400
      );
    }

    const baseName = generateSafeFilename(file.name, 'card');
    const storage = getCardImageStorage();
    const stored = await storage.store(file, baseName);

    return createSuccessResponse(stored, 'Image uploaded successfully');
  } catch (error) {
    return createErrorResponse(
      'Upload failed',
      error instanceof Error ? error.message : 'Unknown error',
      500
    );
  }
}
