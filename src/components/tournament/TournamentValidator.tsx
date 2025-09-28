'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Select } from '@/components/ui';
import {
  tournamentPrepService,
  type TournamentDeck,
  type TournamentValidation,
  type TournamentFormat
} from '@/lib/services/tournamentPrepService';
import type { DeckCard } from '@/lib/services/deckAnalyticsService';

interface TournamentValidatorProps {
  deck: {
    mainDeck: DeckCard[];
    sideboard?: DeckCard[];
    name: string;
  };
  onValidationChange?: (validation: TournamentValidation) => void;
  className?: string;
}

export const TournamentValidator: React.FC<TournamentValidatorProps> = ({
  deck,
  onValidationChange,
  className
}) => {
  const [selectedFormat, setSelectedFormat] = useState('standard');
  const [validation, setValidation] = useState<TournamentValidation | null>(null);
  const [availableFormats, setAvailableFormats] = useState<TournamentFormat[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    const formats = tournamentPrepService.getAvailableFormats();
    setAvailableFormats(formats);
  }, []);

  useEffect(() => {
    validateDeck();
  }, [deck, selectedFormat]);

  const validateDeck = () => {
    if (!deck.mainDeck.length) return;

    setIsValidating(true);

    const tournamentDeck: TournamentDeck = {
      mainDeck: deck.mainDeck,
      sideboard: deck.sideboard || [],
      name: deck.name,
      format: availableFormats.find(f => f.name.toLowerCase() === selectedFormat) || availableFormats[0]
    };

    const result = tournamentPrepService.validateDeckForTournament(tournamentDeck, selectedFormat);
    setValidation(result);
    onValidationChange?.(result);
    setIsValidating(false);
  };

  const getErrorIcon = (type: string) => {
    switch (type) {
      case 'deck_size': return '📋';
      case 'sideboard_size': return '🔄';
      case 'banned_card': return '🚫';
      case 'restricted_card': return '⚠️';
      case 'max_copies': return '🔢';
      default: return '❌';
    }
  };

  const getWarningIcon = (type: string) => {
    switch (type) {
      case 'suboptimal_size': return '📏';
      case 'weak_synergy': return '🔗';
      case 'high_variance': return '🎲';
      case 'meta_concern': return '📊';
      default: return '⚠️';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tournament Validation</CardTitle>
            <div className="flex items-center gap-2">
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableFormats.map(format => (
                  <option key={format.name.toLowerCase()} value={format.name.toLowerCase()}>
                    {format.name}
                  </option>
                ))}
              </select>
              <Button
                onClick={validateDeck}
                variant="outline"
                size="sm"
                disabled={isValidating}
              >
                {isValidating ? 'Validating...' : 'Re-validate'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isValidating ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Validating deck...</p>
              </div>
            </div>
          ) : !validation ? (
            <div className="text-center py-8 text-gray-600">
              <p>No deck to validate</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Validation Status */}
              <div className={`p-4 rounded-lg border-2 ${
                validation.isValid
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-2xl">
                    {validation.isValid ? '✅' : '❌'}
                  </div>
                  <div>
                    <div className={`font-semibold ${
                      validation.isValid ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {validation.isValid ? 'Tournament Legal' : 'Invalid for Tournament'}
                    </div>
                    <div className={`text-sm ${
                      validation.isValid ? 'text-green-600' : 'text-red-600'
                    }`}>
                      Format: {validation.format.name}
                    </div>
                  </div>
                </div>

                {validation.isValid && (
                  <div className="text-sm text-green-700">
                    This deck is ready for {validation.format.name} tournament play!
                  </div>
                )}
              </div>

              {/* Format Requirements */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <h4 className="font-medium text-blue-900 mb-3">Format Requirements</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-blue-700">Main Deck Size</div>
                      <div className="font-medium text-blue-900">
                        {validation.format.minDeckSize === validation.format.maxDeckSize
                          ? validation.format.minDeckSize
                          : `${validation.format.minDeckSize}-${validation.format.maxDeckSize}`
                        } cards
                      </div>
                    </div>
                    <div>
                      <div className="text-blue-700">Sideboard</div>
                      <div className="font-medium text-blue-900">{validation.format.sideboardSize} cards</div>
                    </div>
                    <div>
                      <div className="text-blue-700">Max Copies</div>
                      <div className="font-medium text-blue-900">{validation.format.maxCopiesPerCard} per card</div>
                    </div>
                    <div>
                      <div className="text-blue-700">Current Size</div>
                      <div className="font-medium text-blue-900">
                        {deck.mainDeck.reduce((sum, card) => sum + card.quantity, 0)} main
                        {deck.sideboard && (
                          <span> + {deck.sideboard.reduce((sum, card) => sum + card.quantity, 0)} side</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Errors */}
              {validation.errors.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-800 mb-3 flex items-center gap-2">
                    ❌ Validation Errors ({validation.errors.length})
                  </h4>
                  <div className="space-y-2">
                    {validation.errors.map((error, index) => (
                      <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <div className="text-lg">{getErrorIcon(error.type)}</div>
                          <div className="flex-1">
                            <div className="font-medium text-red-800">{error.message}</div>
                            {error.cardName && (
                              <div className="text-sm text-red-600 mt-1">
                                Card: {error.cardName}
                                {error.currentValue && error.requiredValue && (
                                  <span className="ml-2">
                                    (Current: {error.currentValue}, Required: {error.requiredValue})
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {validation.warnings.length > 0 && (
                <div>
                  <h4 className="font-medium text-orange-800 mb-3 flex items-center gap-2">
                    ⚠️ Suggestions ({validation.warnings.length})
                  </h4>
                  <div className="space-y-2">
                    {validation.warnings.map((warning, index) => (
                      <div key={index} className={`border rounded-lg p-3 ${getSeverityColor(warning.severity)}`}>
                        <div className="flex items-start gap-2">
                          <div className="text-lg">{getWarningIcon(warning.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="font-medium">{warning.message}</div>
                              <Badge variant="outline" className="text-xs">
                                {warning.severity}
                              </Badge>
                            </div>
                            <div className="text-sm mt-1 opacity-90">
                              {warning.suggestion}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Banned/Restricted Cards Info */}
              {(validation.format.bannedCards.length > 0 || validation.format.restrictedCards.length > 0) && (
                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Format Restrictions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {validation.format.bannedCards.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-red-700 mb-2">
                            🚫 Banned Cards ({validation.format.bannedCards.length})
                          </div>
                          <div className="text-xs text-gray-600">
                            {validation.format.bannedCards.length > 5
                              ? `${validation.format.bannedCards.slice(0, 5).join(', ')} and ${validation.format.bannedCards.length - 5} more`
                              : validation.format.bannedCards.join(', ')
                            }
                          </div>
                        </div>
                      )}
                      {validation.format.restrictedCards.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-orange-700 mb-2">
                            ⚠️ Restricted Cards ({validation.format.restrictedCards.length})
                          </div>
                          <div className="text-xs text-gray-600">
                            Limited quantities for some cards
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Fixes */}
              {!validation.isValid && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    💡 Quick Fixes
                  </h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    {validation.errors.some(e => e.type === 'deck_size') && (
                      <div>• Adjust main deck size to meet format requirements</div>
                    )}
                    {validation.errors.some(e => e.type === 'sideboard_size') && (
                      <div>• Remove excess cards from sideboard</div>
                    )}
                    {validation.errors.some(e => e.type === 'banned_card') && (
                      <div>• Replace banned cards with legal alternatives</div>
                    )}
                    {validation.errors.some(e => e.type === 'max_copies') && (
                      <div>• Reduce quantities of cards exceeding format limits</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TournamentValidator;