/**
 * FilterSelect Component
 * Reusable select dropdown for card filters
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  label: string;
  value: string | undefined;
  options: SelectOption[];
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  value,
  options,
  onChange,
  placeholder = 'All',
  disabled = false,
  className,
}) => {
  return (
    <div className={cn('flex flex-col', className)}>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="block w-full rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
