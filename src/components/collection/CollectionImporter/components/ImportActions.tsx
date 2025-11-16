/**
 * Import actions component (Import and Clear buttons)
 */

import React from 'react';
import { Button } from '@/components/ui';

interface ImportActionsProps {
  isImporting: boolean;
  hasData: boolean;
  onImport: () => void;
  onClear: () => void;
}

export const ImportActions: React.FC<ImportActionsProps> = ({
  isImporting,
  hasData,
  onImport,
  onClear,
}) => {
  return (
    <div className="flex gap-3">
      <Button
        onClick={onImport}
        disabled={!hasData || isImporting}
        className="flex-1 bg-gradient-to-r from-[#8b7aaa] to-[#6b5a8a] hover:from-[#a89ec7] hover:to-[#8b7aaa]"
      >
        {isImporting ? 'Importing...' : 'IMPORT TO COLLECTION'}
      </Button>

      <Button
        onClick={onClear}
        variant="outline"
        disabled={isImporting}
        className="border-[#8b7aaa] text-[#8b7aaa] hover:bg-[#8b7aaa] hover:text-white"
      >
        CLEAR
      </Button>
    </div>
  );
};
