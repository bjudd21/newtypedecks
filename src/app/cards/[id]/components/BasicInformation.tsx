/**
 * BasicInformation Component
 * Displays comprehensive card information including type, rarity, stats, and metadata
 */

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from '@/components/ui';
import type { CardWithRelations } from '@/lib/types/card';

// Stat field component
function StatField({
  label,
  value,
  isBadge = false,
}: {
  label: string;
  value: string | number;
  isBadge?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <div className="mt-1">
        {isBadge ? (
          <Badge variant="info">{value}</Badge>
        ) : (
          <span className="text-white">{value}</span>
        )}
      </div>
    </div>
  );
}

interface BasicInformationProps {
  card: CardWithRelations;
}

export function BasicInformation({ card }: BasicInformationProps) {
  return (
    <Card className="border-gray-700 bg-gray-800">
      <CardHeader>
        <CardTitle>Card Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Type and Rarity */}
          <div>
            <label className="text-sm font-medium text-gray-300">Type</label>
            <div className="mt-1">
              {card.type ? (
                <Badge variant="secondary">{card.type.name}</Badge>
              ) : (
                <span className="text-gray-500">Unknown</span>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Rarity</label>
            <div className="mt-1">
              {card.rarity ? (
                <Badge variant="info">{card.rarity.name}</Badge>
              ) : (
                <span className="text-gray-500">Unknown</span>
              )}
            </div>
          </div>

          {/* Level and Cost */}
          {card.level !== null && card.level !== undefined && (
            <StatField label="Level" value={`Level ${card.level}`} isBadge />
          )}

          {card.cost !== null && card.cost !== undefined && (
            <StatField label="Cost" value={`Cost ${card.cost}`} isBadge />
          )}

          {/* Combat Stats */}
          {card.clashPoints !== null && card.clashPoints !== undefined && (
            <StatField label="Clash Points" value={card.clashPoints} />
          )}

          {card.hitPoints !== null && card.hitPoints !== undefined && (
            <StatField label="Hit Points" value={card.hitPoints} />
          )}

          {card.attackPoints !== null && card.attackPoints !== undefined && (
            <StatField label="Attack Points" value={card.attackPoints} />
          )}

          {card.price !== null && card.price !== undefined && (
            <StatField label="Price" value={card.price} />
          )}

          {/* Faction and Series */}
          {card.faction && <StatField label="Faction" value={card.faction} />}

          {card.series && <StatField label="Series" value={card.series} />}

          {card.nation && <StatField label="Nation" value={card.nation} />}

          {/* Set Information */}
          {card.set && (
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-300">Set</label>
              <div className="mt-1 text-white">
                {card.set.name} #{card.setNumber}
              </div>
            </div>
          )}
        </div>

        {/* Special indicators */}
        <div className="mt-4 flex gap-2">
          {card.isFoil && (
            <Badge
              variant="secondary"
              className="bg-yellow-800/30 text-yellow-800"
            >
              Foil
            </Badge>
          )}
          {card.isPromo && (
            <Badge
              variant="secondary"
              className="bg-purple-800/30 text-purple-800"
            >
              Promo
            </Badge>
          )}
          {card.isAlternate && (
            <Badge
              variant="secondary"
              className="bg-green-800/30 text-green-800"
            >
              Alt Art
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
