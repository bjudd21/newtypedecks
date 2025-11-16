/**
 * Custom hook for profile event handlers
 */

import { useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import type { FormData, FormErrors } from '../types';

interface UseProfileHandlersOptions {
  formData: FormData;
  validateForm: () => boolean;
  setIsLoading: (loading: boolean) => void;
  setIsEditing: (editing: boolean) => void;
  setErrors: (errors: FormErrors) => void;
  resetForm: () => void;
}

export function useProfileHandlers({
  formData,
  validateForm,
  setIsLoading,
  setIsEditing,
  setErrors,
  resetForm,
}: UseProfileHandlersOptions) {
  const { update } = useSession();

  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error || 'Failed to update profile' });
        return;
      }

      // Update the session with new data
      await update({
        user: {
          name: formData.name,
          email: formData.email,
        },
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, setIsLoading, setIsEditing, setErrors, update]);

  const handleCancel = useCallback(() => {
    resetForm();
  }, [resetForm]);

  const handleDeleteAccount = useCallback(async () => {
    // TODO: Replace with proper confirmation dialog component

    if (
      // eslint-disable-next-line no-alert
      !window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'DELETE',
      });

      if (response.ok) {
        await signOut({ callbackUrl: '/' });
      } else {
        const data = await response.json();
        setErrors({ general: data.error || 'Failed to delete account' });
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setErrors]);

  return {
    handleSave,
    handleCancel,
    handleDeleteAccount,
  };
}
