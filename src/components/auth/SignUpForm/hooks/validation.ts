/**
 * Form validation utilities
 */

import { validateEmail, validatePassword } from '@/lib/auth-utils';
import type { SignUpFormData, SignUpFormErrors } from '../types';

/**
 * Validate name field
 */
function validateName(name: string): string | null {
  if (!name.trim()) {
    return 'Name is required';
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  return null;
}

/**
 * Validate email field
 */
function validateEmailField(email: string): string | null {
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return emailValidation.error || 'Invalid email';
  }
  return null;
}

/**
 * Validate password field
 */
function validatePasswordField(password: string): string | null {
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return passwordValidation.errors[0] || 'Invalid password';
  }
  return null;
}

/**
 * Validate password confirmation
 */
function validatePasswordMatch(
  password: string,
  confirmPassword: string
): string | null {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
}

/**
 * Validate entire sign up form
 */
export function validateSignUpForm(formData: SignUpFormData): {
  isValid: boolean;
  errors: SignUpFormErrors;
} {
  const newErrors: SignUpFormErrors = {};

  const nameError = validateName(formData.name);
  if (nameError) newErrors.name = nameError;

  const emailError = validateEmailField(formData.email);
  if (emailError) newErrors.email = emailError;

  const passwordError = validatePasswordField(formData.password);
  if (passwordError) newErrors.password = passwordError;

  const confirmError = validatePasswordMatch(
    formData.password,
    formData.confirmPassword
  );
  if (confirmError) newErrors.confirmPassword = confirmError;

  return {
    isValid: Object.keys(newErrors).length === 0,
    errors: newErrors,
  };
}
