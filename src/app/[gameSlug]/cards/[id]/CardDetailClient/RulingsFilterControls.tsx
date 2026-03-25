import React from 'react';
import { CardTitle } from '@/components/ui';

export function RulingsFilterControls({
  filter,
  search,
  onFilterChange,
  onSearchChange,
  totalCount,
  filteredCount,
}: {
  filter: 'all' | 'official' | 'community';
  search: string;
  onFilterChange: (value: 'all' | 'official' | 'community') => void;
  onSearchChange: (value: string) => void;
  totalCount: number;
  filteredCount: number;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <CardTitle className="flex items-center gap-2">
        <svg
          className="h-5 w-5 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Rulings & Clarifications
        <span className="text-muted-foreground text-sm font-normal">
          ({filteredCount} of {totalCount})
        </span>
      </CardTitle>

      <div className="flex flex-col gap-2 sm:flex-row">
        <select
          value={filter}
          onChange={(e) =>
            onFilterChange(e.target.value as 'all' | 'official' | 'community')
          }
          className="border-border bg-card focus:border-primary focus:ring-primary text-foreground rounded-md border px-3 py-1 text-sm focus:ring-2"
        >
          <option value="all">All Rulings</option>
          <option value="official">Official Only</option>
          <option value="community">Community</option>
        </select>

        <input
          type="text"
          placeholder="Search rulings..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border-border bg-card focus:border-primary focus:ring-primary text-foreground rounded-md border px-3 py-1 text-sm focus:ring-2"
        />
      </div>
    </div>
  );
}
