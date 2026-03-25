/**
 * Pagination controls component
 */

import React from 'react';
import { Button } from '@/components/ui';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
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
