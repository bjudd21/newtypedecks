/**
 * Profile field component for display and edit modes
 */

import React from 'react';
import { Input } from '@/components/ui';

interface ProfileFieldProps {
  label: string;
  value: string;
  type?: string;
  isEditing: boolean;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  value,
  type = 'text',
  isEditing,
  onChange,
  error,
  disabled,
}) => {
  if (isEditing && onChange) {
    return (
      <Input
        label={label}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={error}
        disabled={disabled}
      />
    );
  }

  return (
    <div>
      <label className="text-muted-foreground mb-1 block text-sm font-medium">
        {label}
      </label>
      <p className="text-white">{value || `No ${label.toLowerCase()} set`}</p>
    </div>
  );
};
