import React from 'react';

interface SortControlsProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export function SortControls({
  sortBy,
  sortOrder,
  onChange,
}: SortControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Sort by:</span>
      <select
        className="rounded border border-gray-300 px-2 py-1 text-sm"
        value={`${sortBy}:${sortOrder}`}
        onChange={(e) => {
          const [newSortBy, newSortOrder] = e.target.value.split(':');
          onChange(newSortBy, newSortOrder as 'asc' | 'desc');
        }}
      >
        <option value="name:asc">Name (A-Z)</option>
        <option value="name:desc">Name (Z-A)</option>
        <option value="level:asc">Level (Low-High)</option>
        <option value="level:desc">Level (High-Low)</option>
        <option value="cost:asc">Cost (Low-High)</option>
        <option value="cost:desc">Cost (High-Low)</option>
        <option value="createdAt:desc">Recently Added</option>
      </select>
    </div>
  );
}
