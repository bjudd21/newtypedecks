// Card Submissions API - Handle manual card uploads and submissions
import { NextRequest, NextResponse } from 'next/server';
import { CardSubmissionService } from '@/lib/services/cardSubmissionService';
import type { CreateSubmissionData } from '@/lib/types/submission';
import { parseSubmissionFilters, parseSubmissionOptions } from './helpers';

// GET /api/submissions - Search submissions with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse filters and options using helper functions
    const filters = parseSubmissionFilters(searchParams);
    const options = parseSubmissionOptions(searchParams);

    // Execute search
    const result = await CardSubmissionService.searchSubmissions(
      filters,
      options
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Submissions search API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to search submissions',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/submissions - Create a new submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const submissionData: CreateSubmissionData = body;

    // TODO: Get user ID from authentication
    // For now, this endpoint supports anonymous submissions
    const submittedBy = undefined; // This would come from auth session

    // Create the submission
    const submission = await CardSubmissionService.createSubmission(
      submissionData,
      submittedBy
    );

    return NextResponse.json(
      {
        message: 'Submission created successfully',
        submission,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Submission creation API error:', error);

    // Handle validation errors
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
        error: 'Failed to create submission',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
