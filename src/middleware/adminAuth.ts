/**
 * Admin Authentication Middleware
 *
 * Provides reusable authentication and authorization checks for admin routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';

/**
 * Check if user is authenticated and has admin role
 * Throws appropriate error responses if not authorized
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
        message: 'You must be logged in to access this resource',
      },
      { status: 401 }
    );
  }

  if (session.user.role !== UserRole.ADMIN) {
    return NextResponse.json(
      {
        success: false,
        error: 'Forbidden',
        message: 'You do not have permission to access this resource',
      },
      { status: 403 }
    );
  }

  return null; // No error, user is authorized
}

/**
 * Check if user is authenticated and has admin or moderator role
 */
export async function requireModeratorOrAdmin() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
        message: 'You must be logged in to access this resource',
      },
      { status: 401 }
    );
  }

  if (
    session.user.role !== UserRole.ADMIN &&
    session.user.role !== UserRole.MODERATOR
  ) {
    return NextResponse.json(
      {
        success: false,
        error: 'Forbidden',
        message: 'You do not have permission to access this resource',
      },
      { status: 403 }
    );
  }

  return null; // No error, user is authorized
}

/**
 * Get current session or return error response
 */
export async function getSessionOrError() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return {
      error: NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'You must be logged in to access this resource',
        },
        { status: 401 }
      ),
      session: null,
    };
  }

  return { error: null, session };
}

/**
 * Wrapper function for admin-only API routes
 * Usage: export async function GET(request: NextRequest) { return withAdminAuth(request, async () => { ... }); }
 */
export async function withAdminAuth(
  _request: NextRequest,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const authError = await requireAdmin();
  if (authError) {
    return authError;
  }

  try {
    return await handler();
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
