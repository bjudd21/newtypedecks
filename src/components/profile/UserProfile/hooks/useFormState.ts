'use client';
/**
 * Custom hook for form state management
 */

import { useState } from 'react';
import type { User, FormData, FormErrors } from '../types';

export function useFormState(user: User) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: user.name || '',
    email: user.email || '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  return {
    isEditing,
    setIsEditing,
    isLoading,
    setIsLoading,
    formData,
    setFormData,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
  };
}
