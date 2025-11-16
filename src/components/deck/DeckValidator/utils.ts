/**
 * Utility functions for DeckValidator
 */

import type { SeverityDisplay } from './types';

/**
 * Get color classes for validation score
 */
export function getScoreColor(score: number): string {
  if (score >= 90)
    return 'text-green-300 bg-green-500/20 border border-green-500/30';
  if (score >= 70)
    return 'text-[#a89ec7] bg-[#8b7aaa]/20 border border-[#8b7aaa]/30';
  if (score >= 50)
    return 'text-yellow-300 bg-yellow-500/20 border border-yellow-500/30';
  return 'text-red-300 bg-red-500/20 border border-red-500/30';
}

/**
 * Get severity icon and color classes
 */
export function getSeverityDisplay(severity: string): SeverityDisplay {
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
}
