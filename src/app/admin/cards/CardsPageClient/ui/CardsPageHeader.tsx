/**
 * Header component for admin cards page
 */

import React from 'react';
import { Button } from '@/components/ui/Button';

interface CardsPageHeaderProps {
  totalCount: number;
  onCreateClick: () => void;
}

export const CardsPageHeader: React.FC<CardsPageHeaderProps> = ({
  totalCount,
  onCreateClick,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white">Card Management</h1>
        <p className="mt-1 text-gray-400">
          Manage your Gundam card database ({totalCount.toLocaleString()} cards)
        </p>
      </div>
      <Button variant="primary" onClick={onCreateClick}>
        Create Card
      </Button>
    </div>
  );
};
