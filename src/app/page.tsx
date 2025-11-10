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
      <section className="relative min-h-[70vh] flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-3xl mx-auto text-center">
          {/* Search Bar */}
          <motion.form
            onSubmit={handleSearch}
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for cards..."
                className="w-full py-4 pl-12 pr-4 bg-[#2d2640] border border-[#443a5c] rounded-md text-base text-white placeholder-gray-500 focus:outline-none focus:border-[#6b5a8a] focus:ring-2 focus:ring-[#6b5a8a]/30 transition-all"
              />
            </div>
          </motion.form>

          {/* Quick Action Buttons */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/cards">
              <Button variant="secondary" size="sm" className="bg-[#2d2640] hover:bg-[#3a3050] border-[#443a5c] text-white">
                Advanced Search
              </Button>
            </Link>
            <Link href="/decks">
              <Button variant="secondary" size="sm" className="bg-[#2d2640] hover:bg-[#3a3050] border-[#443a5c] text-white">
                Deck Builder
              </Button>
            </Link>
            <Link href="/cards?view=sets">
              <Button variant="secondary" size="sm" className="bg-[#2d2640] hover:bg-[#3a3050] border-[#443a5c] text-white">
                All Sets
              </Button>
            </Link>
            <Link href="/cards/random">
              <Button variant="secondary" size="sm" className="bg-[#2d2640] hover:bg-[#3a3050] border-[#443a5c] text-white">
                Random Card
              </Button>
            </Link>
          </motion.div>

          {/* News Items */}
          <motion.div
            className="flex flex-col items-center gap-2 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-600 text-white font-semibold text-xs">NEW</Badge>
              <span className="text-gray-300">Latest Booster Set Available</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-600 text-white font-semibold text-xs">NEW</Badge>
              <span className="text-gray-300">Starter Decks Released</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-600 text-white font-semibold text-xs">NEW</Badge>
              <span className="text-gray-300">Tournament Season 2025</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recent Decks Section */}
      <section className="py-16 px-4 border-t border-[#2d2640]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-white">Recent Decks</h2>
            <Link href="/decks" className="text-sm text-gray-400 hover:text-white transition-colors">
              View recent decks →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((deck) => (
              <motion.div
                key={deck}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="bg-[#2d2640] border-[#443a5c] overflow-hidden hover:border-[#6b5a8a] transition-colors cursor-pointer">
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-700 to-gray-800 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <div className="text-3xl mb-2">🤖</div>
                        <div className="text-xs">Deck {deck}</div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                      <span>5 views</span>
                      <span>•</span>
                      <span>2 days ago</span>
                    </div>
                    <h3 className="text-sm font-medium text-white truncate">Sample Deck Name</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2d2640] bg-[#0f0d15] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">CARDS</h3>
              <ul className="space-y-2">
                <li><Link href="/cards" className="text-sm text-gray-500 hover:text-white transition-colors">Advanced Search</Link></li>
                <li><Link href="/cards?view=sets" className="text-sm text-gray-500 hover:text-white transition-colors">Browse Sets</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">TOOLS</h3>
              <ul className="space-y-2">
                <li><Link href="/decks" className="text-sm text-gray-500 hover:text-white transition-colors">Deck Builder</Link></li>
                <li><Link href="/collection" className="text-sm text-gray-500 hover:text-white transition-colors">Collection</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">DEVELOPERS</h3>
              <ul className="space-y-2">
                <li><Link href="/api" className="text-sm text-gray-500 hover:text-white transition-colors">API Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">MORE</h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-sm text-gray-500 hover:text-white transition-colors">Help</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[#2d2640] text-center text-xs text-gray-600">
            <p>© {new Date().getFullYear()} Newtype Decks. Not affiliated with Bandai Namco.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
