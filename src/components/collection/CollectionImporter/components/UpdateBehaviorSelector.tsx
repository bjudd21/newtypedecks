/**
 * Update behavior selector component
 */

import React from 'react';
import { Select } from '@/components/ui';
import type { UpdateBehavior } from '../types';

interface UpdateBehaviorSelectorProps {
  updateBehavior: UpdateBehavior;
  onUpdateBehaviorChange: (behavior: UpdateBehavior) => void;
}

export const UpdateBehaviorSelector: React.FC<
  UpdateBehaviorSelectorProps
> = ({ updateBehavior, onUpdateBehaviorChange }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-400">
        Update Behavior
      </label>
      <Select
        value={updateBehavior}
        onChange={(value: string) => onUpdateBehaviorChange(value as UpdateBehavior)}
        options={[
          { value: 'add', label: 'Add to existing quantities' },
          { value: 'replace', label: 'Replace existing quantities' },
          { value: 'skip', label: 'Skip cards already in collection' },
        ]}
      />
      <div className="mt-1 text-xs text-gray-400">
        How to handle cards that are already in your collection
      </div>
    </div>
  );
};
