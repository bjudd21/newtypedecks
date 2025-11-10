// Individual Submission API - Handle specific submission operations
import { NextRequest, NextResponse } from 'next/server';
import { CardSubmissionService } from '@/lib/services/cardSubmissionService';
import type { UpdateSubmissionData } from '@/lib/types/submission';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/submissions/[id] - Get a specific submission
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Validate ID format
    const uuidRegex = /^[0-9a-z]+$/i; // cuid format
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        {
          error: 'Invalid submission ID',
          message: 'Submission ID must be a valid identifier',
        },
        { status: 400 }
      );
    }

    // Get the submission
    const submission = await CardSubmissionService.getSubmissionById(id, true);

    if (!submission) {
      return NextResponse.json(
        {
          error: 'Submission not found',
          message: `No submission found with ID: ${id}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(submission, { status: 200 });
  } catch (error) {
    console.error('Submission get API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch submission',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/submissions/[id] - Update a submission
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // TODO: Check permissions - only submitter or admin can update
    // For now, allowing all updates

    const updateData: UpdateSubmissionData = {
      id,
      ...body,
    };

    // Update the submission
    const submission = await CardSubmissionService.updateSubmission(updateData);

    return NextResponse.json(
      {
        message: 'Submission updated successfully',
        submission,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Submission update API error:', error);

    // Handle validation errors
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        {
          error: 'Submission not found',
          message: error.message,
        },
        { status: 404 }
      );
    }

    if (error instanceof Error && error.message.includes('Validation failed')) {
      return NextResponse.json(
        {
          error: 'Invalid submission data',
          message: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to update submission',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/submissions/[id] - Delete a submission
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // TODO: Check permissions - only submitter or admin can delete
    // For now, allowing all deletions

    await CardSubmissionService.deleteSubmission(id);

    return NextResponse.json(
      {
        message: 'Submission deleted successfully',
        id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Submission delete API error:', error);

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

    if (
      error instanceof Error &&
      error.message.includes('Cannot delete published')
    ) {
      return NextResponse.json(
        {
          error: 'Cannot delete submission',
          message: 'Published submissions cannot be deleted',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to delete submission',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
