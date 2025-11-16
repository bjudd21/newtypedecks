/**
 * UserDashboard constants
 */

import type { Stat } from './types';

export const STATS: Stat[] = [
  {
    title: 'Total Decks',
    value: '0', // TODO: Replace with actual data
    icon: '🃏',
    color: 'text-blue-600',
  },
  {
    title: 'Cards Owned',
    value: '0', // TODO: Replace with actual data
    icon: '📚',
    color: 'text-green-600',
  },
  {
    title: 'Collection Value',
    value: '$0', // TODO: Replace with actual data
    icon: '💰',
    color: 'text-purple-600',
  },
  {
    title: 'Favorite Format',
    value: 'Standard', // TODO: Replace with actual data
    icon: '⭐',
    color: 'text-orange-600',
  },
];
