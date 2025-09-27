'use client';

import React, { useMemo } from 'react';
import { deckValidator, type DeckValidationSummary, type ValidationResult } from '@/lib/services/deckValidationService';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
import type { CardWithRelations } from '@/lib/types/card';

interface DeckCard {
  card: CardWithRelations;
  quantity: number;
  category?: string;
}

interface DeckValidatorProps {
  cards: DeckCard[];
  className?: string;
  showDetails?: boolean;
  onlyErrors?: boolean;
}

export const DeckValidator: React.FC<DeckValidatorProps> = ({
  cards,
  className = '',
  showDetails = true,
  onlyErrors = false
}) => {
  // Calculate validation results
  const validationSummary: DeckValidationSummary = useMemo(() => {
    return deckValidator.validateDeck(cards);
  }, [cards]);

  const suggestions = useMemo(() => {
    return deckValidator.getSuggestions(validationSummary);
  }, [validationSummary]);

  // Filter results based on props
  const displayResults = useMemo(() => {
    let results: ValidationResult[] = [];

    if (onlyErrors) {
      results = validationSummary.errors;
    } else {
      results = [
        ...validationSummary.errors,
        ...validationSummary.warnings,
        ...validationSummary.info
      ];
    }

    return results;
  }, [validationSummary, onlyErrors]);

  // Get validation score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // Get severity icon and color
  const getSeverityDisplay = (severity: string) => {
    switch (severity) {
      case 'error':
        return { icon: '🚨', color: 'text-red-600 bg-red-50 border-red-200' };
      case 'warning':
        return { icon: '⚠️', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' };
      case 'info':
        return { icon: 'ℹ️', color: 'text-blue-600 bg-blue-50 border-blue-200' };
      default:
        return { icon: '📝', color: 'text-gray-600 bg-gray-50 border-gray-200' };
    }
  };

  if (cards.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📋</span>
            Deck Validation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-gray-500">
            <div className="text-sm">No cards in deck</div>
            <div className="text-xs mt-1">Add cards to see validation results</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>{validationSummary.isValid ? '✅' : '❌'}</span>
            Deck Validation
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(validationSummary.score)}`}>
            {validationSummary.score}/100
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="font-medium">{validationSummary.isValid ? 'Valid' : 'Invalid'}</span>
              {validationSummary.errors.length > 0 && (
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  {validationSummary.errors.length} error{validationSummary.errors.length !== 1 ? 's' : ''}
                </Badge>
              )}
              {validationSummary.warnings.length > 0 && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                  {validationSummary.warnings.length} warning{validationSummary.warnings.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>

          {/* Validation Results */}
          {showDetails && displayResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">
                {onlyErrors ? 'Errors' : 'Validation Results'}
              </h4>

              {displayResults.map((result) => {
                const { icon, color } = getSeverityDisplay(result.rule.severity);

                return (
                  <div
                    key={result.rule.id}
                    className={`border rounded-lg p-3 ${color}`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">
                          {result.rule.name}
                        </div>
                        <div className="text-sm mt-1">
                          {result.message}
                        </div>
                        {result.details && (
                          <div className="text-xs mt-2 opacity-75">
                            {result.details}
                          </div>
                        )}
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-xs ml-2"
                      >
                        {result.rule.category}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Suggestions */}
          {showDetails && suggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Suggestions</h4>
              <div className="bg-gray-50 rounded-lg p-3">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="text-sm text-gray-700 py-1">
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="border-t pt-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Total Cards:</span>
                <span className="font-medium ml-1">
                  {cards.reduce((sum, card) => sum + card.quantity, 0)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Unique Cards:</span>
                <span className="font-medium ml-1">{cards.length}</span>
              </div>
            </div>
          </div>

          {/* Tournament Ready Indicator */}
          {validationSummary.isValid && validationSummary.score >= 80 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <div className="text-green-700 font-medium text-sm">
                🏆 Tournament Ready!
              </div>
              <div className="text-green-600 text-xs mt-1">
                Your deck meets all major requirements for competitive play
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeckValidator;