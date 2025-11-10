'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
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
    if (score >= 90) return 'text-green-300 bg-green-500/20 border border-green-500/30';
    if (score >= 70) return 'text-[#a89ec7] bg-[#8b7aaa]/20 border border-[#8b7aaa]/30';
    if (score >= 50) return 'text-yellow-300 bg-yellow-500/20 border border-yellow-500/30';
    return 'text-red-300 bg-red-500/20 border border-red-500/30';
  };

  // Get severity icon and color
  const getSeverityDisplay = (severity: string) => {
    switch (severity) {
      case 'error':
        return { icon: '🚨', color: 'text-red-300 bg-red-900/20 border-red-500/30' };
      case 'warning':
        return { icon: '⚠️', color: 'text-yellow-300 bg-yellow-900/20 border-yellow-500/30' };
      case 'info':
        return { icon: 'ℹ️', color: 'text-[#a89ec7] bg-[#8b7aaa]/10 border-[#8b7aaa]/30' };
      default:
        return { icon: '📝', color: 'text-gray-400 bg-[#2d2640] border-[#443a5c]' };
    }
  };

  if (cards.length === 0) {
    return (
      <Card className={`${className} bg-[#2d2640] border-[#443a5c]`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#a89ec7] text-base uppercase tracking-wide">
            <span>📋</span>
            Deck Validation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            className="text-center py-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-sm text-gray-400">No cards in deck</div>
            <div className="text-xs mt-1 text-gray-500">Add cards to see validation results</div>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} bg-[#2d2640] border-[#443a5c]`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {validationSummary.isValid ? '✅' : '❌'}
            </motion.span>
            <span className="text-[#a89ec7] text-base uppercase tracking-wide">Deck Validation</span>
          </div>
          <motion.div
            className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(validationSummary.score)}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
          >
            {validationSummary.score}/100
          </motion.div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-[#a89ec7]">{validationSummary.isValid ? 'Valid' : 'Invalid'}</span>
              {validationSummary.errors.length > 0 && (
                <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30">
                  {validationSummary.errors.length} error{validationSummary.errors.length !== 1 ? 's' : ''}
                </Badge>
              )}
              {validationSummary.warnings.length > 0 && (
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  {validationSummary.warnings.length} warning{validationSummary.warnings.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>

          {/* Validation Results */}
          {showDetails && displayResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-[#a89ec7] uppercase tracking-wide">
                {onlyErrors ? 'Errors' : 'Validation Results'}
              </h4>

              {displayResults.map((result, index) => {
                const { icon, color } = getSeverityDisplay(result.rule.severity);

                return (
                  <motion.div
                    key={result.rule.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border rounded-lg p-3 ${color}`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">
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
                        className="text-xs ml-2 bg-[#8b7aaa]/20 text-[#a89ec7] border-[#8b7aaa]/30"
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
              <h4 className="text-sm font-semibold text-[#a89ec7] uppercase tracking-wide">Suggestions</h4>
              <div className="bg-[#1a1625]/50 rounded-lg p-3 border border-[#443a5c]">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="text-sm text-gray-300 py-1 flex items-start gap-2">
                    <span className="text-[#8b7aaa] mt-0.5">💡</span>
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
                <span className="font-semibold ml-1 text-[#a89ec7]">
                  {cards.reduce((sum, card) => sum + card.quantity, 0)}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Unique Cards:</span>
                <span className="font-semibold ml-1 text-[#a89ec7]">{cards.length}</span>
              </div>
            </div>
          </div>

          {/* Tournament Ready Indicator */}
          {validationSummary.isValid && validationSummary.score >= 80 && (
            <motion.div
              className="bg-gradient-to-r from-green-900/20 to-green-800/20 border border-green-500/30 rounded-xl p-4 text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <motion.div
                className="text-green-300 font-bold text-sm mb-1"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                🏆 Tournament Ready!
              </motion.div>
              <div className="text-green-400 text-xs">
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