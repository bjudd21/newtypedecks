'use client';
/**
 * State management for the proxy sheet — persisted to localStorage per game
 */

import { useState, useEffect, useCallback } from 'react';
import type { CardWithRelations } from '@/lib/types/card';
import { MAX_PROXY_QUANTITY, type ProxyEntry } from '../types';

function storageKey(gameSlug: string) {
  return `proxies_${gameSlug}`;
}

export function useProxyState(gameSlug: string) {
  const [proxyEntries, setProxyEntries] = useState<ProxyEntry[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey(gameSlug));
      if (saved) {
        const parsed = JSON.parse(saved) as ProxyEntry[];
        if (Array.isArray(parsed)) setProxyEntries(parsed);
      }
    } catch {
      // ignore parse errors
    }
  }, [gameSlug]);

  // Persist to localStorage whenever entries change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey(gameSlug), JSON.stringify(proxyEntries));
    } catch {
      // ignore storage errors
    }
  }, [proxyEntries, gameSlug]);

  const addCard = useCallback((card: CardWithRelations) => {
    setProxyEntries((prev) => {
      const existing = prev.find((e) => e.card.id === card.id);
      if (existing) {
        if (existing.quantity >= MAX_PROXY_QUANTITY) return prev;
        return prev.map((e) =>
          e.card.id === card.id ? { ...e, quantity: e.quantity + 1 } : e
        );
      }
      return [...prev, { card, quantity: 1 }];
    });
  }, []);

  const addCardMultiple = useCallback(
    (card: CardWithRelations, qty: number) => {
      setProxyEntries((prev) => {
        const existing = prev.find((e) => e.card.id === card.id);
        if (existing) {
          const newQty = Math.min(existing.quantity + qty, MAX_PROXY_QUANTITY);
          return prev.map((e) =>
            e.card.id === card.id ? { ...e, quantity: newQty } : e
          );
        }
        return [...prev, { card, quantity: Math.min(qty, MAX_PROXY_QUANTITY) }];
      });
    },
    []
  );

  const setQuantity = useCallback((cardId: string, quantity: number) => {
    if (quantity <= 0) {
      setProxyEntries((prev) => prev.filter((e) => e.card.id !== cardId));
    } else {
      setProxyEntries((prev) =>
        prev.map((e) =>
          e.card.id === cardId
            ? { ...e, quantity: Math.min(quantity, MAX_PROXY_QUANTITY) }
            : e
        )
      );
    }
  }, []);

  const removeCard = useCallback((cardId: string) => {
    setProxyEntries((prev) => prev.filter((e) => e.card.id !== cardId));
  }, []);

  const clearSheet = useCallback(() => {
    setProxyEntries([]);
  }, []);

  const totalCards = proxyEntries.reduce((sum, e) => sum + e.quantity, 0);

  return {
    proxyEntries,
    addCard,
    addCardMultiple,
    setQuantity,
    removeCard,
    clearSheet,
    totalCards,
  };
}
