/**
 * Validation logic for user edit form
 */

import type { FormData } from './types';

export function validateUserForm(formData: FormData): Record<string, string> {
  const newErrors: Record<string, string> = {};

  if (!formData.email.trim()) {
    newErrors.email = 'Email is required';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
  }

  if (formData.password && formData.password.length < 8) {
    newErrors.password = 'Password must be at least 8 characters';
  }

  return newErrors;
}
