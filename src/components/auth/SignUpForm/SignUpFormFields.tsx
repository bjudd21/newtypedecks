/**
 * Form fields component for sign up form
 */

import React from 'react';
import { Input } from '@/components/ui';
import { PasswordInputWithToggle } from './PasswordInputWithToggle';
import { PasswordRequirements } from './PasswordRequirements';
import type { SignUpFormData, SignUpFormErrors } from './types';

interface SignUpFormFieldsProps {
  formData: SignUpFormData;
  errors: SignUpFormErrors;
  isLoading: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onInputChange: (field: keyof SignUpFormData, value: string) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
}

export const SignUpFormFields: React.FC<SignUpFormFieldsProps> = ({
  formData,
  errors,
  isLoading,
  showPassword,
  showConfirmPassword,
  onInputChange,
  onTogglePassword,
  onToggleConfirmPassword,
}) => {
  return (
    <>
      {/* Name Input */}
      <div>
        <Input
          type="text"
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          error={errors.name}
          disabled={isLoading}
          required
        />
      </div>

      {/* Email Input */}
      <div>
        <Input
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          error={errors.email}
          disabled={isLoading}
          required
        />
      </div>

      {/* Password Input */}
      <div>
        <PasswordInputWithToggle
          value={formData.password}
          onChange={(e) => onInputChange('password', e.target.value)}
          label="Password"
          placeholder="Create a password"
          error={errors.password}
          disabled={isLoading}
          showPassword={showPassword}
          onToggleVisibility={onTogglePassword}
          required
        />
      </div>

      {/* Confirm Password Input */}
      <div>
        <PasswordInputWithToggle
          value={formData.confirmPassword}
          onChange={(e) => onInputChange('confirmPassword', e.target.value)}
          label="Confirm Password"
          placeholder="Confirm your password"
          error={errors.confirmPassword}
          disabled={isLoading}
          showPassword={showConfirmPassword}
          onToggleVisibility={onToggleConfirmPassword}
          required
        />
      </div>

      {/* Password Requirements */}
      <PasswordRequirements />
    </>
  );
};
