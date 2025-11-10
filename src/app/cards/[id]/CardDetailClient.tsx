/**
 * CardDetailClient - Client-side component for individual card details
 *
 * This component fetches and displays detailed information about a specific card,
 * including high-resolution images and comprehensive card data.
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { CardImage } from '@/components/card';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  Button,
  Badge,
} from '@/components/ui';
import type { CardWithRelations } from '@/lib/types/card';

interface CardDetailClientProps {
  cardId: string;
}

// Utility function to parse abilities
function parseAbilities(abilities: string) {
  try {
    const parsed = JSON.parse(abilities);
    return Array.isArray(parsed)
      ? parsed.map((ability: unknown, index: number) => {
          const abilityObj = ability as Record<string, unknown>;
          return {
            name: (abilityObj.name as string) || `Ability ${index + 1}`,
            description:
              (abilityObj.description as string) || String(ability),
            cost: abilityObj.cost != null ? String(abilityObj.cost) : null,
          };
        })
      : [
          {
            name: 'Ability',
            description:
              typeof parsed === 'string' ? parsed : JSON.stringify(parsed),
            cost: null,
          },
        ];
  } catch {
    return [{ name: 'Ability', description: abilities, cost: null }];
  }
}

// Error state component
function ErrorState({ error }: { error: string }) {
  return (
    <div className="mx-auto max-w-4xl">
      <Card className="border-red-800 bg-red-900/20">
        <CardContent className="py-8">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-red-300">
              Error Loading Card
            </h3>
            <p className="mt-1 text-sm text-red-400">{error}</p>
            <div className="mt-4">
              <Link href="/cards">
                <Button variant="cyber">Back to Card Database</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Not found state component
function NotFoundState() {
  return (
    <div className="mx-auto max-w-4xl">
      <Card className="border-gray-700 bg-gray-800">
        <CardContent className="py-8">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-white">
              Card Not Found
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              The requested card could not be found.
            </p>
            <div className="mt-4">
              <Link href="/cards">
                <Button variant="cyber">Back to Card Database</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Breadcrumb navigation component
function CardBreadcrumb({ cardName }: { cardName: string }) {
  return (
    <nav className="mb-6 text-sm">
      <div className="flex items-center space-x-2 text-gray-400">
        <Link href="/cards" className="transition-colors hover:text-cyan-400">
          Card Database
        </Link>
        <span>›</span>
        <span className="text-white">{cardName}</span>
      </div>
    </nav>
  );
}

// Card header with name, pilot, and model
function CardHeaderInfo({ card }: { card: CardWithRelations }) {
  return (
    <div className="mb-8">
      <h1 className="mb-2 text-4xl font-bold text-white">{card.name}</h1>
      {card.pilot && (
        <p className="mb-1 text-xl text-gray-300">Pilot: {card.pilot}</p>
      )}
      {card.model && (
        <p className="text-lg text-gray-400">Model: {card.model}</p>
      )}
    </div>
  );
}

// Card image section
function CardImageSection({ card }: { card: CardWithRelations }) {
  return (
    <div>
      <Card className="border-gray-700 bg-gray-800">
        <CardContent className="p-6">
          <CardImage
            name={card.name}
            imageUrl={card.imageUrl || undefined}
            imageUrlSmall={card.imageUrlSmall || undefined}
            imageUrlLarge={card.imageUrlLarge || undefined}
            size="fullsize"
            clickToZoom={true}
            priority={true}
            className="mx-auto"
          />
        </CardContent>
      </Card>
    </div>
  );
}

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

// Basic information section
function BasicInformation({ card }: { card: CardWithRelations }) {
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

// Description section
function CardDescription({ description }: { description: string }) {
  return (
    <Card className="border-gray-700 bg-gray-800">
      <CardHeader>
        <CardTitle>Description</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="leading-relaxed text-gray-300">{description}</p>
      </CardContent>
    </Card>
  );
}

// Official text section
function OfficialText({ text }: { text: string }) {
  return (
    <Card className="border-gray-700 bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Official Text
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-r-md border-l-4 border-blue-400 bg-blue-900/20 p-4">
          <div className="whitespace-pre-line font-mono text-sm leading-relaxed text-gray-200">
            {text}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Special abilities section
function SpecialAbilities({ abilities }: { abilities: string }) {
  const parsedAbilities = parseAbilities(abilities);

  return (
    <Card className="border-gray-700 bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Special Abilities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {parsedAbilities.map((ability, index) => (
            <div
              key={index}
              className="rounded-r-md border-l-4 border-purple-400 bg-purple-900/20 p-3"
            >
              <h4 className="mb-1 text-sm font-semibold text-purple-900">
                {ability.name}
              </h4>
              <p className="text-sm leading-relaxed text-purple-800">
                {ability.description}
              </p>
              {ability.cost && (
                <p className="mt-1 text-xs text-purple-600">
                  Cost: {ability.cost}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Keywords section
function Keywords({ keywords }: { keywords: string[] }) {
  return (
    <Card className="border-gray-700 bg-gray-800">
      <CardHeader>
        <CardTitle>Keywords</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <Badge key={index} variant="default" className="text-sm">
              {keyword}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Rulings filter controls
function RulingsFilterControls({
  filter,
  search,
  onFilterChange,
  onSearchChange,
  totalCount,
  filteredCount,
}: {
  filter: 'all' | 'official' | 'community';
  search: string;
  onFilterChange: (value: 'all' | 'official' | 'community') => void;
  onSearchChange: (value: string) => void;
  totalCount: number;
  filteredCount: number;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <CardTitle className="flex items-center gap-2">
        <svg
          className="h-5 w-5 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Rulings & Clarifications
        <span className="text-sm font-normal text-gray-400">
          ({filteredCount} of {totalCount})
        </span>
      </CardTitle>

      <div className="flex flex-col gap-2 sm:flex-row">
        <select
          value={filter}
          onChange={(e) =>
            onFilterChange(e.target.value as 'all' | 'official' | 'community')
          }
          className="rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-sm text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Rulings</option>
          <option value="official">Official Only</option>
          <option value="community">Community</option>
        </select>

        <input
          type="text"
          placeholder="Search rulings..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-sm text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

// Single ruling item
function RulingItem({
  ruling,
}: {
  ruling: {
    id: string;
    question: string;
    answer: string;
    source: string | null;
    isOfficial: boolean;
    updatedAt: Date;
  };
}) {
  return (
    <div
      className={`border-l-4 pl-4 ${ruling.isOfficial ? 'border-green-400 bg-green-900/20' : 'border-blue-400 bg-blue-900/20'} rounded-r-md p-3`}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge
          variant={ruling.isOfficial ? 'default' : 'secondary'}
          className={`text-xs ${ruling.isOfficial ? 'bg-green-800/30 text-green-800' : 'bg-blue-800/30 text-blue-800'}`}
        >
          {ruling.isOfficial ? 'Official' : 'Community'}
        </Badge>

        {ruling.source && (
          <Badge
            variant="secondary"
            className="bg-gray-700 text-xs text-gray-300"
          >
            {ruling.source}
          </Badge>
        )}

        <span className="ml-auto text-xs text-gray-400">
          Updated: {new Date(ruling.updatedAt).toLocaleDateString()}
        </span>
      </div>

      <div className="mb-3">
        <h4
          className={`mb-1 text-sm font-semibold ${ruling.isOfficial ? 'text-green-900' : 'text-blue-900'}`}
        >
          Q: {ruling.question}
        </h4>
      </div>

      <div
        className={`text-sm leading-relaxed ${ruling.isOfficial ? 'text-green-800' : 'text-blue-800'}`}
      >
        <strong>A:</strong> {ruling.answer}
      </div>
    </div>
  );
}

// Rulings section with filtering
function RulingsSection({
  rulings,
  filter,
  search,
  onFilterChange,
  onSearchChange,
}: {
  rulings: Array<{
    id: string;
    question: string;
    answer: string;
    source: string | null;
    isOfficial: boolean;
    updatedAt: Date;
  }>;
  filter: 'all' | 'official' | 'community';
  search: string;
  onFilterChange: (value: 'all' | 'official' | 'community') => void;
  onSearchChange: (value: string) => void;
}) {
  const filteredRulings = useMemo(() => {
    let filtered = rulings;

    if (filter === 'official') {
      filtered = filtered.filter((ruling) => ruling.isOfficial);
    } else if (filter === 'community') {
      filtered = filtered.filter((ruling) => !ruling.isOfficial);
    }

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (ruling) =>
          ruling.question.toLowerCase().includes(searchLower) ||
          ruling.answer.toLowerCase().includes(searchLower) ||
          (ruling.source && ruling.source.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, [rulings, filter, search]);

  return (
    <Card className="border-gray-700 bg-gray-800">
      <CardHeader>
        <RulingsFilterControls
          filter={filter}
          search={search}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          totalCount={rulings.length}
          filteredCount={filteredRulings.length}
        />
      </CardHeader>
      <CardContent>
        {filteredRulings.length > 0 ? (
          <div className="space-y-4">
            {filteredRulings.map((ruling) => (
              <RulingItem key={ruling.id} ruling={ruling} />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-white">
              No rulings found
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              {search || filter !== 'all'
                ? 'Try adjusting your filters.'
                : 'No rulings available for this card.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Card metadata section
function CardMetadataSection({ card }: { card: CardWithRelations }) {
  return (
    <Card className="border-gray-700 bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Card Metadata
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="font-medium text-gray-300">Card ID</label>
            <div className="mt-1 break-all font-mono text-xs text-gray-400">
              {card.id}
            </div>
          </div>

          <div>
            <label className="font-medium text-gray-300">Language</label>
            <div className="mt-1 text-white">
              {card.language?.toUpperCase() || 'EN'}
            </div>
          </div>

          <div>
            <label className="font-medium text-gray-300">Last Updated</label>
            <div className="mt-1 text-gray-400">
              {new Date(card.updatedAt).toLocaleDateString()}
            </div>
          </div>

          {card.keywords && card.keywords.length > 0 && (
            <div>
              <label className="font-medium text-gray-300">
                Keywords Count
              </label>
              <div className="mt-1 text-white">
                {card.keywords.length} keywords
              </div>
            </div>
          )}

          {card.tags && card.tags.length > 0 && (
            <div>
              <label className="font-medium text-gray-300">Tags Count</label>
              <div className="mt-1 text-white">{card.tags.length} tags</div>
            </div>
          )}

          {card.rulings && card.rulings.length > 0 && (
            <div>
              <label className="font-medium text-gray-300">
                Rulings Count
              </label>
              <div className="mt-1 text-white">
                {card.rulings.length} rulings
              </div>
            </div>
          )}
        </div>

        {card.tags && card.tags.length > 0 && (
          <div className="mt-4 border-t border-gray-700 pt-4">
            <h4 className="mb-2 font-medium text-gray-300">Tags</h4>
            <div className="flex flex-wrap gap-1">
              {card.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-gray-700 text-xs text-gray-300"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Card actions section
function CardActions() {
  return (
    <div className="mt-8 flex flex-wrap gap-4">
      <Button onClick={() => window.history.back()} variant="secondary">
        ← Back
      </Button>

      <Link href="/cards">
        <Button variant="cyber">Browse More Cards</Button>
      </Link>
    </div>
  );
}

export function CardDetailClient({ cardId }: CardDetailClientProps) {
  const [card, setCard] = useState<CardWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

    if (cardId) {
      fetchCard();
    }
  }, [cardId]);

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

function CardDetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl">
      {/* Breadcrumb skeleton */}
      <div className="mb-6">
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Header skeleton */}
      <div className="mb-8">
        <Skeleton className="mb-2 h-10 w-96" />
        <Skeleton className="mb-1 h-6 w-80" />
        <Skeleton className="h-5 w-72" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image skeleton */}
        <div>
          <Card className="border-gray-700 bg-gray-800">
            <CardContent className="p-6">
              <Skeleton className="mx-auto aspect-[3/4] w-full max-w-md" />
            </CardContent>
          </Card>
        </div>

        {/* Details skeleton */}
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border-gray-700 bg-gray-800">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
