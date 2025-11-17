/**
 * Search input component for admin cards page
 */

import React from 'react';
import { Input } from '@/components/ui/Input';

interface CardsPageSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export const CardsPageSearch: React.FC<CardsPageSearchProps> = ({
  search,
  onSearchChange,
}) => {
  return (
    <div className="max-w-md">
      <Input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search cards by name..."
        className="w-full"
      />
    </div>
  );
};
