'use client';
/**
 * Hook for managing form state
 */

import { useState } from 'react';
import type { FormData, FormErrors } from '../types';

export function useFormState() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return {
    formData,
    errors,
    isLoading,
    setErrors,
    setIsLoading,
    handleInputChange,
  };
}
