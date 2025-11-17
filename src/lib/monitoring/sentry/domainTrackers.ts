/**
 * Domain-specific error tracking
 */

import { errorTracker } from './errorTracker';

// Database error tracking
export function trackDatabaseError(
  operation: string,
  error: Error,
  query?: string
) {
  errorTracker.captureException(error, {
    database: {
      operation,
      query: query?.substring(0, 200), // Limit query length
      timestamp: new Date().toISOString(),
    },
  });
}

// API error tracking
export function trackAPIError(
  endpoint: string,
  method: string,
  error: Error,
  statusCode?: number
) {
  errorTracker.captureException(error, {
    api: {
      endpoint,
      method,
      statusCode,
      timestamp: new Date().toISOString(),
    },
  });
}

// Authentication error tracking
export function trackAuthError(action: string, error: Error, userId?: string) {
  errorTracker.captureException(error, {
    auth: {
      action,
      userId,
      timestamp: new Date().toISOString(),
    },
  });
}

// File upload error tracking
export function trackUploadError(
  fileName: string,
  fileSize: number,
  error: Error
) {
  errorTracker.captureException(error, {
    upload: {
      fileName,
      fileSize,
      timestamp: new Date().toISOString(),
    },
  });
}
