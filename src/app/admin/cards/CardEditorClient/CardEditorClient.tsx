/**
 * CardEditorClient — split-pane admin card editor.
 *
 * Left: game selector, search, thumbnail list. Right: full card editor.
 * The form structure is driven by the selected game's GameConfig, so any
 * game added by config + seed gets a correct editor with no code changes.
 */

'use client';

import React, { useCallback, useState } from 'react';
import { validateGameConfig } from '@/lib/types/game';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import type { AdminCard } from './types';
import { useCardList } from './hooks/useCardList';
import { useCardForm } from './hooks/useCardForm';
import { CardListPane } from './ui/CardListPane';
import { CardEditorForm } from './ui/CardEditorForm';

export function CardEditorClient() {
  const list = useCardList();
  const [selected, setSelected] = useState<AdminCard | 'new' | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const config = useValidatedConfig(list.selectedGame);

  const handleSaved = useCallback(
    (card: AdminCard, wasCreate: boolean) => {
      setSelected(card);
      if (wasCreate) {
        list.refresh();
      } else {
        list.setCards((prev) =>
          prev.map((c) => (c.id === card.id ? { ...c, ...card } : c))
        );
      }
    },
    [list]
  );

  const formApi = useCardForm({
    gameSlug: list.selectedGameSlug,
    config,
    selected,
    onSaved: handleSaved,
  });

  const handleGameChange = useCallback(
    (slug: string) => {
      setSelected(null);
      list.setSelectedGameSlug(slug);
    },
    [list]
  );

  const handleDeleted = useCallback(() => {
    setIsDeleteOpen(false);
    setSelected(null);
    list.refresh();
  }, [list]);

  const selectedCard = selected && selected !== 'new' ? selected : null;

  return (
    <div className="space-y-6">
      <PageHeading />

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* List pane */}
        <aside className="border-border bg-background lg:sticky lg:top-4 lg:h-[calc(100dvh-8rem)] lg:w-80 lg:shrink-0 lg:rounded-lg lg:border lg:p-4">
          <CardListPane
            games={list.games}
            selectedGameSlug={list.selectedGameSlug}
            onGameChange={handleGameChange}
            search={list.search}
            onSearchChange={list.setSearch}
            cards={list.cards}
            pagination={list.pagination}
            isLoading={list.isLoading}
            selectedCardId={selectedCard?.id ?? null}
            onSelectCard={setSelected}
            onNewCard={() => setSelected('new')}
            onLoadMore={list.loadMore}
          />
        </aside>

        {/* Editor pane */}
        <main className="min-w-0 flex-1">
          {selected && config && list.reference ? (
            <CardEditorForm
              selected={selected}
              config={config}
              reference={list.reference}
              formApi={formApi}
              onDelete={() => setIsDeleteOpen(true)}
            />
          ) : (
            <EmptyEditorState onNewCard={() => setSelected('new')} />
          )}
        </main>
      </div>

      {selectedCard && (
        <DeleteConfirmModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onSuccess={handleDeleted}
          itemType="card"
          itemName={selectedCard.name}
          _itemId={selectedCard.id}
          apiEndpoint={`/api/cards/${selectedCard.id}?gameSlug=${list.selectedGameSlug}`}
        />
      )}
    </div>
  );
}

function PageHeading() {
  return (
    <div>
      <h1 className="text-foreground text-3xl font-bold">Card Data Admin</h1>
      <p className="text-muted-foreground mt-1">
        Search, edit, and add cards. Fields adapt to the selected game’s schema.
      </p>
    </div>
  );
}

function useValidatedConfig(game: { config: unknown } | null) {
  return React.useMemo(() => {
    if (!game) return null;
    try {
      return validateGameConfig(game.config);
    } catch (error) {
      console.error('Invalid game config:', error);
      return null;
    }
  }, [game]);
}

function EmptyEditorState({ onNewCard }: { onNewCard: () => void }) {
  return (
    <div className="border-border text-muted-foreground flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center text-sm">
      <p>Select a card from the list to edit it,</p>
      <p>
        or{' '}
        <button
          type="button"
          onClick={onNewCard}
          className="text-primary focus-visible:ring-ring rounded underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none"
        >
          create a new card
        </button>
        .
      </p>
    </div>
  );
}

export default CardEditorClient;
