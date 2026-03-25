/**
 * Search label component
 */

import React from 'react';

interface SearchLabelProps {
  labelId: string;
  inputId: string;
  label?: string;
}

export const SearchLabel: React.FC<SearchLabelProps> = ({
  labelId,
  inputId,
  label,
}) => {
  if (!label) return null;

  return (
    <label
      id={labelId}
      htmlFor={inputId}
      className="text-muted-foreground mb-2 block text-sm font-medium"
    >
      {label}
    </label>
  );
};
