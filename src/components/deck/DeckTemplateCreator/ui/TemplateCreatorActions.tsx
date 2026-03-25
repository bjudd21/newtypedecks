/**
 * Template creator actions component
 */

import React from 'react';
import { Button } from '@/components/ui';

interface TemplateCreatorActionsProps {
  isCreating: boolean;
  templateName: string;
  cardCount: number;
  onCreateTemplate: () => void;
}

export const TemplateCreatorActions: React.FC<TemplateCreatorActionsProps> = ({
  isCreating,
  templateName,
  cardCount,
  onCreateTemplate,
}) => {
  return (
    <>
      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onCreateTemplate}
          disabled={isCreating || !templateName.trim() || cardCount === 0}
          variant="default"
          className="flex-1"
        >
          {isCreating ? 'Creating Template...' : 'Create Template'}
        </Button>
      </div>

      {/* Success Note */}
      <div className="text-muted-foreground/70 text-center text-xs">
        Once created, your template will be available in the community template
        browser for others to discover and use.
      </div>
    </>
  );
};
