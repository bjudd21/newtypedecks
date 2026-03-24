'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { ComparableDeck } from './types';

interface DeckSearchResult {
  id: string;
  name: string;
  userName?: string | null;
  cardCount: number;
  visibility: string;
}

interface DeckPickerProps {
  value: ComparableDeck | null;
  label: string;
  gameSlug: string;
  onChange: (deck: ComparableDeck) => void;
}

export const DeckPicker: React.FC<DeckPickerProps> = ({
  value,
  label,
  gameSlug,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DeckSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  // Search decks — debounced
  const searchDecks = useCallback(
    async (q: string) => {
      setIsLoading(true);
      try {
        const base = new URLSearchParams({ gameSlug, limit: '10' });
        if (q) base.set('search', q);

        // Own decks + public decks from all users in parallel
        const [ownRes, publicRes] = await Promise.allSettled([
          fetch(`/api/decks?${base}`),
          fetch(`/api/decks?${base}&allUsers=true`),
        ]);

        const ownDecks: DeckSearchResult[] =
          ownRes.status === 'fulfilled' && ownRes.value.ok
            ? ((await ownRes.value.json()).decks ?? [])
            : [];

        const publicDecks: DeckSearchResult[] =
          publicRes.status === 'fulfilled' && publicRes.value.ok
            ? ((await publicRes.value.json()).decks ?? [])
            : [];

        // Merge and deduplicate (own decks first)
        const seen = new Set<string>();
        const merged: DeckSearchResult[] = [];
        for (const deck of [...ownDecks, ...publicDecks]) {
          if (!seen.has(deck.id)) {
            seen.add(deck.id);
            merged.push(deck);
          }
        }
        setResults(merged);
      } finally {
        setIsLoading(false);
      }
    },
    [gameSlug]
  );

  // Debounce search trigger
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => searchDecks(query), 300);
    return () => clearTimeout(timer);
  }, [query, isOpen, searchDecks]);

  const handleSelect = async (result: DeckSearchResult) => {
    setIsOpen(false);
    setQuery('');
    setIsSwapping(true);
    try {
      const res = await fetch(`/api/decks/${result.id}`);
      if (res.ok) {
        const deck = await res.json();
        onChange(deck);
      }
    } finally {
      setIsSwapping(false);
    }
  };

  const totalCards = value?.cards.reduce((s, c) => s + c.quantity, 0) ?? 0;

  return (
    <div ref={containerRef} className="relative min-w-0 flex-1">
      <div className="mb-1 text-xs font-semibold tracking-wide text-gray-400 uppercase">
        {label}
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSwapping}
        className="w-full rounded-lg border border-[#443a5c] bg-[#1a1625]/50 px-3 py-2.5 text-left transition-colors hover:border-[#8b7aaa] disabled:opacity-60"
      >
        {isSwapping ? (
          <span className="text-sm text-gray-400">Loading…</span>
        ) : value ? (
          <div>
            <div className="truncate text-sm font-semibold text-[#a89ec7]">
              {value.name}
            </div>
            <div className="mt-0.5 text-xs text-gray-500">
              {value.user?.name ?? 'You'} · {totalCards} cards ·{' '}
              {value.visibility}
            </div>
          </div>
        ) : (
          <span className="text-sm text-gray-500">Select a deck…</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 rounded-lg border border-[#443a5c] bg-[#1a1625] shadow-xl">
          <div className="p-2">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search deck name…"
              className="w-full rounded border border-[#443a5c] bg-[#2d2640] px-2 py-1.5 text-sm text-[#a89ec7] placeholder-gray-600 outline-none focus:border-[#8b7aaa]"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {isLoading && (
              <div className="py-4 text-center text-xs text-gray-500">
                Searching…
              </div>
            )}
            {!isLoading && results.length === 0 && (
              <div className="py-4 text-center text-xs text-gray-500">
                No decks found
              </div>
            )}
            {!isLoading &&
              results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-[#2d2640]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm text-[#a89ec7]">
                      {result.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {result.userName ?? 'You'} · {result.cardCount} cards ·{' '}
                      {result.visibility}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
