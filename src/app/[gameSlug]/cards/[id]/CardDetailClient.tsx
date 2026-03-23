/**
 * CardDetailClient - Client-side component for individual card details
 *
 * This component fetches and displays detailed information about a specific card,
 * including high-resolution images and comprehensive card data.
 */

'use client';

import React, { useState, useEffect } from 'react';
import type { CardWithRelations } from '@/lib/types/card';
import { BasicInformation } from './components/BasicInformation';
import { CardMetadataSection } from './components/CardMetadataSection';
import {
  ErrorState,
  NotFoundState,
  CardBreadcrumb,
  CardHeaderInfo,
  CardImageSection,
  CardDescription,
  OfficialText,
  SpecialAbilities,
  Keywords,
  RulingsSection,
  CardActions,
  CardDetailSkeleton,
} from './CardDetailClient/';

interface CardDetailClientProps {
  cardId: string;
  initialCard?: CardWithRelations;
}

export function CardDetailClient({
  cardId,
  initialCard,
}: CardDetailClientProps) {
  const [card, setCard] = useState<CardWithRelations | null>(
    initialCard ?? null
  );
  const [isLoading, setIsLoading] = useState(!initialCard);
  const [error, setError] = useState<string | null>(null);
  const [rulingsFilter, setRulingsFilter] = useState<
    'all' | 'official' | 'community'
  >('all');
  const [rulingsSearch, setRulingsSearch] = useState('');

  useEffect(() => {
    const fetchCard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/cards/${cardId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch card');
        }

        const cardData = await response.json();
        setCard(cardData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (cardId && !initialCard) {
      fetchCard();
    }
  }, [cardId, initialCard]);

  if (isLoading) return <CardDetailSkeleton />;
  if (error) return <ErrorState error={error} />;
  if (!card) return <NotFoundState />;

  return (
    <div className="mx-auto max-w-6xl">
      <CardBreadcrumb cardName={card.name} />
      <CardHeaderInfo card={card} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <CardImageSection card={card} />

        <div className="space-y-6">
          <BasicInformation card={card} />
          {card.description && (
            <CardDescription description={card.description} />
          )}
          {card.officialText && <OfficialText text={card.officialText} />}
          {card.abilities && <SpecialAbilities abilities={card.abilities} />}
          {card.keywords && card.keywords.length > 0 && (
            <Keywords keywords={card.keywords} />
          )}
          {card.rulings && card.rulings.length > 0 && (
            <RulingsSection
              rulings={card.rulings}
              filter={rulingsFilter}
              search={rulingsSearch}
              onFilterChange={setRulingsFilter}
              onSearchChange={setRulingsSearch}
            />
          )}
          <CardMetadataSection card={card} />
        </div>
      </div>

      <CardActions />
    </div>
  );
}
