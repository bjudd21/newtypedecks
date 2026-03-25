/**
 * Search icon component
 */

import React from 'react';

export const SearchIcon: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      <svg
        className="text-muted-foreground h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
};
