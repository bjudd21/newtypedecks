// Admin Submissions API - Manage submission workflow and batch operations
import { NextRequest, NextResponse } from 'next/server';
import { CardSubmissionService } from '@/lib/services/cardSubmissionService';
import type { BatchSubmissionOperation } from '@/lib/types/submission';

// GET /api/admin/submissions - Get submissions with admin context (statistics, etc.)
export async function GET(request: NextRequest) {
  try {
    // TODO: Check admin permissions
    // For now, allowing access

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'statistics') {
      // Get submission statistics
      const statistics = await CardSubmissionService.getSubmissionStatistics();
      return NextResponse.json(statistics, { status: 200 });
    }

    if (action === 'pending') {
      // Get pending submissions
      const result = await CardSubmissionService.searchSubmissions(
        { status: ['PENDING'] },
        {
          limit: parseInt(searchParams.get('limit') || '50', 10),
          sortBy: 'priority',
          sortOrder: 'desc',
        }
      );
      return NextResponse.json(result, { status: 200 });
    }

    if (action === 'high-priority') {
      // Get high priority submissions
      const result = await CardSubmissionService.searchSubmissions(
        { priority: ['HIGH', 'URGENT'] },
        {
          limit: parseInt(searchParams.get('limit') || '20', 10),
          sortBy: 'createdAt',
          sortOrder: 'desc',
        }
      );
      return NextResponse.json(result, { status: 200 });
    }

    // Default: return basic admin info
    const statistics = await CardSubmissionService.getSubmissionStatistics();

    return NextResponse.json({
      statistics,
      message: 'Admin submissions overview',
      timestamp: new Date().toISOString(),
    }, { status: 200 });

  } catch (error) {
    console.error('Admin submissions API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to get admin submissions data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/submissions - Batch operations on submissions
export async function POST(request: NextRequest) {
  try {
    // TODO: Check admin permissions
    // For now, allowing access

    const body = await request.json();
    const operation: BatchSubmissionOperation = body;

    // Validate operation
    if (!operation.submissionIds || operation.submissionIds.length === 0) {
      return NextResponse.json(
        {
          error: 'Invalid operation',
          message: 'submissionIds array is required and cannot be empty',
        },
        { status: 400 }
      );
    }

    if (!['approve', 'reject', 'archive', 'priority'].includes(operation.action)) {
      return NextResponse.json(
        {
          error: 'Invalid action',
          message: 'action must be one of: approve, reject, archive, priority',
        },
        { status: 400 }
      );
    }

    // Execute batch operation
    const result = await CardSubmissionService.batchOperation(operation);

    return NextResponse.json({
      message: `Batch ${operation.action} completed`,
      result,
      processedCount: operation.submissionIds.length,
      successfulCount: result.successful.length,
      failedCount: result.failed.length,
    }, { status: 200 });

  } catch (error) {
    console.error('Admin batch operation API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to execute batch operation',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}