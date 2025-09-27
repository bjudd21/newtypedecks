'use client';

/**
 * Decks page - Comprehensive deck management interface
 */

import { useState, Suspense } from 'react';
import { Card, CardContent, Button } from '@/components/ui';
import { DeckBuilder, AnonymousDeckBuilder, PublicDeckBrowser } from '@/components/deck';
import { useAuth } from '@/hooks';
import { ReduxProvider } from '@/store/Provider';

type TabType = 'builder' | 'community' | 'my-decks';

export default function DecksPage() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('builder');

  const tabs = [
    {
      id: 'builder',
      label: '🃏 Deck Builder',
      description: isAuthenticated ? 'Build and save new decks' : 'Build decks (saved locally)'
    },
    { id: 'community', label: '🌍 Community Decks', description: 'Browse public decks' },
    ...(isAuthenticated ? [{ id: 'my-decks', label: '📚 My Decks', description: 'Manage saved decks' }] : [])
  ] as const;

  return (
    <ReduxProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Deck Management</h1>
          <p className="text-gray-600">
            Build, manage, and discover Gundam Card Game decks
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`
                  flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors
                  ${activeTab === tab.id
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <div>
                  <div>{tab.label}</div>
                  <div className="text-xs text-gray-500">{tab.description}</div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <Suspense fallback={
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        }>
          {activeTab === 'builder' && (
            isAuthenticated ? <DeckBuilder /> : <AnonymousDeckBuilder />
          )}

          {activeTab === 'community' && (
            <PublicDeckBrowser />
          )}

          {activeTab === 'my-decks' && isAuthenticated && (
            <MyDecksManager />
          )}
        </Suspense>
      </div>
    </ReduxProvider>
  );
}

// Simple My Decks component (placeholder for now)
function MyDecksManager() {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <p className="text-gray-600 mb-4">Personal deck management coming soon!</p>
        <p className="text-sm text-gray-500">
          For now, use the Deck Builder to create and save decks, and the Dashboard to view your saved decks.
        </p>
        <div className="mt-6 space-x-3">
          <Button onClick={() => window.location.href = '/decks/builder'}>
            Build New Deck
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
            View Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
