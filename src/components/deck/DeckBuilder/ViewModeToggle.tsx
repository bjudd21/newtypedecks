/**
 * ViewModeToggle
 * Three-button toggle for Image / Text / Spreadsheet deck view modes.
 */

'use client';

import React from 'react';

export type ViewMode = 'image' | 'text' | 'spreadsheet';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const MODES: { key: ViewMode; icon: string; title: string }[] = [
  { key: 'image', icon: '▦', title: 'Image Grid' },
  { key: 'text', icon: '≡', title: 'Text List' },
  { key: 'spreadsheet', icon: '⊞', title: 'Spreadsheet' },
];

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onChange,
}) => (
  <div className="border-border flex gap-0.5 rounded border p-0.5">
    {MODES.map(({ key, icon, title }) => (
      <button
        key={key}
        onClick={() => onChange(key)}
        title={title}
        className={`rounded px-2 py-1 text-xs transition-colors ${
          viewMode === key
            ? 'bg-border text-primary'
            : 'text-muted-foreground/70 hover:text-foreground'
        }`}
      >
        {icon}
      </button>
    ))}
  </div>
);
