/**
 * useCardList — games, reference data, and the searchable card list
 * for the admin card editor.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  AdminCard,
  AdminGame,
  PaginationData,
  ReferenceData,
} from '../types';
import { fetchCards, fetchGames, fetchReferenceData } from '../api';

const EMPTY_PAGINATION: PaginationData = {
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  hasMore: false,
};

export function useCardList() {
  const [games, setGames] = useState<AdminGame[]>([]);
  const [selectedGameSlug, setSelectedGameSlug] = useState('');
  const [reference, setReference] = useState<ReferenceData | null>(null);
  const [cards, setCards] = useState<AdminCard[]>([]);
  const [pagination, setPagination] =
    useState<PaginationData>(EMPTY_PAGINATION);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const requestSeq = useRef(0);

  // Load games once
  useEffect(() => {
    fetchGames()
      .then((loaded) => {
        setGames(loaded);
        if (loaded.length > 0) setSelectedGameSlug(loaded[0].slug);
      })
      .catch((error) => console.error('Failed to load games:', error));
  }, []);

  // Debounce search input (frequent path — no animation, quick settle)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Reference data per game
  useEffect(() => {
    if (!selectedGameSlug) return;
    setReference(null);
    fetchReferenceData(selectedGameSlug)
      .then(setReference)
      .catch((error) => console.error('Failed to load reference data:', error));
  }, [selectedGameSlug]);

  const loadPage = useCallback(
    async (page: number, append: boolean) => {
      if (!selectedGameSlug) return;
      const seq = ++requestSeq.current;
      setIsLoading(true);
      try {
        const result = await fetchCards(
          selectedGameSlug,
          debouncedSearch,
          page
        );
        if (seq !== requestSeq.current) return; // stale response
        setCards((prev) =>
          append ? [...prev, ...result.cards] : result.cards
        );
        setPagination(result.pagination);
      } catch (error) {
        console.error('Failed to load cards:', error);
      } finally {
        if (seq === requestSeq.current) setIsLoading(false);
      }
    },
    [selectedGameSlug, debouncedSearch]
  );

  // Reload list when game or search changes
  useEffect(() => {
    setCards([]);
    setPagination(EMPTY_PAGINATION);
    loadPage(1, false);
  }, [loadPage]);

  const loadMore = useCallback(() => {
    if (pagination.hasMore && !isLoading) {
      loadPage(pagination.currentPage + 1, true);
    }
  }, [pagination, isLoading, loadPage]);

  const refresh = useCallback(() => loadPage(1, false), [loadPage]);

  const selectedGame = games.find((g) => g.slug === selectedGameSlug) ?? null;

  return {
    games,
    selectedGame,
    selectedGameSlug,
    setSelectedGameSlug,
    reference,
    cards,
    setCards,
    pagination,
    search,
    setSearch,
    isLoading,
    loadMore,
    refresh,
  };
}
