'use client';

/**
 * Decks page - Comprehensive deck management interface
 */

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, Button } from '@/components/ui';
import {
  DeckBuilder,
  AnonymousDeckBuilder,
  PublicDeckBrowser,
} from '@/components/deck';
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
      description: isAuthenticated
        ? 'Build and save new decks'
        : 'Build decks (saved locally)',
    },
    {
      id: 'community',
      label: '🌍 Community Decks',
      description: 'Browse public decks',
    },
    ...(isAuthenticated
      ? [
          {
            id: 'my-decks',
            label: '📚 My Decks',
            description: 'Manage saved decks',
          },
        ]
      : []),
  ] as const;

  return (
    <ReduxProvider>
      <div className="min-h-screen bg-gradient-to-b from-[#1a1625] via-[#2a1f3d] to-[#1a1625]">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="mb-2 bg-gradient-to-r from-[#8b7aaa] via-[#a89ec7] to-[#8b7aaa] bg-clip-text text-4xl font-bold text-transparent text-white">
              Deck Management
            </h1>
            <p className="text-gray-400">
              Build, manage, and discover Gundam Card Game decks
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <nav className="flex space-x-2 rounded-xl border border-[#443a5c] bg-[#2d2640] p-2 shadow-lg">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`relative flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#8b7aaa] to-[#6b5a8a] text-white shadow-lg shadow-[#8b7aaa]/30'
                      : 'text-gray-400 hover:bg-[#3a3050] hover:text-white'
                  } `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div>
                    <div className="font-semibold">{tab.label}</div>
                    <div
                      className={`mt-1 text-xs ${activeTab === tab.id ? 'text-gray-200' : 'text-gray-500'}`}
                    >
                      {tab.description}
                    </div>
                  </div>
                </motion.button>
              ))}
            </nav>
          </motion.div>

          {/* Tab Content */}
          <Suspense
            fallback={
              <motion.div
                className="py-16 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="relative mx-auto mb-6">
                  <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-[#443a5c] border-t-[#8b7aaa]"></div>
                  <div className="absolute inset-0 rounded-full bg-[#8b7aaa]/10 blur-xl"></div>
                </div>
                <p className="text-lg text-gray-400">Loading deck builder...</p>
              </motion.div>
            }
          >
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {activeTab === 'builder' &&
                (isAuthenticated ? <DeckBuilder /> : <AnonymousDeckBuilder />)}

              {activeTab === 'community' && <PublicDeckBrowser />}

              {activeTab === 'my-decks' && isAuthenticated && (
                <MyDecksManager />
              )}
            </motion.div>
          </Suspense>
        </div>
      </div>
    </ReduxProvider>
  );
}

// Simple My Decks component (placeholder for now)
function MyDecksManager() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-[#443a5c] bg-[#2d2640]">
        <CardContent className="py-16 text-center">
          <motion.div
            className="mb-4 text-6xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            📚
          </motion.div>
          <h3 className="mb-4 text-2xl font-bold text-white">
            Personal Deck Management
          </h3>
          <p className="mb-2 text-gray-400">This feature is coming soon!</p>
          <p className="mx-auto mb-8 max-w-md text-sm text-gray-500">
            For now, use the Deck Builder to create and save decks, and the
            Dashboard to view your saved decks.
          </p>
          <div className="flex justify-center gap-3">
            <Button
              variant="brand"
              onClick={() => (window.location.href = '/decks')}
            >
              Build New Deck
            </Button>
            <Button
              variant="brandOutline"
              onClick={() => (window.location.href = '/dashboard')}
            >
              View Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
