/**
 * UserProfile - Main component orchestrator
 */

'use client';

import React from 'react';
import { useFormState } from './hooks/useFormState';
import { useFormValidation } from './hooks/useFormValidation';
import { useProfileHandlers } from './hooks/useProfileHandlers';
import { ProfileInformationCard } from './components/ProfileInformationCard';
import { AccountSettingsCard } from './components/AccountSettingsCard';
import type { UserProfileProps } from './types';

export function UserProfileComponent({ user }: UserProfileProps) {
  // Form state management
  const {
    isEditing,
    setIsEditing,
    isLoading,
    setIsLoading,
    formData,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
  } = useFormState(user);

  // Form validation
  const { validateForm } = useFormValidation({ formData, setErrors });

  // Event handlers
  const { handleSave, handleCancel, handleDeleteAccount } = useProfileHandlers({
    formData,
    validateForm,
    setIsLoading,
    setIsEditing,
    setErrors,
    resetForm,
  });

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <ProfileInformationCard
        user={user}
        isEditing={isEditing}
        isLoading={isLoading}
        formData={formData}
        errors={errors}
        onEditToggle={() => setIsEditing(true)}
        onInputChange={handleInputChange}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <AccountSettingsCard
        isLoading={isLoading}
        onDeleteAccount={handleDeleteAccount}
      />
    </div>
  );
}
