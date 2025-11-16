/**
 * Filter header component with controls
 */

import React from 'react';
import { Button, Badge } from '@/components/ui';

interface FilterHeaderProps {
  activeFilterCount: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onClearAll: () => void;
}

export const FilterHeader: React.FC<FilterHeaderProps> = ({
  activeFilterCount,
  isExpanded,
  onToggleExpand,
  onClearAll,
}) => {
  return (
    <div className="flex items-center justify-between border-b p-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-medium">Advanced Filters</h3>
        {activeFilterCount > 0 && (
          <Badge variant="default" className="text-xs">
            {activeFilterCount} active
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        {activeFilterCount > 0 && (
          <Button onClick={onClearAll} variant="outline" size="sm">
            Clear All
          </Button>
        )}
        <Button
          onClick={onToggleExpand}
          variant="outline"
          size="sm"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>
    </div>
  );
};
