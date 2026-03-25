/**
 * Utility functions for DeckTemplateBrowser
 */

export const getSourceBadgeColor = (source?: string): string => {
  switch (source) {
    case 'Official':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Community':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Tournament':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-muted text-gray-600 border-border';
  }
};
