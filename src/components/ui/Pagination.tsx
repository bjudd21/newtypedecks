// Pagination component for navigating through pages
import React from 'react';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  className?: string;
  disabled?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className,
  disabled = false,
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // Adjust if we're near the beginning or end
    if (currentPage <= halfVisible) {
      endPage = Math.min(totalPages, maxVisiblePages);
    }
    if (currentPage > totalPages - halfVisible) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const handlePageClick = (page: number) => {
    if (!disabled && page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const PaginationButton: React.FC<{
    page: number | string;
    isActive?: boolean;
    isDisabled?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
  }> = ({ page, isActive = false, isDisabled = false, onClick, children }) => (
    <button
      onClick={onClick}
      disabled={isDisabled || disabled}
      className={cn(
        'relative inline-flex items-center px-4 py-2 text-sm font-medium transition-colors duration-200',
        isActive
          ? 'z-10 bg-blue-600 text-white'
          : 'bg-white text-gray-700 hover:bg-gray-50',
        isDisabled || disabled
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer',
        typeof page === 'number' && 'border border-gray-300',
        typeof page === 'string' && 'border-0'
      )}
    >
      {children}
    </button>
  );

  return (
    <nav
      className={cn('flex items-center justify-center space-x-1', className)}
    >
      {/* First page button */}
      {showFirstLast && currentPage > 1 && (
        <PaginationButton page={1} onClick={() => handlePageClick(1)}>
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </PaginationButton>
      )}

      {/* Previous page button */}
      {showPrevNext && (
        <PaginationButton
          page={currentPage - 1}
          isDisabled={currentPage <= 1}
          onClick={() => handlePageClick(currentPage - 1)}
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </PaginationButton>
      )}

      {/* Page numbers */}
      {visiblePages.map((page, index) => (
        <PaginationButton
          key={index}
          page={page}
          isActive={page === currentPage}
          onClick={() => typeof page === 'number' && handlePageClick(page)}
        >
          {page}
        </PaginationButton>
      ))}

      {/* Next page button */}
      {showPrevNext && (
        <PaginationButton
          page={currentPage + 1}
          isDisabled={currentPage >= totalPages}
          onClick={() => handlePageClick(currentPage + 1)}
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </PaginationButton>
      )}

      {/* Last page button */}
      {showFirstLast && currentPage < totalPages && (
        <PaginationButton
          page={totalPages}
          onClick={() => handlePageClick(totalPages)}
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </PaginationButton>
      )}
    </nav>
  );
};

export { Pagination };
