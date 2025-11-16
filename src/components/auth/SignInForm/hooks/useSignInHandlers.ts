/**
 * Hook for handling sign-in actions
 */

import { useCallback } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { validateEmail } from '@/lib/auth-utils';
import type { FormData, FormErrors } from '../types';

interface UseSignInHandlersOptions {
  formData: FormData;
  callbackUrl: string;
  setErrors: (errors: FormErrors | ((prev: FormErrors) => FormErrors)) => void;
  setIsLoading: (loading: boolean) => void;
}

export function useSignInHandlers({
  formData,
  callbackUrl,
  setErrors,
  setIsLoading,
}: UseSignInHandlersOptions) {
  const router = useRouter();

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error || 'Invalid email';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, setErrors]);

  const handleCredentialsSignIn = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsLoading(true);
      setErrors({});

      try {
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          setErrors({ general: 'Invalid email or password' });
        } else if (result?.ok) {
          // Refresh session and redirect
          await getSession();
          router.push(callbackUrl);
          router.refresh();
        }
      } catch (error) {
        console.error('Sign in error:', error);
        setErrors({
          general: 'An unexpected error occurred. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [formData, callbackUrl, validateForm, setErrors, setIsLoading, router]
  );

  const handleGoogleSignIn = useCallback(async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl });
    } catch (error) {
      console.error('Google sign in error:', error);
      setErrors({ general: 'Google sign in failed. Please try again.' });
      setIsLoading(false);
    }
  }, [callbackUrl, setErrors, setIsLoading]);

  const handleDiscordSignIn = useCallback(async () => {
    setIsLoading(true);
    try {
      await signIn('discord', { callbackUrl });
    } catch (error) {
      console.error('Discord sign in error:', error);
      setErrors({ general: 'Discord sign in failed. Please try again.' });
      setIsLoading(false);
    }
  }, [callbackUrl, setErrors, setIsLoading]);

  return {
    handleCredentialsSignIn,
    handleGoogleSignIn,
    handleDiscordSignIn,
  };
}
