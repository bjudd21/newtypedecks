// Admin Submission Review API - Handle submission reviews and approvals
import { NextRequest, NextResponse } from 'next/server';
import { CardSubmissionService } from '@/lib/services/cardSubmissionService';
import type { SubmissionReviewData } from '@/lib/types/submission';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// POST /api/admin/submissions/[id]/review - Review a submission (approve/reject)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // TODO: Check admin permissions
    const reviewedBy = 'admin-user'; // This would come from auth session

    const { id } = await params;
    const body = await request.json();

    const reviewData: SubmissionReviewData = {
      id,
      status: body.status,
      reviewNotes: body.reviewNotes,
      rejectionReason: body.rejectionReason,
    };

    // Validate status
    if (!['APPROVED', 'REJECTED'].includes(reviewData.status)) {
      return NextResponse.json(
        {
          error: 'Invalid status',
          message: 'Status must be either APPROVED or REJECTED',
        },
        { status: 400 }
      );
    }

    // Require rejection reason for rejected submissions
    if (reviewData.status === 'REJECTED' && !reviewData.rejectionReason) {
      return NextResponse.json(
        {
          error: 'Rejection reason required',
          message: 'rejectionReason is required when status is REJECTED',
        },
        { status: 400 }
      );
    }

    // Review the submission
    const submission = await CardSubmissionService.reviewSubmission(
      reviewData,
      reviewedBy
    );

    return NextResponse.json(
      {
        message: `Submission ${reviewData.status.toLowerCase()} successfully`,
        submission,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Submission review API error:', error);

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

    return NextResponse.json(
      {
        error: 'Failed to review submission',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
