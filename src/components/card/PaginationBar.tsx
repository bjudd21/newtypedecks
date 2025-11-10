/**
 * Pagination Bar Component
 * Navigation controls for paginated card results
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui';

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export function PaginationBar({
  currentPage,
  totalPages,
  loading,
  onPageChange,
}: PaginationBarProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between rounded-lg border border-[#443a5c] bg-[#2d2640] p-3">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || loading}
          className="border-[#443a5c] bg-[#1a1625] text-white hover:border-[#6b5a8a] hover:bg-[#6b5a8a] disabled:cursor-not-allowed disabled:opacity-50"
        >
          ← Previous
        </Button>
        <div className="rounded-md border border-[#443a5c] bg-[#1a1625] px-4 py-1.5 text-sm">
          <span className="font-medium text-white">{currentPage}</span>
          <span className="mx-1 text-gray-400">/</span>
          <span className="text-gray-400">{totalPages}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || loading}
          className="border-[#443a5c] bg-[#1a1625] text-white hover:border-[#6b5a8a] hover:bg-[#6b5a8a] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next →
        </Button>
      </div>

      <div className="text-sm text-gray-400">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
