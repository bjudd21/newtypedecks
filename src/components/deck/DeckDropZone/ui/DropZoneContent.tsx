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
      <div className="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
        {title}
      </div>

      {description && (
        <div className="text-muted-foreground/70 mb-4 text-xs">
          {description}
        </div>
      )}

      {children}
    </div>
  );
};
