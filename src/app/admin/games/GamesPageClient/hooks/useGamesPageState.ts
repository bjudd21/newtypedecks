'use client';
/**
 * State management for admin games page
 */

import { useState } from 'react';
import { EMPTY_GAME_FORM, type AdminGame, type GameFormData } from '../types';

export function useGamesPageState() {
  const [games, setGames] = useState<AdminGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<AdminGame | null>(null);
  const [formData, setFormData] = useState<GameFormData>(EMPTY_GAME_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  return {
    games,
    setGames,
    isLoading,
    setIsLoading,
    error,
    setError,
    isModalOpen,
    setIsModalOpen,
    editingGame,
    setEditingGame,
    formData,
    setFormData,
    formError,
    setFormError,
    isSaving,
    setIsSaving,
  };
}
