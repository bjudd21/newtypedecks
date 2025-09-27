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
import { Card, CardContent, CardHeader, CardTitle, Skeleton, Button, Badge } from '@/components/ui';
import type { CardWithRelations } from '@/lib/types/card';

interface CardDetailClientProps {
  cardId: string;
}

export function CardDetailClient({ cardId }: CardDetailClientProps) {
  const [card, setCard] = useState<CardWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rulingsFilter, setRulingsFilter] = useState<'all' | 'official' | 'community'>('all');
  const [rulingsSearch, setRulingsSearch] = useState('');

  // Filter and search rulings
  const filteredRulings = useMemo(() => {
    if (!card?.rulings) return [];

    let filtered = card.rulings;

    // Filter by official/community
    if (rulingsFilter === 'official') {
      filtered = filtered.filter(ruling => ruling.isOfficial);
    } else if (rulingsFilter === 'community') {
      filtered = filtered.filter(ruling => !ruling.isOfficial);
    }

    // Filter by search term
    if (rulingsSearch.trim()) {
      const searchLower = rulingsSearch.toLowerCase();
      filtered = filtered.filter(ruling =>
        ruling.question.toLowerCase().includes(searchLower) ||
        ruling.answer.toLowerCase().includes(searchLower) ||
        (ruling.source && ruling.source.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, [card?.rulings, rulingsFilter, rulingsSearch]);

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
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (cardId) {
      fetchCard();
    }
  }, [cardId]);

  if (isLoading) {
    return <CardDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-8">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-red-900">Error Loading Card</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <div className="mt-4">
                <Link href="/cards">
                  <Button variant="primary">
                    Back to Card Database
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-gray-200">
          <CardContent className="py-8">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Card Not Found</h3>
              <p className="mt-1 text-sm text-gray-600">The requested card could not be found.</p>
              <div className="mt-4">
                <Link href="/cards">
                  <Button variant="primary">
                    Back to Card Database
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb navigation */}
      <nav className="mb-6 text-sm">
        <div className="flex items-center space-x-2 text-gray-500">
          <Link href="/cards" className="hover:text-gray-700">
            Card Database
          </Link>
          <span>›</span>
          <span className="text-gray-900">{card.name}</span>
        </div>
      </nav>

      {/* Card header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{card.name}</h1>
        {card.pilot && (
          <p className="text-xl text-gray-600 mb-1">
            Pilot: {card.pilot}
          </p>
        )}
        {card.model && (
          <p className="text-lg text-gray-500">
            Model: {card.model}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card Image */}
        <div>
          <Card>
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

        {/* Card Details */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Card Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Type and Rarity */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <div className="mt-1">
                    {card.type ? (
                      <Badge variant="secondary">{card.type.name}</Badge>
                    ) : (
                      <span className="text-gray-500">Unknown</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Rarity</label>
                  <div className="mt-1">
                    {card.rarity ? (
                      <Badge variant="info">{card.rarity.name}</Badge>
                    ) : (
                      <span className="text-gray-500">Unknown</span>
                    )}
                  </div>
                </div>

                {/* Level and Cost */}
                {(card.level !== null && card.level !== undefined) && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Level</label>
                    <div className="mt-1">
                      <Badge variant="info">Level {card.level}</Badge>
                    </div>
                  </div>
                )}

                {(card.cost !== null && card.cost !== undefined) && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Cost</label>
                    <div className="mt-1">
                      <Badge variant="info">Cost {card.cost}</Badge>
                    </div>
                  </div>
                )}

                {/* Combat Stats */}
                {(card.clashPoints !== null && card.clashPoints !== undefined) && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Clash Points</label>
                    <div className="mt-1 text-gray-900">{card.clashPoints}</div>
                  </div>
                )}

                {(card.hitPoints !== null && card.hitPoints !== undefined) && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Hit Points</label>
                    <div className="mt-1 text-gray-900">{card.hitPoints}</div>
                  </div>
                )}

                {(card.attackPoints !== null && card.attackPoints !== undefined) && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Attack Points</label>
                    <div className="mt-1 text-gray-900">{card.attackPoints}</div>
                  </div>
                )}

                {(card.price !== null && card.price !== undefined) && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Price</label>
                    <div className="mt-1 text-gray-900">{card.price}</div>
                  </div>
                )}

                {/* Faction and Series */}
                {card.faction && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Faction</label>
                    <div className="mt-1 text-gray-900">{card.faction}</div>
                  </div>
                )}

                {card.series && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Series</label>
                    <div className="mt-1 text-gray-900">{card.series}</div>
                  </div>
                )}

                {card.nation && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nation</label>
                    <div className="mt-1 text-gray-900">{card.nation}</div>
                  </div>
                )}

                {/* Set Information */}
                {card.set && (
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Set</label>
                    <div className="mt-1 text-gray-900">
                      {card.set.name} #{card.setNumber}
                    </div>
                  </div>
                )}
              </div>

              {/* Special indicators */}
              <div className="mt-4 flex gap-2">
                {card.isFoil && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Foil
                  </Badge>
                )}
                {card.isPromo && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    Promo
                  </Badge>
                )}
                {card.isAlternate && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Alt Art
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {card.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{card.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Official Text */}
          {card.officialText && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Official Text
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 border-l-4 border-blue-400 p-4 rounded-r-md">
                  <div className="text-gray-800 leading-relaxed whitespace-pre-line font-mono text-sm">
                    {card.officialText}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Abilities */}
          {card.abilities && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Special Abilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(() => {
                    try {
                      const abilities = JSON.parse(card.abilities);
                      return Array.isArray(abilities) ? abilities.map((ability: any, index: number) => (
                        <div key={index} className="bg-purple-50 border-l-4 border-purple-400 p-3 rounded-r-md">
                          <h4 className="font-semibold text-purple-900 text-sm mb-1">
                            {ability.name || `Ability ${index + 1}`}
                          </h4>
                          <p className="text-purple-800 text-sm leading-relaxed">
                            {ability.description || ability}
                          </p>
                          {ability.cost && (
                            <p className="text-purple-600 text-xs mt-1">
                              Cost: {ability.cost}
                            </p>
                          )}
                        </div>
                      )) : (
                        <div className="bg-purple-50 border-l-4 border-purple-400 p-3 rounded-r-md">
                          <p className="text-purple-800 text-sm leading-relaxed">
                            {typeof abilities === 'string' ? abilities : JSON.stringify(abilities)}
                          </p>
                        </div>
                      );
                    } catch (e) {
                      // If JSON parsing fails, display as plain text
                      return (
                        <div className="bg-purple-50 border-l-4 border-purple-400 p-3 rounded-r-md">
                          <p className="text-purple-800 text-sm leading-relaxed">
                            {card.abilities}
                          </p>
                        </div>
                      );
                    }
                  })()}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Keywords */}
          {card.keywords && card.keywords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {card.keywords.map((keyword, index) => (
                    <Badge key={index} variant="default" className="text-sm">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rulings */}
          {card.rulings && card.rulings.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Rulings & Clarifications
                    <span className="text-sm font-normal text-gray-500">
                      ({filteredRulings.length} of {card.rulings.length})
                    </span>
                  </CardTitle>

                  {/* Filter controls */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={rulingsFilter}
                      onChange={(e) => setRulingsFilter(e.target.value as 'all' | 'official' | 'community')}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Rulings</option>
                      <option value="official">Official Only</option>
                      <option value="community">Community</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Search rulings..."
                      value={rulingsSearch}
                      onChange={(e) => setRulingsSearch(e.target.value)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredRulings.length > 0 ? (
                  <div className="space-y-4">
                    {filteredRulings.map((ruling, index) => (
                      <div
                        key={ruling.id}
                        className={`border-l-4 pl-4 ${ruling.isOfficial ? 'border-green-400 bg-green-50' : 'border-blue-400 bg-blue-50'} p-3 rounded-r-md`}
                      >
                        {/* Ruling header */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge
                            variant={ruling.isOfficial ? "default" : "secondary"}
                            className={`text-xs ${ruling.isOfficial ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
                          >
                            {ruling.isOfficial ? 'Official' : 'Community'}
                          </Badge>

                          {ruling.source && (
                            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                              {ruling.source}
                            </Badge>
                          )}

                          <span className="text-xs text-gray-500 ml-auto">
                            Updated: {new Date(ruling.updatedAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Question */}
                        <div className="mb-3">
                          <h4 className={`font-semibold text-sm mb-1 ${ruling.isOfficial ? 'text-green-900' : 'text-blue-900'}`}>
                            Q: {ruling.question}
                          </h4>
                        </div>

                        {/* Answer */}
                        <div className={`leading-relaxed text-sm ${ruling.isOfficial ? 'text-green-800' : 'text-blue-800'}`}>
                          <strong>A:</strong> {ruling.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No rulings found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {rulingsSearch || rulingsFilter !== 'all' ? 'Try adjusting your filters.' : 'No rulings available for this card.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Card Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Card Metadata
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                {/* Card ID */}
                <div>
                  <label className="font-medium text-gray-700">Card ID</label>
                  <div className="mt-1 text-gray-600 font-mono text-xs break-all">
                    {card.id}
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className="font-medium text-gray-700">Language</label>
                  <div className="mt-1 text-gray-900">
                    {card.language?.toUpperCase() || 'EN'}
                  </div>
                </div>

                {/* Database Info */}
                <div>
                  <label className="font-medium text-gray-700">Last Updated</label>
                  <div className="mt-1 text-gray-600">
                    {new Date(card.updatedAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Card Count Info */}
                {card.keywords && card.keywords.length > 0 && (
                  <div>
                    <label className="font-medium text-gray-700">Keywords Count</label>
                    <div className="mt-1 text-gray-900">
                      {card.keywords.length} keywords
                    </div>
                  </div>
                )}

                {card.tags && card.tags.length > 0 && (
                  <div>
                    <label className="font-medium text-gray-700">Tags Count</label>
                    <div className="mt-1 text-gray-900">
                      {card.tags.length} tags
                    </div>
                  </div>
                )}

                {card.rulings && card.rulings.length > 0 && (
                  <div>
                    <label className="font-medium text-gray-700">Rulings Count</label>
                    <div className="mt-1 text-gray-900">
                      {card.rulings.length} rulings
                    </div>
                  </div>
                )}
              </div>

              {/* Tags Section */}
              {card.tags && card.tags.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {card.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap gap-4">
        <Button
          onClick={() => window.history.back()}
          variant="secondary"
        >
          ← Back
        </Button>

        <Link href="/cards">
          <Button variant="primary">
            Browse More Cards
          </Button>
        </Link>

        {/* Future: Add to deck, Add to collection buttons */}
      </div>
    </div>
  );
}

function CardDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb skeleton */}
      <div className="mb-6">
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Header skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-96 mb-2" />
        <Skeleton className="h-6 w-80 mb-1" />
        <Skeleton className="h-5 w-72" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image skeleton */}
        <div>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="aspect-[3/4] w-full max-w-md mx-auto" />
            </CardContent>
          </Card>
        </div>

        {/* Details skeleton */}
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
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