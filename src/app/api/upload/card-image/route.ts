// Card image upload API endpoint
import { NextRequest } from 'next/server';
import { handleCardImageUpload } from '@/lib/storage/fileUpload';
import { createSuccessResponse, createErrorResponse } from '@/lib/api/response';

// POST /api/upload/card-image - Upload card image
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication and authorization checks
    // TODO: Add rate limiting
    // TODO: Add file size limits per user

    const result = await handleCardImageUpload(request);

    if (!result.success) {
      return createErrorResponse(
        result.error || 'Upload failed',
        result.message,
        400
      );
    }

    return createSuccessResponse(
      {
        original: result.data?.original,
        thumbnail: result.data?.thumbnail,
        large: result.data?.large,
        metadata: result.data?.metadata,
      },
      result.message
    );
  } catch (error) {
    return createErrorResponse(
      'Upload failed',
      error instanceof Error ? error.message : 'Unknown error',
      500
    );
  }
}
