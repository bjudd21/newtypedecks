'use client';
/**
 * Custom hook for form validation
 */

import { useCallback } from 'react';
import { validateEmail } from '@/lib/auth-utils';
import type { FormData, FormErrors } from '../types';

interface UseFormValidationOptions {
  formData: FormData;
  setErrors: (errors: FormErrors) => void;
}

export function useFormValidation({
  formData,
  setErrors,
}: UseFormValidationOptions) {
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error || 'Invalid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, setErrors]);

  return { validateForm };
}
