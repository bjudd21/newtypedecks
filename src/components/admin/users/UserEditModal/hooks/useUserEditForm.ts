'use client';
/**
 * Custom hook for user edit form state and handlers
 */

import { useState } from 'react';
import { validateUserForm } from '../validation';
import { updateUser } from '../api';
import type { User, FormData } from '../types';

interface UseUserEditFormOptions {
  user: User;
  onSuccess: () => void;
  onClose: () => void;
  addToast: (
    type: 'success' | 'error' | 'warning' | 'info',
    message: string
  ) => void;
}

export function useUserEditForm({
  user,
  onSuccess,
  onClose,
  addToast,
}: UseUserEditFormOptions) {
  const [formData, setFormData] = useState<FormData>({
    name: user.name || '',
    email: user.email,
    role: user.role,
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors = validateUserForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      await updateUser(user.id, formData);

      // Success
      addToast('success', 'User updated successfully');

      // Wait a brief moment for the toast to be visible before closing
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 500);
    } catch (error) {
      console.error('Failed to update user:', error);
      addToast(
        'error',
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return {
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
    handleCancel,
  };
}
