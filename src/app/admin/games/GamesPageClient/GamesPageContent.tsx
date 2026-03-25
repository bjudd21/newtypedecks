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
          <h1 className="text-foreground text-3xl font-bold">
            Game Management
          </h1>
          <p className="text-muted-foreground mt-1">
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
        <div className="text-muted-foreground py-12 text-center">
          Loading games...
        </div>
      ) : (
        <div className="border-border overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-card">
              <tr>
                <th className="text-foreground px-4 py-3 text-left font-medium">
                  Game
                </th>
                <th className="text-foreground px-4 py-3 text-left font-medium">
                  Slug
                </th>
                <th className="text-foreground px-4 py-3 text-left font-medium">
                  Publisher
                </th>
                <th className="text-foreground px-4 py-3 text-right font-medium">
                  Cards
                </th>
                <th className="text-foreground px-4 py-3 text-right font-medium">
                  Decks
                </th>
                <th className="text-foreground px-4 py-3 text-center font-medium">
                  Status
                </th>
                <th className="text-foreground px-4 py-3 text-center font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-border/50 divide-y">
              {games.map((game) => (
                <tr key={game.id} className="hover:bg-card bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="text-foreground font-medium">
                      {game.name}
                    </div>
                    {game.shortName && (
                      <div className="text-muted-foreground/70 text-xs">
                        {game.shortName}
                      </div>
                    )}
                  </td>
                  <td className="text-foreground px-4 py-3 font-mono">
                    {game.slug}
                  </td>
                  <td className="text-muted-foreground px-4 py-3">
                    {game.publisher || '—'}
                  </td>
                  <td className="text-foreground px-4 py-3 text-right">
                    {game.cardCount.toLocaleString()}
                  </td>
                  <td className="text-foreground px-4 py-3 text-right">
                    {game.deckCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleActive(game)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        game.isActive
                          ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                          : 'text-muted-foreground/70 hover:bg-secondary bg-card'
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
                    className="text-muted-foreground/70 px-4 py-12 text-center"
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
          <div className="border-border bg-background w-full max-w-2xl overflow-hidden rounded-xl border shadow-2xl">
            <div className="border-border flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-foreground text-lg font-bold">
                {editingGame ? `Edit — ${editingGame.name}` : 'Add New Game'}
              </h2>
              <button
                onClick={handleModalClose}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[75vh] space-y-4 overflow-y-auto p-6">
              {formError && (
                <div className="rounded border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-muted-foreground mb-1 block text-sm font-medium">
                    Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setField('name', e.target.value)}
                    placeholder="Gundam Card Game"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-sm font-medium">
                    Slug *{' '}
                    <span className="text-muted-foreground/70 text-xs">
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
                  <label className="text-muted-foreground mb-1 block text-sm font-medium">
                    Short Name
                  </label>
                  <Input
                    value={formData.shortName}
                    onChange={(e) => setField('shortName', e.target.value)}
                    placeholder="GCG"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-sm font-medium">
                    Publisher
                  </label>
                  <Input
                    value={formData.publisher}
                    onChange={(e) => setField('publisher', e.target.value)}
                    placeholder="Bandai Namco"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-sm font-medium">
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
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setField('isActive', e.target.checked)}
                      className="border-border bg-card h-4 w-4 rounded"
                    />
                    <span className="text-muted-foreground text-sm font-medium">
                      Active (visible to users)
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                  Config JSON *{' '}
                  <span className="text-muted-foreground/70 text-xs">
                    (GameConfig object)
                  </span>
                </label>
                <textarea
                  value={formData.configJson}
                  onChange={(e) => setField('configJson', e.target.value)}
                  rows={16}
                  className="border-border bg-card focus:border-primary text-foreground w-full rounded-lg border px-3 py-2 font-mono text-xs focus:outline-none"
                  spellCheck={false}
                />
              </div>
            </div>

            <div className="border-border flex justify-end gap-3 border-t px-6 py-4">
              <Button variant="outline" onClick={handleModalClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isSaving}
              >
                {isSaving
                  ? 'Saving...'
                  : editingGame
                    ? 'Save Changes'
                    : 'Create Game'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GamesPageContent;
