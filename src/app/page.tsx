'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/cards?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1625] via-[#2a1f3d] to-[#1a1625]">
      {/* Hero Section */}
      <section className="relative flex min-h-[75vh] items-center justify-center px-4 py-20">
        <div className="mx-auto w-full max-w-4xl text-center">
          {/* Hero Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="mb-4 bg-gradient-to-r from-[#8b7aaa] via-[#a89ec7] to-[#8b7aaa] bg-clip-text text-5xl font-bold text-transparent text-white md:text-6xl lg:text-7xl">
              Build Your Ultimate
              <br />
              Gundam Deck
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-400 md:text-xl">
              Browse thousands of cards, craft powerful decks, and dominate the
              battlefield with the most comprehensive Gundam Card Game platform.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            onSubmit={handleSearch}
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="group relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#8b7aaa]">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for cards..."
                className="w-full rounded-xl border-2 border-[#443a5c] bg-[#2d2640] py-5 pl-14 pr-4 text-lg text-white placeholder-gray-500 shadow-lg transition-all hover:shadow-[#8b7aaa]/10 focus:border-[#8b7aaa] focus:outline-none focus:ring-4 focus:ring-[#8b7aaa]/20"
              />
            </div>
          </motion.form>

          {/* Quick Action Buttons */}
          <motion.div
            className="mb-12 flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/cards">
              <Button
                variant="secondary"
                size="md"
                className="border-[#443a5c] bg-[#2d2640] text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#3a3050] hover:shadow-[#8b7aaa]/20"
              >
                🔍 Advanced Search
              </Button>
            </Link>
            <Link href="/decks">
              <Button
                variant="secondary"
                size="md"
                className="border-[#443a5c] bg-[#2d2640] text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#3a3050] hover:shadow-[#8b7aaa]/20"
              >
                🎴 Deck Builder
              </Button>
            </Link>
            <Link href="/cards?view=sets">
              <Button
                variant="secondary"
                size="md"
                className="border-[#443a5c] bg-[#2d2640] text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#3a3050] hover:shadow-[#8b7aaa]/20"
              >
                📚 All Sets
              </Button>
            </Link>
            <Link href="/cards/random">
              <Button
                variant="secondary"
                size="md"
                className="border-[#443a5c] bg-[#2d2640] text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#3a3050] hover:shadow-[#8b7aaa]/20"
              >
                🎲 Random Card
              </Button>
            </Link>
          </motion.div>

          {/* News Items */}
          <motion.div
            className="flex flex-col items-center gap-3 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 rounded-full border border-[#443a5c] bg-[#2d2640]/50 px-4 py-2 transition-colors hover:border-[#8b7aaa]">
              <Badge className="bg-gradient-to-r from-orange-600 to-red-600 px-3 py-1 text-xs font-semibold text-white">
                NEW
              </Badge>
              <span className="font-medium text-gray-300">
                Latest Booster Set Available
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-[#443a5c] bg-[#2d2640]/50 px-4 py-2 transition-colors hover:border-[#8b7aaa]">
              <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-1 text-xs font-semibold text-white">
                NEW
              </Badge>
              <span className="font-medium text-gray-300">
                Starter Decks Released
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-[#443a5c] bg-[#2d2640]/50 px-4 py-2 transition-colors hover:border-[#8b7aaa]">
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 text-xs font-semibold text-white">
                LIVE
              </Badge>
              <span className="font-medium text-gray-300">
                Tournament Season 2025
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recent Decks Section */}
      <section className="mt-8 border-t border-[#2d2640] px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 flex items-center justify-between"
          >
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Recent Decks
            </h2>
            <Link
              href="/decks"
              className="group flex items-center gap-1 text-sm font-medium text-[#8b7aaa] transition-colors hover:text-[#a89ec7] md:text-base"
            >
              View all
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
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
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((deck, index) => (
              <Link key={deck} href={`/decks/${deck}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="group"
                >
                  <Card className="cursor-pointer overflow-hidden border-[#443a5c] bg-[#2d2640] transition-all duration-300 hover:border-[#8b7aaa] hover:shadow-lg hover:shadow-[#8b7aaa]/20">
                    <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-[#3a3050] to-[#2d2640]">
                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#8b7aaa]/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>

                      <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <div className="mb-2 text-4xl transition-transform duration-300 group-hover:scale-110">
                            🤖
                          </div>
                          <div className="text-xs text-gray-400">
                            Deck {deck}
                          </div>
                        </div>
                      </div>

                      {/* Badge for featured/new */}
                      {deck === 1 && (
                        <div className="absolute left-2 top-2">
                          <Badge className="bg-gradient-to-r from-orange-600 to-red-600 px-2 py-1 text-xs text-white">
                            HOT
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <h3 className="mb-2 truncate text-sm font-semibold text-white transition-colors group-hover:text-[#a89ec7]">
                        Sample Deck Name
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          <span>5</span>
                        </div>
                        <span>2d ago</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Empty State (shown when no decks) */}
          {false && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-16 text-center"
            >
              <div className="mb-4 text-6xl">📋</div>
              <h3 className="mb-2 text-xl font-bold text-white">
                No Decks Yet
              </h3>
              <p className="mb-6 text-gray-400">
                Be the first to create and share a deck!
              </p>
              <Link href="/decks">
                <Button className="bg-gradient-to-r from-[#8b7aaa] to-[#6b5a8a] text-white hover:from-[#a89ec7] hover:to-[#8b7aaa]">
                  Create Your First Deck
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2d2640] bg-[#0f0d15] px-4 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#8b7aaa]">
                CARDS
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/cards"
                    className="group inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-[#a89ec7]"
                  >
                    <span className="transition-transform group-hover:translate-x-1">
                      Advanced Search
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cards?view=sets"
                    className="group inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-[#a89ec7]"
                  >
                    <span className="transition-transform group-hover:translate-x-1">
                      Browse Sets
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#8b7aaa]">
                TOOLS
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/decks"
                    className="group inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-[#a89ec7]"
                  >
                    <span className="transition-transform group-hover:translate-x-1">
                      Deck Builder
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collection"
                    className="group inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-[#a89ec7]"
                  >
                    <span className="transition-transform group-hover:translate-x-1">
                      Collection
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#8b7aaa]">
                DEVELOPERS
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/api"
                    className="group inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-[#a89ec7]"
                  >
                    <span className="transition-transform group-hover:translate-x-1">
                      API Documentation
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#8b7aaa]">
                COMMUNITY
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/help"
                    className="group inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-[#a89ec7]"
                  >
                    <span className="transition-transform group-hover:translate-x-1">
                      Help Center
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#2d2640] pt-8 text-center">
            <p className="mb-2 text-xs text-gray-600">
              © {new Date().getFullYear()} Newtype Decks. Not affiliated with
              Bandai Namco Entertainment.
            </p>
            <p className="text-xs text-gray-700">
              Made with ❤️ for the Gundam Card Game community
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
