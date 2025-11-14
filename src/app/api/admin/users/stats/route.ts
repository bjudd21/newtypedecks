// Admin User Statistics API
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/adminAuth';
import { UserService } from '@/lib/services/userService';

// GET /api/admin/users/stats - Get user statistics
export async function GET(_request: NextRequest) {
  // Check admin authentication
  const authError = await requireAdmin();
  if (authError) {
    return authError;
  }

  try {
    // Fetch statistics
    const stats = await UserService.getUserStatistics();

    return NextResponse.json(
      {
        success: true,
        stats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin user stats API GET error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user statistics',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
