/**
 * Individual card change item component
 */

import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui';
import { getChangeBadgeColor } from '../utils';
import type { CardChange } from '../types';

interface CardChangeItemProps {
  change: CardChange;
  imageSize?: number;
  showModifiedQuantities?: boolean;
}

export const CardChangeItem: React.FC<CardChangeItemProps> = ({
  change,
  imageSize = 40,
  showModifiedQuantities = false,
}) => {
  const borderColor = {
    added: 'border-green-200 bg-green-50',
    removed: 'border-red-200 bg-red-50',
    modified: 'border-yellow-200 bg-yellow-50',
    unchanged: 'border-gray-200 bg-gray-50 opacity-75',
  }[change.type];

  return (
    <div
      className={`flex items-center gap-3 rounded border p-2 ${borderColor}`}
    >
      <Image
        src={change.card.imageUrl}
        alt={change.card.name}
        width={imageSize}
        height={imageSize}
        className={`h-${imageSize / 4} w-${imageSize / 4} rounded object-cover ${change.type === 'removed' ? 'opacity-75' : ''}`}
        style={{ width: imageSize, height: imageSize }}
      />
      <div className="flex-1">
        <div
          className={`font-medium ${change.type === 'unchanged' ? 'text-sm text-gray-700' : ''}`}
        >
          {change.card.name}
        </div>
        {change.type !== 'unchanged' && (
          <div className="text-sm text-gray-600">
            {change.card.type.name} • {change.card.rarity.name}
          </div>
        )}
      </div>
      {showModifiedQuantities ? (
        <div className="flex items-center gap-2">
          <Badge className="border-gray-200 bg-gray-100 text-gray-600">
            {change.oldQuantity}
          </Badge>
          <span className="text-sm text-gray-400">→</span>
          <Badge className={getChangeBadgeColor(change.type)}>
            {change.newQuantity}
          </Badge>
        </div>
      ) : (
        <Badge className={getChangeBadgeColor(change.type)}>
          {change.type === 'added' && `+${change.newQuantity}`}
          {change.type === 'removed' && `-${change.oldQuantity}`}
          {change.type === 'unchanged' && change.oldQuantity}
        </Badge>
      )}
    </div>
  );
};
