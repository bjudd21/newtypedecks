/**
 * GamesPageContent — admin game management orchestrator
 */

'use client';

import React from 'react';
import { Button, Input } from '@/components/ui';
import { useGamesPageState } from './hooks/useGamesPageState';
import { useGamesPageHandlers } from './hooks/useGamesPageHandlers';
import type { GameFormData } from './types';

export function GamesPageContent() {
  const state = useGamesPageState();
  const {
    games,
    isLoading,
    error,
    isModalOpen,
    editingGame,
    formData,
    setFormData,
    formError,
    isSaving,
  } = state;

  const {
    handleAddClick,
    handleEditClick,
    handleToggleActive,
    handleModalClose,
    handleSubmit,
  } = useGamesPageHandlers(state);

  const setField = (key: keyof GameFormData, value: unknown) =>
    setFormData({ ...formData, [key]: value });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Game Management</h1>
          <p className="mt-1 text-gray-400">
            Manage TCG game records and their configurations
          </p>
        </div>
        <Button variant="primary" onClick={handleAddClick}>
          Add Game
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Games Table */}
      {isLoading ? (
        <div className="py-12 text-center text-gray-400">Loading games...</div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[#443a5c]">
          <table className="w-full text-sm">
            <thead className="bg-[#2d2640]">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-300">
                  Game
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-300">
                  Slug
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-300">
                  Publisher
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-300">
                  Cards
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-300">
                  Decks
                </th>
                <th className="px-4 py-3 text-center font-medium text-gray-300">
                  Status
                </th>
                <th className="px-4 py-3 text-center font-medium text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#443a5c]/50">
              {games.map((game) => (
                <tr key={game.id} className="bg-[#1e1a2e] hover:bg-[#2d2640]">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{game.name}</div>
                    {game.shortName && (
                      <div className="text-xs text-gray-500">
                        {game.shortName}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-300">
                    {game.slug}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {game.publisher || '—'}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-300">
                    {game.cardCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-300">
                    {game.deckCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleActive(game)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        game.isActive
                          ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                          : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
                      }`}
                    >
                      {game.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(game)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
              {games.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No games found. Add the first game to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-[#443a5c] bg-[#1a1625] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#443a5c] px-6 py-4">
              <h2 className="text-lg font-bold text-white">
                {editingGame ? `Edit — ${editingGame.name}` : 'Add New Game'}
              </h2>
              <button
                onClick={handleModalClose}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto p-6 space-y-4">
              {formError && (
                <div className="rounded border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-400">
                    Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setField('name', e.target.value)}
                    placeholder="Gundam Card Game"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-400">
                    Slug *{' '}
                    <span className="text-xs text-gray-500">
                      (lowercase, no spaces)
                    </span>
                  </label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setField('slug', e.target.value)}
                    placeholder="gundam"
                    disabled={!!editingGame}
                    className={editingGame ? 'opacity-50' : ''}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-400">
                    Short Name
                  </label>
                  <Input
                    value={formData.shortName}
                    onChange={(e) => setField('shortName', e.target.value)}
                    placeholder="GCG"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-400">
                    Publisher
                  </label>
                  <Input
                    value={formData.publisher}
                    onChange={(e) => setField('publisher', e.target.value)}
                    placeholder="Bandai Namco"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-400">
                    Sort Order
                  </label>
                  <Input
                    type="number"
                    value={formData.sortOrder.toString()}
                    onChange={(e) =>
                      setField('sortOrder', parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setField('isActive', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-600 bg-gray-800"
                    />
                    <span className="text-sm font-medium text-gray-400">
                      Active (visible to users)
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">
                  Config JSON *{' '}
                  <span className="text-xs text-gray-500">
                    (GameConfig object)
                  </span>
                </label>
                <textarea
                  value={formData.configJson}
                  onChange={(e) => setField('configJson', e.target.value)}
                  rows={16}
                  className="w-full rounded-lg border border-[#443a5c] bg-[#2d2640] px-3 py-2 font-mono text-xs text-gray-200 focus:border-[#8b7aaa] focus:outline-none"
                  spellCheck={false}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#443a5c] px-6 py-4">
              <Button variant="outline" onClick={handleModalClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : editingGame ? 'Save Changes' : 'Create Game'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GamesPageContent;
