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
    <div className="border-border bg-card flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || loading}
          className="border-border bg-background hover:border-primary hover:bg-primary/80 text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          ← Previous
        </Button>
        <div className="border-border bg-background rounded-md border px-4 py-1.5 text-sm">
          <span className="text-foreground font-medium">{currentPage}</span>
          <span className="text-muted-foreground mx-1">/</span>
          <span className="text-muted-foreground">{totalPages}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || loading}
          className="border-border bg-background hover:border-primary hover:bg-primary/80 text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next →
        </Button>
      </div>

      <div className="text-muted-foreground text-sm">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
