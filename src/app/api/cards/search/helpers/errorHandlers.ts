/**
 * Search Error Handlers
 *
 * Centralized error handling for card search API routes
 */

import { NextResponse } from 'next/server';

/**
 * Handles various error types from card search operations
 * Returns appropriate HTTP responses based on error type
 */
export function handleSearchError(error: unknown): NextResponse {
  console.error('Card search API error:', error);

  if (error instanceof SyntaxError) {
    return NextResponse.json(
      { error: 'Invalid JSON', message: 'Request body must be valid JSON' },
      { status: 400 }
    );
  }

  if (error instanceof Error && error.message.includes('Validation failed')) {
    return NextResponse.json(
      { error: 'Validation error', message: error.message },
      { status: 400 }
    );
  }

  if (error instanceof Error && error.message.includes('connect')) {
    return NextResponse.json(
      { error: 'Database error', message: 'Unable to connect to database' },
      { status: 503 }
    );
  }

  return NextResponse.json(
    {
      error: 'Internal server error',
      message: 'An unexpected error occurred',
    },
    { status: 500 }
  );
}
