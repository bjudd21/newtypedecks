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
      <section className="relative flex items-center justify-center px-4 py-12">
        <div className="mx-auto w-full max-w-5xl text-center">
          {/* Search Bar */}
          <motion.form
            onSubmit={handleSearch}
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="group relative">
              <div className="absolute top-1/2 left-6 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#8b7aaa]">
                <svg
                  className="h-7 w-7"
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
                placeholder="Search decks, cards and users..."
                className="w-full rounded-xl border-2 border-[#443a5c] bg-[#2d2640] py-6 pr-6 pl-16 text-lg text-white placeholder-gray-500 shadow-xl transition-all hover:shadow-[#8b7aaa]/20 focus:border-[#8b7aaa] focus:shadow-lg focus:ring-4 focus:shadow-[#8b7aaa]/30 focus:ring-[#8b7aaa]/20 focus:outline-none"
              />
            </div>
          </motion.form>

          {/* Quick Action Buttons */}
          <motion.div
            className="mb-8 flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              { href: '/cards', icon: '🔍', label: 'ADVANCED SEARCH' },
              { href: '/decks', icon: '🎴', label: 'DECK BUILDER' },
              { href: '/cards?view=sets', icon: '📚', label: 'ALL SETS' },
              { href: '/cards/random', icon: '🎲', label: 'RANDOM CARD' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.3 + index * 0.1,
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                }}
                whileHover={{
                  scale: 1.05,
                  y: -4,
                  transition: { duration: 0.2, type: 'spring', stiffness: 300 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={item.href}>
                  <Button variant="brand" size="md">
                    <span className="inline-block">{item.icon}</span>
                    <span className="ml-2">{item.label}</span>
                  </Button>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* News Items */}
          <motion.div
            className="flex flex-col items-center gap-3 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              {
                badge: 'NEW',
                badgeColors: 'from-orange-600 to-red-600',
                text: 'Latest Booster Set Available',
                glowColor: '[#ff6b35]',
              },
              {
                badge: 'NEW',
                badgeColors: 'from-blue-600 to-cyan-600',
                text: 'Starter Decks Released',
                glowColor: '[#0ea5e9]',
              },
              {
                badge: 'LIVE',
                badgeColors: 'from-purple-600 to-pink-600',
                text: 'Tournament Season 2025',
                glowColor: '[#a855f7]',
              },
            ].map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.5 + index * 0.1,
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                }}
                whileHover={{
                  scale: 1.05,
                  x: 4,
                  transition: { duration: 0.2, type: 'spring', stiffness: 300 },
                }}
                whileTap={{ scale: 0.98 }}
                className="group cursor-pointer"
              >
                <div className="hover:shadow-${item.glowColor}/20 relative flex items-center gap-3 overflow-hidden rounded-full border border-[#443a5c] bg-[#2d2640]/50 px-4 py-2 backdrop-blur-sm transition-all duration-300 hover:border-[#8b7aaa] hover:bg-[#2d2640]/80 hover:shadow-lg">
                  {/* Animated background gradient on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#8b7aaa]/5 via-[#a89ec7]/10 to-[#8b7aaa]/5"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />

                  {/* Animated badge */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.3 }}
                  >
                    <Badge
                      className={`relative bg-gradient-to-r ${item.badgeColors} px-3 py-1 text-xs font-semibold text-white shadow-lg`}
                    >
                      {item.badge === 'LIVE' && (
                        <motion.span
                          className="absolute -top-1 -left-1 h-2 w-2 rounded-full bg-white"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [1, 0.5, 1],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        />
                      )}
                      {item.badge}
                    </Badge>
                  </motion.div>

                  <span className="relative z-10 font-medium text-gray-300 transition-colors group-hover:text-white">
                    {item.text}
                  </span>

                  {/* Chevron icon on hover */}
                  <motion.svg
                    className="relative z-10 h-4 w-4 text-[#8b7aaa]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </motion.svg>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Recent Decks Section */}
      <section className="border-t border-[#2d2640] px-4 py-8">
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
            <Link href="/decks">
              <Button
                variant="link"
                className="group flex items-center gap-1 text-[#8b7aaa] hover:text-[#a89ec7]"
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
              </Button>
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
                        <div className="absolute top-2 left-2">
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
                <Button variant="brand">Create Your First Deck</Button>
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
              <h3 className="mb-4 text-xs font-bold tracking-wider text-[#8b7aaa] uppercase">
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
              <h3 className="mb-4 text-xs font-bold tracking-wider text-[#8b7aaa] uppercase">
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
              <h3 className="mb-4 text-xs font-bold tracking-wider text-[#8b7aaa] uppercase">
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
              <h3 className="mb-4 text-xs font-bold tracking-wider text-[#8b7aaa] uppercase">
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
