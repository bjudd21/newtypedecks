/**
 * Manual load more button component
 */

import React from 'react';
import { Button } from '@/components/ui';

interface ManualLoadButtonProps {
  onClick: () => void;
  text?: string;
  isLoading: boolean;
}

export const ManualLoadButton: React.FC<ManualLoadButtonProps> = ({
  onClick,
  text = 'Load More',
  isLoading,
}) => {
  return (
    <div className="flex justify-center py-8">
      <Button onClick={onClick} variant="outline" disabled={isLoading}>
        {text}
      </Button>
    </div>
  );
};
