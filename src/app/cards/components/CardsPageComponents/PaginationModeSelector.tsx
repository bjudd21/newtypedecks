import React from 'react';
import type { PaginationMode } from './types';

interface PaginationModeSelectorProps {
  mode: PaginationMode;
  onChange: (mode: PaginationMode) => void;
}

export function PaginationModeSelector({
  mode,
  onChange,
}: PaginationModeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">View:</span>
      <div className="flex overflow-hidden rounded-md border border-gray-300">
        <button
          onClick={() => onChange('infinite')}
          className={`px-3 py-1 text-xs font-medium transition-colors ${
            mode === 'infinite'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Infinite Scroll
        </button>
        <button
          onClick={() => onChange('traditional')}
          className={`px-3 py-1 text-xs font-medium transition-colors ${
            mode === 'traditional'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Pages
        </button>
      </div>
    </div>
  );
}
