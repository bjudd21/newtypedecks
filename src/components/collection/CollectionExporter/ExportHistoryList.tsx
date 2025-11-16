/**
 * ExportHistoryList Component
 * Displays recent export history
 */

import React from 'react';
import { Badge } from '@/components/ui';
import type { ExportRecord } from '@/lib/types';

interface ExportHistoryListProps {
  history: ExportRecord[];
}

export const ExportHistoryList: React.FC<ExportHistoryListProps> = ({
  history,
}) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="mb-2 text-sm font-medium text-gray-400">
        Recent Exports
      </div>
      <div className="max-h-32 space-y-2 overflow-y-auto">
        {history.map((record) => (
          <div
            key={record.id}
            className="flex items-center justify-between rounded border border-[#443a5c] bg-[#1a1625] p-2 text-sm"
          >
            <div className="flex-1">
              <div className="font-medium text-white">{record.format}</div>
              <div className="text-xs text-gray-400">
                {new Date(record.date).toLocaleDateString()} • {record.filename}
                {record.recordCount && ` • ${record.recordCount} cards`}
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {record.format.toLowerCase()}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};
