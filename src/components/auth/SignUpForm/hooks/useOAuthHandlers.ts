/**
 * Custom hook for OAuth sign up handlers
 */

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import type { SignUpFormErrors } from '../types';

export function useOAuthHandlers(
  callbackUrl: string,
  setErrors: (errors: SignUpFormErrors) => void
) {
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    setIsOAuthLoading(true);
    try {
      await signIn('google', { callbackUrl });
    } catch (error) {
      console.error('Google sign up error:', error);
      setErrors({ general: 'Google sign up failed. Please try again.' });
      setIsOAuthLoading(false);
    }
  };

  const handleDiscordSignUp = async () => {
    setIsOAuthLoading(true);
    try {
      await signIn('discord', { callbackUrl });
    } catch (error) {
      console.error('Discord sign up error:', error);
      setErrors({ general: 'Discord sign up failed. Please try again.' });
      setIsOAuthLoading(false);
    }
  };

  return {
    isOAuthLoading,
    handleGoogleSignUp,
    handleDiscordSignUp,
  };
}
