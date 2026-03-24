/**
 * CollectionCardItem Component
 * Displays a single card in the collection with edit functionality
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { Button, Input, Select, Badge } from '@/components/ui';
import type { Card as CardType } from '@/lib/types';

interface CollectionCard {
  cardId: string;
  card: CardType;
  quantity: number;
  condition: string;
  addedAt: Date | string;
  updatedAt: Date | string;
}

interface CollectionCardItemProps {
  collectionCard: CollectionCard;
  isEditing: boolean;
  editQuantity: number;
  editCondition: string;
  conditions: string[];
  onStartEdit: (card: CollectionCard) => void;
  onCancelEdit: () => void;
  onUpdateCard: (cardId: string, quantity: number, condition: string) => void;
  onQuantityChange: (quantity: number) => void;
  onConditionChange: (condition: string) => void;
}

export const CollectionCardItem: React.FC<CollectionCardItemProps> = ({
  collectionCard,
  isEditing,
  editQuantity,
  editCondition,
  conditions,
  onStartEdit,
  onCancelEdit,
  onUpdateCard,
  onQuantityChange,
  onConditionChange,
}) => {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[#443a5c] bg-[#1a1625] p-4 hover:bg-[#3a3050]">
      <div className="flex items-center space-x-4">
        {(collectionCard.card.imageUrlSmall ??
          collectionCard.card.imageUrl) && (
          <Image
            src={
              (collectionCard.card.imageUrlSmall ??
                collectionCard.card.imageUrl)!
            }
            alt={collectionCard.card.name}
            width={64}
            height={80}
            loading="lazy"
            sizes="64px"
            className="rounded object-cover"
          />
        )}
        <div>
          <h3 className="font-semibold text-white">
            {collectionCard.card.name}
          </h3>
          <div className="mt-1 flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {(
                collectionCard.card as unknown as {
                  rarity?: { name: string };
                }
              ).rarity?.name || 'Unknown'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {(
                collectionCard.card as unknown as {
                  type?: { name: string };
                }
              ).type?.name || 'Unknown'}
            </Badge>
            {collectionCard.card.faction && (
              <Badge variant="outline" className="text-xs">
                {typeof collectionCard.card.faction === 'string'
                  ? collectionCard.card.faction
                  : 'Unknown'}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-400">
            Added: {new Date(collectionCard.addedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <div>
              <label className="block text-xs text-gray-400">Qty</label>
              <Input
                type="number"
                min="0"
                max="99"
                value={editQuantity}
                onChange={(e) =>
                  onQuantityChange(parseInt(e.target.value) || 0)
                }
                className="w-16 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400">Condition</label>
              <Select
                value={editCondition}
                onChange={onConditionChange}
                options={conditions.map((condition) => ({
                  value: condition,
                  label: condition,
                }))}
              />
            </div>
            <div className="pt-4">
              <Button
                size="sm"
                onClick={() =>
                  onUpdateCard(
                    collectionCard.cardId,
                    editQuantity,
                    editCondition
                  )
                }
                className="mr-1"
              >
                ✓
              </Button>
              <Button size="sm" variant="outline" onClick={onCancelEdit}>
                ✕
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="font-semibold text-white">
                {collectionCard.quantity}x
              </div>
              <div className="text-xs text-gray-400">
                {collectionCard.condition}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStartEdit(collectionCard)}
            >
              Edit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
