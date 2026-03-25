/**
 * Pagination component for template browsing
 */

import React from 'react';
import { Button } from '@/components/ui';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <Button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        variant="outline"
        size="sm"
      >
        Previous
      </Button>

      <span className="text-muted-foreground text-sm">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        variant="outline"
        size="sm"
      >
        Next
      </Button>
    </div>
  );
};
