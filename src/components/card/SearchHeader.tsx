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
    <div className="flex items-center gap-4 rounded-lg border border-[#443a5c] bg-[#2d2640] p-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#6b5a8a] to-[#8b7aaa] shadow-lg">
        <svg
          className="h-5 w-5 text-white"
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
          className="flex-1 border-[#443a5c] bg-[#1a1625] text-white placeholder-gray-500 focus:border-[#6b5a8a] focus:ring-[#6b5a8a]/30"
        />
        <Button
          type="submit"
          className="bg-[#6b5a8a] px-6 text-white hover:bg-[#8b7aaa]"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </form>
    </div>
  );
}
