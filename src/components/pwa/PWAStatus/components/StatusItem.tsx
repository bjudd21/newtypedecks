/**
 * Reusable status item component
 */

import React from 'react';

interface StatusItemProps {
  icon: string;
  label: string;
  children: React.ReactNode;
}

export const StatusItem: React.FC<StatusItemProps> = ({
  icon,
  label,
  children,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      {children}
    </div>
  );
};
