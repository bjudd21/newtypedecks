// Admin Submission Publish API - Publish approved submissions as cards
import { NextRequest, NextResponse } from 'next/server';
import { CardSubmissionService } from '@/lib/services/cardSubmissionService';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// POST /api/admin/submissions/[id]/publish - Publish approved submission as card
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // TODO: Check admin permissions
    const publishedBy = 'admin-user'; // This would come from auth session

    const { id } = await params;

    // Publish the submission
    const result = await CardSubmissionService.publishSubmission(
      id,
      publishedBy
    );

    return NextResponse.json(
      {
        message: 'Submission published successfully',
        submission: result.submission,
        card: result.card,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Submission publish API error:', error);

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

    if (error instanceof Error && error.message.includes('must be approved')) {
      return NextResponse.json(
        {
          error: 'Submission not approved',
          message: 'Submission must be approved before publishing',
        },
        { status: 409 }
      );
    }

    if (
      error instanceof Error &&
      error.message.includes('already been published')
    ) {
      return NextResponse.json(
        {
          error: 'Already published',
          message: 'Submission has already been published',
        },
        { status: 409 }
      );
    }

    // Handle validation errors from card creation
    if (error instanceof Error && error.message.includes('Validation failed')) {
      return NextResponse.json(
        {
          error: 'Card validation failed',
          message: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to publish submission',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
