/**
 * Table row component for single card
 */

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CardThumbnail } from './CardThumbnail';
import { RarityBadge } from './RarityBadge';
import { SetInfo } from './SetInfo';
import type { Card } from '../types';

interface TableRowProps {
  card: Card;
  onEdit: (card: Card) => void;
  onDelete: (card: Card) => void;
}

export const TableRow: React.FC<TableRowProps> = ({
  card,
  onEdit,
  onDelete,
}) => {
  return (
    <tr className="hover:bg-accent transition-colors">
      <td className="px-4 py-3">
        <CardThumbnail imageUrl={card.imageUrl} name={card.name} />
      </td>
      <td className="px-4 py-3">
        <div className="max-w-xs">
          <div className="text-foreground truncate font-medium">
            {card.name}
          </div>
          {card.setNumber && (
            <div className="text-muted-foreground text-xs">
              #{card.setNumber}
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        {card.type ? (
          <Badge variant="secondary" className="text-xs">
            {card.type.name}
          </Badge>
        ) : (
          <span className="text-muted-foreground/70 text-sm">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        <RarityBadge rarity={card.rarity} />
      </td>
      <td className="px-4 py-3">
        <SetInfo set={card.set} />
      </td>
      <td className="px-4 py-3 text-center">
        {card.level !== null && card.level !== undefined ? (
          <span className="text-foreground text-sm">{card.level}</span>
        ) : (
          <span className="text-muted-foreground/70 text-sm">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-center">
        {card.cost !== null && card.cost !== undefined ? (
          <span className="text-foreground text-sm">{card.cost}</span>
        ) : (
          <span className="text-muted-foreground/70 text-sm">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => onEdit(card)}>
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(card)}
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
};
