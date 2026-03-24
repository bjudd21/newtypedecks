/**
 * Password input with visibility toggle
 */

'use client';

import React from 'react';
import { Input } from '@/components/ui';
import { EyeIcon } from './icons/EyeIcon';
import { EyeOffIcon } from './icons/EyeOffIcon';

interface PasswordInputProps {
  value: string;
  error?: string;
  showPassword: boolean;
  isLoading: boolean;
  onChange: (value: string) => void;
  onToggleVisibility: () => void;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  error,
  showPassword,
  isLoading,
  onChange,
  onToggleVisibility,
}) => {
  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        label="Password"
        placeholder="Enter your password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={error}
        disabled={isLoading}
        required
      />
      <button
        type="button"
        onClick={onToggleVisibility}
        className="absolute top-9 right-3 text-gray-400 hover:text-[#8b7aaa]"
        disabled={isLoading}
      >
        {showPassword ? <EyeIcon /> : <EyeOffIcon />}
      </button>
    </div>
  );
};
