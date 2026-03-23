'use client';
/**
 * Event handlers for admin games page
 */

import { useCallback, useEffect } from 'react';
import { loadGames, createGame, updateGame, toggleGameActive } from '../api';
import { EMPTY_GAME_FORM, type AdminGame, type GameFormData } from '../types';

interface UseGamesPageHandlersOptions {
  setGames: (games: AdminGame[]) => void;
  setIsLoading: (v: boolean) => void;
  setError: (v: string | null) => void;
  setIsModalOpen: (v: boolean) => void;
  setEditingGame: (g: AdminGame | null) => void;
  setFormData: (d: GameFormData) => void;
  setFormError: (v: string | null) => void;
  setIsSaving: (v: boolean) => void;
  editingGame: AdminGame | null;
  formData: GameFormData;
}

export function useGamesPageHandlers({
  setGames,
  setIsLoading,
  setError,
  setIsModalOpen,
  setEditingGame,
  setFormData,
  setFormError,
  setIsSaving,
  editingGame,
  formData,
}: UseGamesPageHandlersOptions) {
  const fetchGames = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const games = await loadGames();
      setGames(games);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load games');
    } finally {
      setIsLoading(false);
    }
  }, [setGames, setIsLoading, setError]);

  // Load on mount
  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const handleAddClick = useCallback(() => {
    setEditingGame(null);
    setFormData(EMPTY_GAME_FORM);
    setFormError(null);
    setIsModalOpen(true);
  }, [setEditingGame, setFormData, setFormError, setIsModalOpen]);

  const handleEditClick = useCallback(
    (game: AdminGame) => {
      setEditingGame(game);
      setFormData({
        slug: game.slug,
        name: game.name,
        shortName: game.shortName || '',
        publisher: game.publisher || '',
        isActive: game.isActive,
        sortOrder: game.sortOrder,
        configJson: JSON.stringify(game.config, null, 2),
      });
      setFormError(null);
      setIsModalOpen(true);
    },
    [setEditingGame, setFormData, setFormError, setIsModalOpen]
  );

  const handleToggleActive = useCallback(
    async (game: AdminGame) => {
      try {
        await toggleGameActive(game.id, !game.isActive);
        setGames(
          await loadGames() // reload to get fresh counts
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update game');
      }
    },
    [setGames, setError]
  );

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setEditingGame(null);
    setFormError(null);
  }, [setIsModalOpen, setEditingGame, setFormError]);

  const handleSubmit = useCallback(async () => {
    // Validate JSON
    try {
      JSON.parse(formData.configJson);
    } catch {
      setFormError('Config JSON is invalid — please fix syntax errors');
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      if (editingGame) {
        await updateGame(editingGame.id, formData);
      } else {
        await createGame(formData);
      }
      setIsModalOpen(false);
      setEditingGame(null);
      setGames(await loadGames());
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save game');
    } finally {
      setIsSaving(false);
    }
  }, [
    editingGame,
    formData,
    setGames,
    setIsModalOpen,
    setEditingGame,
    setFormError,
    setIsSaving,
  ]);

  return {
    fetchGames,
    handleAddClick,
    handleEditClick,
    handleToggleActive,
    handleModalClose,
    handleSubmit,
  };
}
