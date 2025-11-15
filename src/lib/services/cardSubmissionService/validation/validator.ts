/**
 * Submission Validation Functions
 */

import type {
  CreateSubmissionData,
  SubmissionValidationResult,
} from '@/lib/types/submission';

/**
 * Validate submission data
 */
export function validateSubmissionData(
  data: CreateSubmissionData
): SubmissionValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Card name is required');
  }

  if (!data.setNumber || data.setNumber.trim().length === 0) {
    errors.push('Set number is required');
  }

  // Length validation
  if (data.name && data.name.length > 200) {
    errors.push('Card name is too long (maximum 200 characters)');
  }

  if (data.description && data.description.length > 2000) {
    warnings.push('Description is very long (over 2000 characters)');
  }

  // Numeric validation
  if (data.level !== undefined && (data.level < 0 || data.level > 10)) {
    errors.push('Level must be between 0 and 10');
  }

  if (data.cost !== undefined && (data.cost < 0 || data.cost > 20)) {
    errors.push('Cost must be between 0 and 20');
  }

  // Email validation for anonymous submissions
  if (data.submitterEmail && !isValidEmail(data.submitterEmail)) {
    errors.push('Invalid email format');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
