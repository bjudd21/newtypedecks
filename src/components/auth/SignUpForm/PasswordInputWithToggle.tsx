/**
 * Reusable password input component with visibility toggle
 */

import React from 'react';
import { Input } from '@/components/ui';
import { EyeIcon, EyeOffIcon } from './icons';

interface PasswordInputWithToggleProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  placeholder: string;
  error?: string;
  disabled?: boolean;
  showPassword: boolean;
  onToggleVisibility: () => void;
  required?: boolean;
}

export const PasswordInputWithToggle: React.FC<
  PasswordInputWithToggleProps
> = ({
  value,
  onChange,
  label,
  placeholder,
  error,
  disabled = false,
  showPassword,
  onToggleVisibility,
  required = false,
}) => {
  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        error={error}
        disabled={disabled}
        required={required}
      />
      <button
        type="button"
        onClick={onToggleVisibility}
        className="text-muted-foreground/70 hover:text-muted-foreground absolute top-9 right-3"
        disabled={disabled}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <EyeIcon /> : <EyeOffIcon />}
      </button>
    </div>
  );
};
