// Card Submissions API - Handle manual card uploads and submissions
import { NextRequest, NextResponse } from 'next/server';
import { CardSubmissionService } from '@/lib/services/cardSubmissionService';
import type {
  CreateSubmissionData,
  SubmissionSearchFilters,
  SubmissionSearchOptions,
} from '@/lib/types/submission';

// GET /api/submissions - Search submissions with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse filters
    const filters: SubmissionSearchFilters = {};

    // Status filter
    const statusParam = searchParams.get('status');
    if (statusParam) {
      filters.status = statusParam.split(
        ','
      ) as import('@prisma/client').SubmissionStatus[];
    }

    // Priority filter
    const priorityParam = searchParams.get('priority');
    if (priorityParam) {
      filters.priority = priorityParam.split(
        ','
      ) as import('@prisma/client').SubmissionPriority[];
    }

    // Other filters
    if (searchParams.get('submittedBy')) {
      filters.submittedBy = searchParams.get('submittedBy')!;
    }

    if (searchParams.get('reviewedBy')) {
      filters.reviewedBy = searchParams.get('reviewedBy')!;
    }

    if (searchParams.get('isLeak')) {
      filters.isLeak = searchParams.get('isLeak') === 'true';
    }

    if (searchParams.get('isPreview')) {
      filters.isPreview = searchParams.get('isPreview') === 'true';
    }

    if (searchParams.get('name')) {
      filters.name = searchParams.get('name')!;
    }

    if (searchParams.get('faction')) {
      filters.faction = searchParams.get('faction')!;
    }

    if (searchParams.get('series')) {
      filters.series = searchParams.get('series')!;
    }

    // Date filters
    if (searchParams.get('dateFrom')) {
      filters.dateFrom = new Date(searchParams.get('dateFrom')!);
    }

    if (searchParams.get('dateTo')) {
      filters.dateTo = new Date(searchParams.get('dateTo')!);
    }

    // Parse options
    const validSortFields = [
      'name',
      'createdAt',
      'updatedAt',
      'status',
      'priority',
    ] as const;
    const validSortOrders = ['asc', 'desc'] as const;
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const options: SubmissionSearchOptions = {
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: parseInt(searchParams.get('limit') || '20', 10),
      sortBy: validSortFields.includes(sortBy as any)
        ? (sortBy as (typeof validSortFields)[number])
        : 'createdAt',
      sortOrder: validSortOrders.includes(sortOrder as any)
        ? (sortOrder as (typeof validSortOrders)[number])
        : 'desc',
      includeRelations: searchParams.get('includeRelations') !== 'false',
    };

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
