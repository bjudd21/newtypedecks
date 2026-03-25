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
    added: 'border-green-500/30 bg-green-900/20',
    removed: 'border-red-500/30 bg-red-900/20',
    modified: 'border-yellow-500/30 bg-yellow-900/20',
    unchanged: 'border-border bg-accent opacity-75',
  }[change.type];

  return (
    <div
      className={`flex items-center gap-3 rounded border p-2 ${borderColor}`}
    >
      {change.card.imageUrl && (
        <Image
          src={change.card.imageUrl}
          alt={change.card.name}
          width={imageSize}
          height={imageSize}
          loading="lazy"
          sizes={`${imageSize}px`}
          className={`rounded object-cover ${change.type === 'removed' ? 'opacity-75' : ''}`}
          style={{ width: imageSize, height: imageSize }}
        />
      )}
      <div className="flex-1">
        <div
          className={`font-medium ${change.type === 'unchanged' ? 'text-muted-foreground text-sm' : ''}`}
        >
          {change.card.name}
        </div>
        {change.type !== 'unchanged' && (
          <div className="text-muted-foreground text-sm">
            {change.card.type.name} • {change.card.rarity.name}
          </div>
        )}
      </div>
      {showModifiedQuantities ? (
        <div className="flex items-center gap-2">
          <Badge className="border-border text-muted-foreground bg-muted">
            {change.oldQuantity}
          </Badge>
          <span className="text-muted-foreground text-sm">→</span>
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
