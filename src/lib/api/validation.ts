// API validation utilities
import { NextRequest } from 'next/server';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Validate pagination parameters
export function validatePagination(searchParams: URLSearchParams): ValidationResult {
  const errors: ValidationError[] = [];
  
  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  if (page) {
    const pageNum = parseInt(page);
    if (isNaN(pageNum) || pageNum < 1) {
      errors.push({
        field: 'page',
        message: 'Page must be a positive integer',
      });
    }
  }

  if (limit) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push({
        field: 'limit',
        message: 'Limit must be between 1 and 100',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validate email format
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
export function validatePassword(password: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (password.length < 8) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 8 characters long',
    });
  }

  if (!/[A-Z]/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must contain at least one uppercase letter',
    });
  }

  if (!/[a-z]/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must contain at least one lowercase letter',
    });
  }

  if (!/\d/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must contain at least one number',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validate required fields in request body
export function validateRequiredFields(
  body: Record<string, unknown>,
  requiredFields: string[]
): ValidationResult {
  const errors: ValidationError[] = [];

  requiredFields.forEach((field) => {
    if (!body[field] || (typeof body[field] === 'string' && body[field].trim() === '')) {
      errors.push({
        field,
        message: `${field} is required`,
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Extract and validate query parameters
export function extractQueryParams(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  return {
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '20'),
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || '',
    order: searchParams.get('order') || 'asc',
  };
}
