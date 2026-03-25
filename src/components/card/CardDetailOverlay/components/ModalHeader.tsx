/**
 * Modal header with title and close button
 */

import React from 'react';
import { Button } from '@/components/ui';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => {
  return (
    <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-700 bg-gray-900 px-4 py-3">
      <h1 className="text-xl font-bold text-white">{title}</h1>
      <Button
        variant="outline"
        size="sm"
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground border-gray-600"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </Button>
    </div>
  );
};
