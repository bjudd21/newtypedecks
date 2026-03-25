/**
 * CollectionPagination Component
 * Pagination controls for navigating through collection pages
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui';

interface CollectionPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const CollectionPagination: React.FC<CollectionPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-6 flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="border-primary text-primary hover:bg-primary hover:text-foreground disabled:opacity-50"
      >
        Previous
      </Button>
      <span className="text-muted-foreground text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="border-primary text-primary hover:bg-primary hover:text-foreground disabled:opacity-50"
      >
        Next
      </Button>
    </div>
  );
};
