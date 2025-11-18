'use client';
/**
 * Custom hook for sign up form state and validation
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateSignUpForm } from './validation';
import { registerUser, autoSignIn } from './api';
import type { SignUpFormData, SignUpFormErrors } from '../types';

export function useSignUpForm(callbackUrl: string) {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: keyof SignUpFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = validateSignUpForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Register user
      await registerUser(formData);

      // Auto-sign in after successful registration
      const signInResult = await autoSignIn(formData.email, formData.password);

      if (!signInResult.success) {
        setErrors({ general: signInResult.error });
        return;
      }

      // Redirect to callback URL
      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred. Please try again.';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    handleInputChange,
    handleSubmit,
  };
}
