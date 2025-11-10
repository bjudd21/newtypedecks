'use client';

import React from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from '@/components/ui';

interface DeckCard {
  id: string;
  cardId: string;
  quantity: number;
  category?: string;
  card: {
    id: string;
    name: string;
    cost?: number;
    type: { name: string };
    rarity: { name: string };
    imageUrl: string;
  };
}

interface DeckVersion {
  id: string;
  version: number;
  name: string;
  versionName?: string;
  createdAt: string;
  cardCount: number;
  uniqueCards: number;
  totalCost: number;
  cards: DeckCard[];
}

interface DeckVersionComparisonProps {
  versionA: DeckVersion;
  versionB: DeckVersion;
  className?: string;
}

interface CardChange {
  type: 'added' | 'removed' | 'modified' | 'unchanged';
  cardName: string;
  cardId: string;
  card: DeckCard['card'];
  oldQuantity?: number;
  newQuantity?: number;
  category?: string;
}

export const DeckVersionComparison: React.FC<DeckVersionComparisonProps> = ({
  versionA,
  versionB,
  className,
}) => {
  // Calculate changes between versions
  const calculateChanges = (): CardChange[] => {
    const changes: CardChange[] = [];
    const cardsA = new Map(versionA.cards.map((c) => [c.cardId, c]));
    const cardsB = new Map(versionB.cards.map((c) => [c.cardId, c]));

    // Find all unique card IDs
    const allCardIds = new Set([...cardsA.keys(), ...cardsB.keys()]);

    for (const cardId of allCardIds) {
      const cardA = cardsA.get(cardId);
      const cardB = cardsB.get(cardId);

      if (cardA && cardB) {
        // Card exists in both versions
        if (cardA.quantity !== cardB.quantity) {
          changes.push({
            type: 'modified',
            cardName: cardA.card.name,
            cardId,
            card: cardA.card,
            oldQuantity: cardA.quantity,
            newQuantity: cardB.quantity,
            category: cardB.category,
          });
        } else {
          changes.push({
            type: 'unchanged',
            cardName: cardA.card.name,
            cardId,
            card: cardA.card,
            oldQuantity: cardA.quantity,
            newQuantity: cardB.quantity,
            category: cardB.category,
          });
        }
      } else if (cardA && !cardB) {
        // Card removed in version B
        changes.push({
          type: 'removed',
          cardName: cardA.card.name,
          cardId,
          card: cardA.card,
          oldQuantity: cardA.quantity,
          category: cardA.category,
        });
      } else if (!cardA && cardB) {
        // Card added in version B
        changes.push({
          type: 'added',
          cardName: cardB.card.name,
          cardId,
          card: cardB.card,
          newQuantity: cardB.quantity,
          category: cardB.category,
        });
      }
    }

    // Sort by card name
    return changes.sort((a, b) => a.cardName.localeCompare(b.cardName));
  };

  const changes = calculateChanges();
  const addedCards = changes.filter((c) => c.type === 'added');
  const removedCards = changes.filter((c) => c.type === 'removed');
  const modifiedCards = changes.filter((c) => c.type === 'modified');
  const unchangedCards = changes.filter((c) => c.type === 'unchanged');

  const _getChangeIcon = (type: CardChange['type']) => {
    switch (type) {
      case 'added':
        return '➕';
      case 'removed':
        return '➖';
      case 'modified':
        return '🔄';
      case 'unchanged':
        return '🔹';
      default:
        return '';
    }
  };

  const getChangeBadgeColor = (type: CardChange['type']) => {
    switch (type) {
      case 'added':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'removed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'modified':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unchanged':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Version Comparison</CardTitle>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div>
              <Badge variant="outline">v{versionA.version}</Badge>
              <span className="ml-2">
                {versionA.versionName || versionA.name}
              </span>
            </div>
            <span>→</span>
            <div>
              <Badge variant="outline">v{versionB.version}</Badge>
              <span className="ml-2">
                {versionB.versionName || versionB.name}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Summary Statistics */}
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {addedCards.length}
                </div>
                <div className="text-gray-600">Added</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">
                  {removedCards.length}
                </div>
                <div className="text-gray-600">Removed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-600">
                  {modifiedCards.length}
                </div>
                <div className="text-gray-600">Modified</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-600">
                  {unchangedCards.length}
                </div>
                <div className="text-gray-600">Unchanged</div>
              </div>
            </div>
          </div>

          {/* Detailed Changes */}
          {changes.length === 0 ? (
            <div className="py-8 text-center text-gray-600">
              No changes between these versions.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Added Cards */}
              {addedCards.length > 0 && (
                <div>
                  <h4 className="mb-2 flex items-center gap-2 font-medium text-green-700">
                    ➕ Added Cards ({addedCards.length})
                  </h4>
                  <div className="space-y-2">
                    {addedCards.map((change) => (
                      <div
                        key={change.cardId}
                        className="flex items-center gap-3 rounded border border-green-200 bg-green-50 p-2"
                      >
                        <Image
                          src={change.card.imageUrl}
                          alt={change.card.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{change.card.name}</div>
                          <div className="text-sm text-gray-600">
                            {change.card.type.name} • {change.card.rarity.name}
                          </div>
                        </div>
                        <Badge className={getChangeBadgeColor('added')}>
                          +{change.newQuantity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Removed Cards */}
              {removedCards.length > 0 && (
                <div>
                  <h4 className="mb-2 flex items-center gap-2 font-medium text-red-700">
                    ➖ Removed Cards ({removedCards.length})
                  </h4>
                  <div className="space-y-2">
                    {removedCards.map((change) => (
                      <div
                        key={change.cardId}
                        className="flex items-center gap-3 rounded border border-red-200 bg-red-50 p-2"
                      >
                        <Image
                          src={change.card.imageUrl}
                          alt={change.card.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded object-cover opacity-75"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{change.card.name}</div>
                          <div className="text-sm text-gray-600">
                            {change.card.type.name} • {change.card.rarity.name}
                          </div>
                        </div>
                        <Badge className={getChangeBadgeColor('removed')}>
                          -{change.oldQuantity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modified Cards */}
              {modifiedCards.length > 0 && (
                <div>
                  <h4 className="mb-2 flex items-center gap-2 font-medium text-yellow-700">
                    🔄 Modified Cards ({modifiedCards.length})
                  </h4>
                  <div className="space-y-2">
                    {modifiedCards.map((change) => (
                      <div
                        key={change.cardId}
                        className="flex items-center gap-3 rounded border border-yellow-200 bg-yellow-50 p-2"
                      >
                        <Image
                          src={change.card.imageUrl}
                          alt={change.card.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{change.card.name}</div>
                          <div className="text-sm text-gray-600">
                            {change.card.type.name} • {change.card.rarity.name}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="border-gray-200 bg-gray-100 text-gray-600">
                            {change.oldQuantity}
                          </Badge>
                          <span className="text-sm text-gray-400">→</span>
                          <Badge className={getChangeBadgeColor('modified')}>
                            {change.newQuantity}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Unchanged Cards (collapsed by default) */}
              {unchangedCards.length > 0 && (
                <details>
                  <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                    🔹 Unchanged Cards ({unchangedCards.length}) - Click to
                    expand
                  </summary>
                  <div className="mt-2 space-y-2">
                    {unchangedCards.map((change) => (
                      <div
                        key={change.cardId}
                        className="flex items-center gap-3 rounded border border-gray-200 bg-gray-50 p-2 opacity-75"
                      >
                        <Image
                          src={change.card.imageUrl}
                          alt={change.card.name}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded object-cover"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-700">
                            {change.card.name}
                          </div>
                        </div>
                        <Badge className={getChangeBadgeColor('unchanged')}>
                          {change.oldQuantity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeckVersionComparison;
