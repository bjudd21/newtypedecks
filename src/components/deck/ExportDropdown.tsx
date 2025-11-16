/**
 * ExportDropdown Component
 * Dropdown menu for exporting decks in multiple formats
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui';

interface ExportDropdownProps {
  uniqueCards: number;
  onExport: (format: 'json' | 'text' | 'csv') => void;
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({
  uniqueCards,
  onExport,
}) => {
  return (
    <div className="group relative">
      <Button
        variant="outline"
        disabled={uniqueCards === 0}
        onClick={() => onExport('json')}
      >
        Export Deck
        <span className="ml-1 text-xs">▼</span>
      </Button>

      {/* Export Options Dropdown */}
      <div className="absolute bottom-full left-0 z-10 mb-1 hidden min-w-48 rounded-lg border border-[#443a5c] bg-[#2d2640] shadow-lg group-hover:block">
        <div className="py-1">
          <button
            onClick={() => onExport('json')}
            disabled={uniqueCards === 0}
            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#3a3050] disabled:opacity-50"
          >
            📄 JSON Format
            <div className="text-xs text-gray-400">Complete deck data</div>
          </button>
          <button
            onClick={() => onExport('text')}
            disabled={uniqueCards === 0}
            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#3a3050] disabled:opacity-50"
          >
            📝 Text Format
            <div className="text-xs text-gray-400">Human readable</div>
          </button>
          <button
            onClick={() => onExport('csv')}
            disabled={uniqueCards === 0}
            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#3a3050] disabled:opacity-50"
          >
            📊 CSV Format
            <div className="text-xs text-gray-400">Spreadsheet compatible</div>
          </button>
        </div>
      </div>
    </div>
  );
};
