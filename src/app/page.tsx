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
      <section className="relative min-h-[75vh] flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-4xl mx-auto text-center">
          {/* Hero Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 bg-gradient-to-r from-[#8b7aaa] via-[#a89ec7] to-[#8b7aaa] bg-clip-text text-transparent">
              Build Your Ultimate
              <br />
              Gundam Deck
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              Browse thousands of cards, craft powerful decks, and dominate the battlefield with the most comprehensive Gundam Card Game platform.
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
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8b7aaa] transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for cards..."
                className="w-full py-5 pl-14 pr-4 bg-[#2d2640] border-2 border-[#443a5c] rounded-xl text-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#8b7aaa] focus:ring-4 focus:ring-[#8b7aaa]/20 transition-all shadow-lg hover:shadow-[#8b7aaa]/10"
              />
            </div>
          </motion.form>

          {/* Quick Action Buttons */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/cards">
              <Button variant="secondary" size="md" className="bg-[#2d2640] hover:bg-[#3a3050] hover:scale-105 border-[#443a5c] text-white transition-all duration-200 shadow-lg hover:shadow-[#8b7aaa]/20">
                🔍 Advanced Search
              </Button>
            </Link>
            <Link href="/decks">
              <Button variant="secondary" size="md" className="bg-[#2d2640] hover:bg-[#3a3050] hover:scale-105 border-[#443a5c] text-white transition-all duration-200 shadow-lg hover:shadow-[#8b7aaa]/20">
                🎴 Deck Builder
              </Button>
            </Link>
            <Link href="/cards?view=sets">
              <Button variant="secondary" size="md" className="bg-[#2d2640] hover:bg-[#3a3050] hover:scale-105 border-[#443a5c] text-white transition-all duration-200 shadow-lg hover:shadow-[#8b7aaa]/20">
                📚 All Sets
              </Button>
            </Link>
            <Link href="/cards/random">
              <Button variant="secondary" size="md" className="bg-[#2d2640] hover:bg-[#3a3050] hover:scale-105 border-[#443a5c] text-white transition-all duration-200 shadow-lg hover:shadow-[#8b7aaa]/20">
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
            <div className="flex items-center gap-3 bg-[#2d2640]/50 px-4 py-2 rounded-full border border-[#443a5c] hover:border-[#8b7aaa] transition-colors">
              <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold text-xs px-3 py-1">NEW</Badge>
              <span className="text-gray-300 font-medium">Latest Booster Set Available</span>
            </div>
            <div className="flex items-center gap-3 bg-[#2d2640]/50 px-4 py-2 rounded-full border border-[#443a5c] hover:border-[#8b7aaa] transition-colors">
              <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-xs px-3 py-1">NEW</Badge>
              <span className="text-gray-300 font-medium">Starter Decks Released</span>
            </div>
            <div className="flex items-center gap-3 bg-[#2d2640]/50 px-4 py-2 rounded-full border border-[#443a5c] hover:border-[#8b7aaa] transition-colors">
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs px-3 py-1">LIVE</Badge>
              <span className="text-gray-300 font-medium">Tournament Season 2025</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recent Decks Section */}
      <section className="py-16 px-4 border-t border-[#2d2640] mt-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white">Recent Decks</h2>
            <Link href="/decks" className="text-sm md:text-base text-[#8b7aaa] hover:text-[#a89ec7] transition-colors font-medium flex items-center gap-1 group">
              View all
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
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
                  <Card className="bg-[#2d2640] border-[#443a5c] overflow-hidden hover:border-[#8b7aaa] transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-[#8b7aaa]/20">
                    <div className="aspect-[3/4] bg-gradient-to-br from-[#3a3050] to-[#2d2640] relative overflow-hidden">
                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#8b7aaa]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                      <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">🤖</div>
                          <div className="text-xs text-gray-400">Deck {deck}</div>
                        </div>
                      </div>

                      {/* Badge for featured/new */}
                      {deck === 1 && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs px-2 py-1">HOT</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <h3 className="text-sm font-semibold text-white truncate mb-2 group-hover:text-[#a89ec7] transition-colors">Sample Deck Name</h3>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-white mb-2">No Decks Yet</h3>
              <p className="text-gray-400 mb-6">Be the first to create and share a deck!</p>
              <Link href="/decks">
                <Button className="bg-gradient-to-r from-[#8b7aaa] to-[#6b5a8a] hover:from-[#a89ec7] hover:to-[#8b7aaa] text-white">
                  Create Your First Deck
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2d2640] bg-[#0f0d15] py-12 px-4 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xs font-bold text-[#8b7aaa] uppercase mb-4 tracking-wider">CARDS</h3>
              <ul className="space-y-3">
                <li><Link href="/cards" className="text-sm text-gray-500 hover:text-[#a89ec7] transition-colors inline-flex items-center gap-1 group">
                  <span className="group-hover:translate-x-1 transition-transform">Advanced Search</span>
                </Link></li>
                <li><Link href="/cards?view=sets" className="text-sm text-gray-500 hover:text-[#a89ec7] transition-colors inline-flex items-center gap-1 group">
                  <span className="group-hover:translate-x-1 transition-transform">Browse Sets</span>
                </Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#8b7aaa] uppercase mb-4 tracking-wider">TOOLS</h3>
              <ul className="space-y-3">
                <li><Link href="/decks" className="text-sm text-gray-500 hover:text-[#a89ec7] transition-colors inline-flex items-center gap-1 group">
                  <span className="group-hover:translate-x-1 transition-transform">Deck Builder</span>
                </Link></li>
                <li><Link href="/collection" className="text-sm text-gray-500 hover:text-[#a89ec7] transition-colors inline-flex items-center gap-1 group">
                  <span className="group-hover:translate-x-1 transition-transform">Collection</span>
                </Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#8b7aaa] uppercase mb-4 tracking-wider">DEVELOPERS</h3>
              <ul className="space-y-3">
                <li><Link href="/api" className="text-sm text-gray-500 hover:text-[#a89ec7] transition-colors inline-flex items-center gap-1 group">
                  <span className="group-hover:translate-x-1 transition-transform">API Documentation</span>
                </Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#8b7aaa] uppercase mb-4 tracking-wider">COMMUNITY</h3>
              <ul className="space-y-3">
                <li><Link href="/help" className="text-sm text-gray-500 hover:text-[#a89ec7] transition-colors inline-flex items-center gap-1 group">
                  <span className="group-hover:translate-x-1 transition-transform">Help Center</span>
                </Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[#2d2640] text-center">
            <p className="text-xs text-gray-600 mb-2">© {new Date().getFullYear()} Gundam Deck Builder. Not affiliated with Bandai Namco Entertainment.</p>
            <p className="text-xs text-gray-700">Made with ❤️ for the Gundam Card Game community</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
