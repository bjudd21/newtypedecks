/**
 * Search Header Component
 * Card search input with icon
 */

'use client';

import React from 'react';
import { Input, Button } from '@/components/ui';

interface SearchHeaderProps {
  searchQuery: string;
  loading: boolean;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export function SearchHeader({
  searchQuery,
  loading,
  onSearchChange,
  onSearchSubmit,
}: SearchHeaderProps) {
  return (
    <div className="border-border bg-card flex items-center gap-4 rounded-lg border p-4">
      <div className="bg-primary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full shadow-md">
        <svg
          className="text-foreground h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <form onSubmit={onSearchSubmit} className="flex flex-1 gap-4">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search cards by name, type, or ability..."
          className="border-border bg-background placeholder:text-muted-foreground/50 focus:border-primary focus:ring-primary/30 text-foreground flex-1"
        />
        <Button
          type="submit"
          className="bg-primary/80 hover:bg-primary text-foreground px-6"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </form>
    </div>
  );
}
