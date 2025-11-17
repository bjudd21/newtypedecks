/**
 * Sign up API utilities
 */

import { signIn } from 'next-auth/react';
import type { SignUpFormData } from '../types';

/**
 * Register a new user
 */
export async function registerUser(formData: SignUpFormData): Promise<void> {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: formData.name.trim(),
      email: formData.email,
      password: formData.password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Registration failed');
  }
}

/**
 * Auto-sign in after successful registration
 */
export async function autoSignIn(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const result = await signIn('credentials', {
    email,
    password,
    redirect: false,
  });

  if (result?.error) {
    return {
      success: false,
      error:
        'Registration successful, but auto-login failed. Please sign in manually.',
    };
  }

  if (result?.ok) {
    return { success: true };
  }

  return {
    success: false,
    error: 'An unexpected error occurred during sign in.',
  };
}
