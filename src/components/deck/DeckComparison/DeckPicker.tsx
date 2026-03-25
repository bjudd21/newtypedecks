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
      <div className="text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase">
        {label}
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSwapping}
        className="border-border bg-background/50 hover:border-primary w-full rounded-lg border px-3 py-2.5 text-left transition-colors disabled:opacity-60"
      >
        {isSwapping ? (
          <span className="text-muted-foreground text-sm">Loading…</span>
        ) : value ? (
          <div>
            <div className="text-primary/80 truncate text-sm font-semibold">
              {value.name}
            </div>
            <div className="text-muted-foreground/70 mt-0.5 text-xs">
              {value.user?.name ?? 'You'} · {totalCards} cards ·{' '}
              {value.visibility}
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground/70 text-sm">
            Select a deck…
          </span>
        )}
      </button>

      {isOpen && (
        <div className="border-border bg-background absolute top-full right-0 left-0 z-50 mt-1 rounded-lg border shadow-xl">
          <div className="p-2">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search deck name…"
              className="border-border bg-card text-primary/80 focus:border-primary w-full rounded border px-2 py-1.5 text-sm placeholder-gray-600 outline-none"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {isLoading && (
              <div className="text-muted-foreground/70 py-4 text-center text-xs">
                Searching…
              </div>
            )}
            {!isLoading && results.length === 0 && (
              <div className="text-muted-foreground/70 py-4 text-center text-xs">
                No decks found
              </div>
            )}
            {!isLoading &&
              results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className="hover:bg-card flex w-full items-center gap-2 px-3 py-2 text-left transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-primary/80 truncate text-sm">
                      {result.name}
                    </div>
                    <div className="text-muted-foreground/70 text-xs">
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
