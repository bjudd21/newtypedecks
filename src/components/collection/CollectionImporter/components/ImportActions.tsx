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
        className="bg-primary hover:bg-primary/90 flex-1"
      >
        {isImporting ? 'Importing...' : 'IMPORT TO COLLECTION'}
      </Button>

      <Button
        onClick={onClear}
        variant="outline"
        disabled={isImporting}
        className="border-primary text-primary hover:bg-primary hover:text-foreground"
      >
        CLEAR
      </Button>
    </div>
  );
};
