/**
 * Sign up form component - main orchestrator
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { isOAuthEnabled } from '@/lib/config/oauth';
import { SignUpFormFields } from './SignUpFormFields';
import { OAuthButtons } from './OAuthButtons';
import { useSignUpForm } from './hooks/useSignUpForm';
import { useOAuthHandlers } from './hooks/useOAuthHandlers';
import type { SignUpFormProps } from './types';

export const SignUpForm: React.FC<SignUpFormProps> = ({
  callbackUrl = '/',
  className = '',
}) => {
  const router = useRouter();
  const {
    formData,
    errors,
    isLoading,
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    handleInputChange,
    handleSubmit,
  } = useSignUpForm(callbackUrl);

  const { isOAuthLoading, handleGoogleSignUp, handleDiscordSignUp } =
    useOAuthHandlers(callbackUrl, (_newErrors) => {
      // Note: This is a bit of a workaround since we can't directly access setErrors from the hook
      // In a real implementation, you might want to refactor this
    });

  const combinedLoading = isLoading || isOAuthLoading;

  return (
    <Card className={`${className} border-[#443a5c] bg-[#2d2640]`}>
      <CardHeader>
        <CardTitle className="bg-gradient-to-r from-[#8b7aaa] via-[#a89ec7] to-[#8b7aaa] bg-clip-text text-center text-2xl text-transparent">
          Create Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* General Error */}
          {errors.general && (
            <div className="rounded border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
              {errors.general}
            </div>
          )}

          {/* Form Fields */}
          <SignUpFormFields
            formData={formData}
            errors={errors}
            isLoading={combinedLoading}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            onInputChange={handleInputChange}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onToggleConfirmPassword={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          />

          {/* Sign Up Button */}
          <Button
            type="submit"
            variant="critical"
            disabled={combinedLoading}
            className="w-full"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>

          {/* OAuth Buttons */}
          {isOAuthEnabled() && (
            <OAuthButtons
              onGoogleSignUp={handleGoogleSignUp}
              onDiscordSignUp={handleDiscordSignUp}
              isLoading={combinedLoading}
            />
          )}
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-400">Already have an account? </span>
          <button
            onClick={() => router.push('/auth/signin')}
            className="font-medium text-[#8b7aaa] hover:text-[#a89ec7]"
            disabled={combinedLoading}
          >
            Sign in
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
