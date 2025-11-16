/**
 * Generic change section component
 */

import React from 'react';
import { CardChangeItem } from './CardChangeItem';
import type { CardChange } from '../types';

interface ChangeSectionProps {
  title: string;
  icon: string;
  titleColor: string;
  changes: CardChange[];
  showModifiedQuantities?: boolean;
}

export const ChangeSection: React.FC<ChangeSectionProps> = ({
  title,
  icon,
  titleColor,
  changes,
  showModifiedQuantities = false,
}) => {
  if (changes.length === 0) {
    return null;
  }

  return (
    <div>
      <h4 className={`mb-2 flex items-center gap-2 font-medium ${titleColor}`}>
        {icon} {title} ({changes.length})
      </h4>
      <div className="space-y-2">
        {changes.map((change) => (
          <CardChangeItem
            key={change.cardId}
            change={change}
            showModifiedQuantities={showModifiedQuantities}
          />
        ))}
      </div>
    </div>
  );
};
