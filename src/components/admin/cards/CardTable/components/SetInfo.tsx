/**
 * Set information display component
 */

import React from 'react';

interface SetInfoProps {
  set?: { name: string; code: string } | null;
}

export const SetInfo: React.FC<SetInfoProps> = ({ set }) => {
  if (!set) {
    return <span className="text-sm text-gray-500">—</span>;
  }

  return (
    <div className="text-sm">
      <div className="text-gray-300">{set.name}</div>
      <div className="text-xs text-gray-500">{set.code}</div>
    </div>
  );
};
