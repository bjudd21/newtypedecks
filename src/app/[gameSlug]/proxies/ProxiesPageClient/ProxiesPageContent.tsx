'use client';
/**
 * ProxiesPageContent — main orchestrator for the proxy generator
 *
 * Split layout: card browser (left) + proxy sheet (right)
 * Mobile: stacked vertically
 */

import React from 'react';
import { useParams } from 'next/navigation';
import { useGame } from '@/contexts/GameContext';
import { useProxyState } from './hooks/useProxyState';
import { useProxySearch } from './hooks/useProxySearch';
import { usePDFExport } from './hooks/usePDFExport';
import { ProxySearchPanel } from './ui/ProxySearchPanel';
import { ProxySheetPanel } from './ui/ProxySheetPanel';

export function ProxiesPageContent() {
  const { gameSlug } = useParams<{ gameSlug: string }>();
  const game = useGame();

  const {
    proxyEntries,
    totalCards,
    addCard,
    addCardMultiple,
    setQuantity,
    removeCard,
    clearSheet,
  } = useProxyState(gameSlug);

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    hasSearched,
    currentPage,
    totalPages,
    handleSearch,
    handlePageChange,
  } = useProxySearch();

  const { isExporting, exportProgress, exportPDF } = usePDFExport();

  const handleExport = () => {
    exportPDF(proxyEntries, game.slug);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1625] via-[#2a1f3d] to-[#1a1625]">
      <div className="container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="mb-1 bg-gradient-to-r from-[#8b7aaa] via-[#a89ec7] to-[#8b7aaa] bg-clip-text text-3xl font-bold text-transparent">
            Proxy Generator
          </h1>
          <p className="text-gray-400">
            Build a print-ready proxy sheet for {game.name} cards.
          </p>
        </div>

        {/* Split layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left: card browser */}
          <div className="rounded-xl border border-[#443a5c] bg-[#1e1830] p-4">
            <ProxySearchPanel
              searchQuery={searchQuery}
              searchResults={searchResults}
              isSearching={isSearching}
              hasSearched={hasSearched}
              currentPage={currentPage}
              totalPages={totalPages}
              onSearchQueryChange={setSearchQuery}
              onSearch={handleSearch}
              onAddCard={addCard}
              onAddCardMultiple={addCardMultiple}
              onPageChange={handlePageChange}
            />
          </div>

          {/* Right: proxy sheet */}
          <div className="rounded-xl border border-[#443a5c] bg-[#1e1830] p-4">
            <ProxySheetPanel
              proxyEntries={proxyEntries}
              totalCards={totalCards}
              isExporting={isExporting}
              exportProgress={exportProgress}
              onSetQuantity={setQuantity}
              onRemoveCard={removeCard}
              onClear={clearSheet}
              onExport={handleExport}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
