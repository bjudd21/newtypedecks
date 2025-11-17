/**
 * Middleware helper functions
 */

import { NextRequest } from 'next/server';

// Generate unique request ID
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Extract user ID from request (from session, JWT, etc.)
export async function extractUserId(
  request: NextRequest
): Promise<string | undefined> {
  try {
    // Try to get user ID from session or JWT token
    // This is a placeholder - implement based on your auth system
    const sessionCookie = request.cookies.get('next-auth.session-token');
    if (sessionCookie) {
      // In a real implementation, you'd decode the session/JWT
      // For now, we'll return undefined
      return undefined;
    }
    return undefined;
  } catch (_error) {
    return undefined;
  }
}
