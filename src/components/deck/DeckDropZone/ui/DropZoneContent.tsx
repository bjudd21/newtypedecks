/**
 * DropZoneContent - Main content area with title and description
 */

import React from 'react';

interface DropZoneContentProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export const DropZoneContent: React.FC<DropZoneContentProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="p-4">
      <div className="mb-2 text-sm font-semibold tracking-wide text-gray-400 uppercase">
        {title}
      </div>

      {description && (
        <div className="mb-4 text-xs text-gray-500">{description}</div>
      )}

      {children}
    </div>
  );
};
