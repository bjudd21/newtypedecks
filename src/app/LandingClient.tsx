'use client';

/**
 * Landing page client component
 *
 * Handles all interactive/animated content on the root landing page.
 * Receives pre-fetched game data as props from the server page.
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import type { GameWithConfig } from '@/lib/types/game';

interface GameWithCounts extends GameWithConfig {
  cardCount: number;
  deckCount: number;
}

interface LandingClientProps {
  games: GameWithCounts[];
}

export function LandingClient({ games }: LandingClientProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1625] via-[#2a1f3d] to-[#1a1625]">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center px-4 py-16">
        <div className="mx-auto w-full max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="mb-4 bg-gradient-to-r from-[#8b7aaa] via-[#a89ec7] to-[#8b7aaa] bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
              Newtype Decks
            </h1>
            <p className="mb-2 text-xl text-gray-300 md:text-2xl">
              Multi-TCG card database, deck builder &amp; collection manager
            </p>
            <p className="text-sm text-gray-500">
              Choose a game below to get started
            </p>
          </motion.div>
        </div>
      </section>

      {/* Game Selector Section */}
      <section className="border-t border-[#2d2640] px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            className="mb-8 text-center text-2xl font-bold text-white"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Supported Games
          </motion.h2>

          {games.length === 0 ? (
            <p className="text-center text-gray-500">
              No games available yet. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {games.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                >
                  <Link href={`/${game.slug}`}>
                    <div
                      className="group flex h-full flex-col rounded-xl border border-[#443a5c] bg-[#2d2640] p-6 transition-all duration-300 hover:border-[#8b7aaa] hover:bg-[#3a3050] hover:shadow-lg hover:shadow-[#8b7aaa]/20"
                      style={
                        game.primaryColor
                          ? ({
                              '--game-color': game.primaryColor,
                            } as React.CSSProperties)
                          : undefined
                      }
                    >
                      {/* Game name + publisher */}
                      <div className="mb-4 flex-1">
                        <h3 className="mb-1 text-xl font-bold text-white transition-colors group-hover:text-[#a89ec7]">
                          {game.name}
                        </h3>
                        {game.publisher && (
                          <p className="text-sm text-gray-400">
                            {game.publisher}
                          </p>
                        )}
                      </div>

                      {/* Stats row */}
                      <div className="flex items-center gap-3">
                        <Badge className="bg-[#443a5c] px-2 py-1 text-xs font-medium text-[#a89ec7]">
                          {game.cardCount.toLocaleString()} cards
                        </Badge>
                        {game.deckCount > 0 && (
                          <Badge className="bg-[#443a5c] px-2 py-1 text-xs font-medium text-[#a89ec7]">
                            {game.deckCount.toLocaleString()} decks
                          </Badge>
                        )}
                      </div>

                      {/* CTA arrow */}
                      <div className="mt-4 flex items-center text-sm font-medium text-[#8b7aaa] transition-all group-hover:gap-2 group-hover:text-[#a89ec7]">
                        <span>Explore</span>
                        <svg
                          className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2d2640] bg-[#0f0d15] px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="border-t border-[#2d2640] pt-8 text-center">
            <p className="mb-2 text-xs text-gray-600">
              &copy; {new Date().getFullYear()} Newtype Decks. Not affiliated
              with any game publisher.
            </p>
            <p className="text-xs text-gray-700">
              Made with &#10084;&#65039; for the TCG community
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
