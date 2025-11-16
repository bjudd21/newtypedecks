/**
 * Utility functions for DeckAnalyticsDisplay
 */

export const getRatingColor = (rating: number): string => {
  if (rating >= 80) return 'text-green-600 bg-green-100';
  if (rating >= 60) return 'text-yellow-600 bg-yellow-100';
  return 'text-red-600 bg-red-100';
};

export const severityColors = {
  minor: 'border-yellow-200 bg-yellow-50',
  moderate: 'border-orange-200 bg-orange-50',
  critical: 'border-red-200 bg-red-50',
} as const;

export const severityIcons = {
  minor: '⚠️',
  moderate: '⚡',
  critical: '🚨',
} as const;
