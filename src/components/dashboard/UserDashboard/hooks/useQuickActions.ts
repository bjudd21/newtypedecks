'use client';
/**
 * Hook for generating quick action items
 */

import { useRouter } from 'next/navigation';
import type { QuickAction } from '../types';

export function useQuickActions(): QuickAction[] {
  const router = useRouter();

  return [
    {
      title: 'Build New Deck',
      description: 'Create a new deck with the deck builder',
      icon: '🃏',
      action: () => router.push('/decks/create'),
    },
    {
      title: 'Browse Cards',
      description: 'Explore the complete card database',
      icon: '🔍',
      action: () => router.push('/cards'),
    },
    {
      title: 'My Collection',
      description: 'Manage your card collection',
      icon: '📚',
      action: () => router.push('/collection'),
    },
    {
      title: 'My Decks',
      description: 'View and edit your saved decks',
      icon: '📋',
      action: () => router.push('/decks'),
    },
  ];
}
