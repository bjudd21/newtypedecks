// Admin Users API - List all users
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/adminAuth';
import { UserService } from '@/lib/services/userService';
import { UserRole } from '@prisma/client';

// GET /api/admin/users - List all users with pagination and filtering
export async function GET(request: NextRequest) {
  // Check admin authentication
  const authError = await requireAdmin();
  if (authError) {
    return authError;
  }

  try {
    const { searchParams } = new URL(request.url);

    // Parse pagination
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get('limit') || '20'))
    );

    // Parse search
    const search = searchParams.get('search')?.trim() || undefined;

    // Parse role filter
    const roleParam = searchParams.get('role')?.trim();
    let roleFilter: UserRole | undefined;
    if (roleParam && Object.values(UserRole).includes(roleParam as UserRole)) {
      roleFilter = roleParam as UserRole;
    }

    // Parse sorting
    const sortBy = (searchParams.get('sortBy') || 'createdAt') as
      | 'name'
      | 'email'
      | 'createdAt'
      | 'role';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as
      | 'asc'
      | 'desc';

    // Fetch users
    const result = await UserService.getAllUsers({
      page,
      limit,
      search,
      roleFilter,
      sortBy,
      sortOrder,
    });

    return NextResponse.json(
      {
        success: true,
        ...result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin users API GET error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch users',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
