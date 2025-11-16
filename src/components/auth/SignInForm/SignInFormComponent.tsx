'use client';

import React from 'react';
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { useFormState } from './hooks/useFormState';
import { usePasswordVisibility } from './hooks/usePasswordVisibility';
import { useSignInHandlers } from './hooks/useSignInHandlers';
import { GeneralError } from './components/GeneralError';
import { PasswordInput } from './components/PasswordInput';
import { ForgotPasswordLink } from './components/ForgotPasswordLink';
import { OAuthSection } from './components/OAuthSection';
import { SignUpLink } from './components/SignUpLink';
import type { SignInFormProps } from './types';

export const SignInFormComponent: React.FC<SignInFormProps> = ({
  callbackUrl = '/',
  className = '',
}) => {
  // Form state
  const {
    formData,
    errors,
    isLoading,
    setErrors,
    setIsLoading,
    handleInputChange,
  } = useFormState();

  // Password visibility
  const { showPassword, togglePasswordVisibility } = usePasswordVisibility();

  // Sign-in handlers
  const { handleCredentialsSignIn, handleGoogleSignIn, handleDiscordSignIn } =
    useSignInHandlers({
      formData,
      callbackUrl,
      setErrors,
      setIsLoading,
    });

  return (
    <Card className={`border-[#443a5c] bg-[#2d2640] shadow-2xl ${className}`}>
      <CardHeader>
        <CardTitle className="text-center text-2xl text-[#8b7aaa]">
          Sign In
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          {/* General Error */}
          <GeneralError error={errors.general} />

          {/* Email Input */}
          <div>
            <Input
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              disabled={isLoading}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <PasswordInput
              value={formData.password}
              error={errors.password}
              showPassword={showPassword}
              isLoading={isLoading}
              onChange={(value) => handleInputChange('password', value)}
              onToggleVisibility={togglePasswordVisibility}
            />
          </div>

          {/* Forgot Password Link */}
          <ForgotPasswordLink isLoading={isLoading} />

          {/* Sign In Button */}
          <Button
            type="submit"
            variant="critical"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          {/* OAuth Section */}
          <OAuthSection
            isLoading={isLoading}
            onGoogleSignIn={handleGoogleSignIn}
            onDiscordSignIn={handleDiscordSignIn}
          />
        </form>

        {/* Sign Up Link */}
        <SignUpLink isLoading={isLoading} />
      </CardContent>
    </Card>
  );
};

export default SignInFormComponent;
