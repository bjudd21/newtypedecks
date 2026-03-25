/**
 * Pagination component for deck browsing
 */

import React from 'react';
import { Button } from '@/components/ui';
import type { PaginationState } from '../types';

interface PaginationProps {
  pagination: PaginationState;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
}) => {
  if (pagination.pages <= 1) {
    return null;
  }

  return (
    <div className="mt-8 flex items-center justify-center space-x-4">
      <Button
        variant="outline"
        disabled={pagination.page <= 1}
        onClick={() => onPageChange(pagination.page - 1)}
      >
        Previous
      </Button>
      <span className="text-muted-foreground text-sm">
        Page {pagination.page} of {pagination.pages}
      </span>
      <Button
        variant="outline"
        disabled={pagination.page >= pagination.pages}
        onClick={() => onPageChange(pagination.page + 1)}
      >
        Next
      </Button>
    </div>
  );
};
