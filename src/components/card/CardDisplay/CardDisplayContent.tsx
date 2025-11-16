/**
 * CardDisplayContent - Main component orchestrator
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui';
import { GameContentAttribution } from '@/components/layout/BandaiNamcoAttribution';
import type { CardWithRelations } from '@/lib/types/card';
import { cn } from '@/lib/utils';
import { CardHeaderSection } from './CardHeaderSection';
import { CardMetadataBadges } from './CardMetadataBadges';
import { CardBasicStats } from './CardBasicStats';
import { CardExtendedDetails } from './CardExtendedDetails';
import { CardSpecialIndicators } from './CardSpecialIndicators';

export interface CardDisplayProps {
  card: CardWithRelations;
  className?: string;
  showFullDetails?: boolean;
  onClick?: (card: CardWithRelations) => void;
  showAttribution?: boolean;
}

export const CardDisplayContent: React.FC<CardDisplayProps> = ({
  card,
  className,
  showFullDetails = false,
  onClick,
  showAttribution = true,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(card);
    }
  };

  const cardContent = (
    <Card className={cn('transition-shadow hover:shadow-md', className)}>
      <CardHeader className="pb-3">
        <CardHeaderSection
          name={card.name}
          pilot={card.pilot}
          model={card.model}
          imageUrl={card.imageUrl}
          imageUrlSmall={card.imageUrlSmall}
        />

        <CardMetadataBadges
          type={card.type}
          rarity={card.rarity}
          level={card.level}
          cost={card.cost}
        />
      </CardHeader>

      <CardContent className="pt-0">
        {/* Basic stats */}
        <CardBasicStats
          faction={card.faction}
          series={card.series}
          clashPoints={card.clashPoints}
          hitPoints={card.hitPoints}
        />

        {/* Description preview */}
        {card.description && (
          <div className="mt-3">
            <p className="line-clamp-2 text-sm text-gray-600">
              {card.description}
            </p>
          </div>
        )}

        {/* Extended details for full view */}
        {showFullDetails && (
          <CardExtendedDetails
            officialText={card.officialText}
            keywords={card.keywords}
            set={card.set}
            setNumber={card.setNumber}
          />
        )}

        {/* Special indicators */}
        <CardSpecialIndicators
          isFoil={card.isFoil}
          isPromo={card.isPromo}
          isAlternate={card.isAlternate}
        />

        {/* Attribution */}
        {showAttribution && (
          <div className="mt-3 border-t border-gray-100 pt-3">
            <GameContentAttribution className="text-xs" />
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (onClick) {
    return (
      <button
        onClick={handleClick}
        className="w-full rounded-lg text-left focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
      >
        {cardContent}
      </button>
    );
  }

  return (
    <Link
      href={`/cards/${card.id}`}
      className="block rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
    >
      {cardContent}
    </Link>
  );
};

export default CardDisplayContent;
