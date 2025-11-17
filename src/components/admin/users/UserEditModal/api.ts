/**
 * API utilities for user edit
 */

import type { FormData } from './types';

export async function updateUser(
  userId: string,
  formData: FormData
): Promise<void> {
  const updateData: Partial<FormData> = {
    name: formData.name.trim() || undefined,
    email: formData.email.trim(),
    role: formData.role,
  };

  // Only include password if it was provided
  if (formData.password) {
    updateData.password = formData.password;
  }

  const response = await fetch(`/api/admin/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || result.message || 'Failed to update user'
    );
  }
}
