/**
 * Set information display component
 */

import React from 'react';

interface SetInfoProps {
  set?: { name: string; code: string } | null;
}

export const SetInfo: React.FC<SetInfoProps> = ({ set }) => {
  if (!set) {
    return <span className="text-muted-foreground/70 text-sm">—</span>;
  }

  return (
    <div className="text-sm">
      <div className="text-foreground">{set.name}</div>
      <div className="text-muted-foreground/70 text-xs">{set.code}</div>
    </div>
  );
};
