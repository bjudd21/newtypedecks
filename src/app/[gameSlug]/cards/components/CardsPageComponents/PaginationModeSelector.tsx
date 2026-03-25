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
      <span className="text-muted-foreground text-sm">View:</span>
      <div className="border-border flex overflow-hidden rounded-md border">
        <button
          onClick={() => onChange('infinite')}
          className={`px-3 py-1 text-xs font-medium transition-colors ${
            mode === 'infinite'
              ? 'bg-blue-600 text-white'
              : 'bg-card text-muted-foreground hover:bg-accent'
          }`}
        >
          Infinite Scroll
        </button>
        <button
          onClick={() => onChange('traditional')}
          className={`px-3 py-1 text-xs font-medium transition-colors ${
            mode === 'traditional'
              ? 'bg-blue-600 text-white'
              : 'bg-card text-muted-foreground hover:bg-accent'
          }`}
        >
          Pages
        </button>
      </div>
    </div>
  );
}
