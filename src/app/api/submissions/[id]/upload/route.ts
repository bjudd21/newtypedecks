// Submission Image Upload API - Handle image uploads for submissions
import { NextRequest, NextResponse } from 'next/server';
import { CardSubmissionService } from '@/lib/services/cardSubmissionService';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// POST /api/submissions/[id]/upload - Upload image for submission
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        {
          error: 'No file provided',
          message: 'An image file is required',
        },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'Invalid file type',
          message: 'Only JPEG, PNG, and WebP images are allowed',
        },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: 'File too large',
          message: 'Image must be smaller than 10MB',
        },
        { status: 400 }
      );
    }

    // Upload the image
    const uploadResult = await CardSubmissionService.uploadSubmissionImage(
      id,
      file
    );

    return NextResponse.json(
      {
        message: 'Image uploaded successfully',
        imageUrl: uploadResult.imageUrl,
        imageFile: uploadResult.imageFile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Submission image upload API error:', error);

    // Handle specific errors
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        {
          error: 'Submission not found',
          message: error.message,
        },
        { status: 404 }
      );
    }

    if (error instanceof Error && error.message.includes('file size')) {
      return NextResponse.json(
        {
          error: 'File size error',
          message: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to upload image',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
