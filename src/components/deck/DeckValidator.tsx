'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  deckValidator,
  type DeckValidationSummary,
  type ValidationResult,
} from '@/lib/services/deckValidationService';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from '@/components/ui';
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
  onlyErrors = false,
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
        ...validationSummary.info,
      ];
    }

    return results;
  }, [validationSummary, onlyErrors]);

  // Get validation score color
  const getScoreColor = (score: number) => {
    if (score >= 90)
      return 'text-green-300 bg-green-500/20 border border-green-500/30';
    if (score >= 70)
      return 'text-[#a89ec7] bg-[#8b7aaa]/20 border border-[#8b7aaa]/30';
    if (score >= 50)
      return 'text-yellow-300 bg-yellow-500/20 border border-yellow-500/30';
    return 'text-red-300 bg-red-500/20 border border-red-500/30';
  };

  // Get severity icon and color
  const getSeverityDisplay = (severity: string) => {
    switch (severity) {
      case 'error':
        return {
          icon: '🚨',
          color: 'text-red-300 bg-red-900/20 border-red-500/30',
        };
      case 'warning':
        return {
          icon: '⚠️',
          color: 'text-yellow-300 bg-yellow-900/20 border-yellow-500/30',
        };
      case 'info':
        return {
          icon: 'ℹ️',
          color: 'text-[#a89ec7] bg-[#8b7aaa]/10 border-[#8b7aaa]/30',
        };
      default:
        return {
          icon: '📝',
          color: 'text-gray-400 bg-[#2d2640] border-[#443a5c]',
        };
    }
  };

  if (cards.length === 0) {
    return (
      <Card className={`${className} border-[#443a5c] bg-[#2d2640]`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base tracking-wide text-[#a89ec7] uppercase">
            <span>📋</span>
            Deck Validation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            className="py-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-sm text-gray-400">No cards in deck</div>
            <div className="mt-1 text-xs text-gray-500">
              Add cards to see validation results
            </div>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} border-[#443a5c] bg-[#2d2640]`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {validationSummary.isValid ? '✅' : '❌'}
            </motion.span>
            <span className="text-base tracking-wide text-[#a89ec7] uppercase">
              Deck Validation
            </span>
          </div>
          <motion.div
            className={`rounded-full px-3 py-1 text-sm font-bold ${getScoreColor(validationSummary.score)}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              delay: 0.3,
            }}
          >
            {validationSummary.score}/100
          </motion.div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-[#a89ec7]">
                {validationSummary.isValid ? 'Valid' : 'Invalid'}
              </span>
              {validationSummary.errors.length > 0 && (
                <Badge
                  variant="secondary"
                  className="border-red-500/30 bg-red-500/20 text-red-300"
                >
                  {validationSummary.errors.length} error
                  {validationSummary.errors.length !== 1 ? 's' : ''}
                </Badge>
              )}
              {validationSummary.warnings.length > 0 && (
                <Badge
                  variant="secondary"
                  className="border-yellow-500/30 bg-yellow-500/20 text-yellow-300"
                >
                  {validationSummary.warnings.length} warning
                  {validationSummary.warnings.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>

          {/* Validation Results */}
          {showDetails && displayResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold tracking-wide text-[#a89ec7] uppercase">
                {onlyErrors ? 'Errors' : 'Validation Results'}
              </h4>

              {displayResults.map((result, index) => {
                const { icon, color } = getSeverityDisplay(
                  result.rule.severity
                );

                return (
                  <motion.div
                    key={result.rule.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`rounded-lg border p-3 ${color}`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold">
                          {result.rule.name}
                        </div>
                        <div className="mt-1 text-sm">{result.message}</div>
                        {result.details && (
                          <div className="mt-2 text-xs opacity-75">
                            {result.details}
                          </div>
                        )}
                      </div>
                      <Badge
                        variant="secondary"
                        className="ml-2 border-[#8b7aaa]/30 bg-[#8b7aaa]/20 text-xs text-[#a89ec7]"
                      >
                        {result.rule.category}
                      </Badge>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Suggestions */}
          {showDetails && suggestions.length > 0 && (
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="text-sm font-semibold tracking-wide text-[#a89ec7] uppercase">
                Suggestions
              </h4>
              <div className="rounded-lg border border-[#443a5c] bg-[#1a1625]/50 p-3">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 py-1 text-sm text-gray-300"
                  >
                    <span className="mt-0.5 text-[#8b7aaa]">💡</span>
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Quick Stats */}
          <div className="border-t border-[#443a5c] pt-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-400">Total Cards:</span>
                <span className="ml-1 font-semibold text-[#a89ec7]">
                  {cards.reduce((sum, card) => sum + card.quantity, 0)}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Unique Cards:</span>
                <span className="ml-1 font-semibold text-[#a89ec7]">
                  {cards.length}
                </span>
              </div>
            </div>
          </div>

          {/* Tournament Ready Indicator */}
          {validationSummary.isValid && validationSummary.score >= 80 && (
            <motion.div
              className="rounded-xl border border-green-500/30 bg-gradient-to-r from-green-900/20 to-green-800/20 p-4 text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <motion.div
                className="mb-1 text-sm font-bold text-green-300"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                🏆 Tournament Ready!
              </motion.div>
              <div className="text-xs text-green-400">
                Your deck meets all major requirements for competitive play
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeckValidator;
