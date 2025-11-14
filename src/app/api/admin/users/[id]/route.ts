// Admin Individual User API
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/adminAuth';
import { UserService } from '@/lib/services/userService';
import { UserRole } from '@prisma/client';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/admin/users/[id] - Get specific user with activity stats
export async function GET(request: NextRequest, { params }: RouteParams) {
  // Check admin authentication
  const authError = await requireAdmin();
  if (authError) {
    return authError;
  }

  try {
    const { id } = await params;

    // Fetch user
    const user = await UserService.getUserById(id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
          message: `No user found with ID: ${id}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin users API GET by ID error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users/[id] - Update user information
export async function PUT(request: NextRequest, { params }: RouteParams) {
  // Check admin authentication
  const authError = await requireAdmin();
  if (authError) {
    return authError;
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Check if user exists
    const exists = await UserService.userExists(id);
    if (!exists) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
          message: `No user found with ID: ${id}`,
        },
        { status: 404 }
      );
    }

    // Validate role if provided
    if (body.role && !Object.values(UserRole).includes(body.role)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid role',
          message: `Role must be one of: ${Object.values(UserRole).join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid email',
            message: 'Please provide a valid email address',
          },
          { status: 400 }
        );
      }
    }

    // Update user
    const updatedUser = await UserService.updateUser(id, {
      name: body.name,
      email: body.email,
      role: body.role,
      password: body.password,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'User updated successfully',
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin users API PUT error:', error);

    // Handle email already in use error
    if (
      error instanceof Error &&
      error.message.includes('Email already in use')
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email already in use',
          message: error.message,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update user',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete user account
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  // Check admin authentication
  const authError = await requireAdmin();
  if (authError) {
    return authError;
  }

  try {
    const { id } = await params;

    // Check if user exists
    const exists = await UserService.userExists(id);
    if (!exists) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
          message: `No user found with ID: ${id}`,
        },
        { status: 404 }
      );
    }

    // Delete user
    const success = await UserService.deleteUser(id);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to delete user',
          message: 'User could not be deleted due to database constraints',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'User deleted successfully',
        id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin users API DELETE error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete user',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
