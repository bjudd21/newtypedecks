'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Badge } from '@/components/ui';

interface CardDatabaseSearchProps {
  className?: string;
}

export const CardDatabaseSearch: React.FC<CardDatabaseSearchProps> = ({ className }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    router.push(`/cards?${params.toString()}`);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'advanced':
        router.push('/cards?advanced=true');
        break;
      case 'syntax':
        router.push('/cards?help=syntax');
        break;
      case 'sets':
        router.push('/cards?view=sets');
        break;
      case 'random':
        router.push('/cards?random=true');
        break;
    }
  };

  const featuredContent = [
    { name: 'Barbatos Lupus Rex', type: 'NEW', color: 'bg-red-600' },
    { name: 'Wing Gundam Zero Custom', type: 'NEW', color: 'bg-red-600' },
    { name: 'Strike Freedom Gundam', type: 'NEW', color: 'bg-blue-600' },
    { name: 'Nu Gundam', type: 'NEW', color: 'bg-blue-600' },
  ];

  return (
    <div className={`w-full max-w-6xl mx-auto ${className || ''}`}>
      {/* Main Search Interface */}
      <div className="text-center mb-16">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-white">Search</span>{' '}
            <span className="text-gradient">is a powerful</span>{' '}
            <span className="text-neon">Gundam Card Game</span>{' '}
            <span className="text-gradient">card search</span>
          </h1>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center cyber-border bg-black/40 backdrop-blur-strong rounded-lg p-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for cards, mechanics, or game text..."
                className="flex-1 bg-transparent border-none text-lg text-white placeholder-gray-400 focus:ring-0 focus:outline-none"
              />
              <Button
                type="submit"
                variant="cyber"
                className="ml-4 px-6"
              >
                Search
              </Button>
            </div>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button
            variant="outline"
            onClick={() => handleQuickAction('advanced')}
            className="px-6 py-3 bg-black/40 border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/10"
          >
            Advanced Search
          </Button>
          <Button
            variant="outline"
            onClick={() => handleQuickAction('syntax')}
            className="px-6 py-3 bg-black/40 border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/10"
          >
            Syntax Guide
          </Button>
          <Button
            variant="outline"
            onClick={() => handleQuickAction('sets')}
            className="px-6 py-3 bg-black/40 border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/10"
          >
            All Sets
          </Button>
          <Button
            variant="outline"
            onClick={() => handleQuickAction('random')}
            className="px-6 py-3 bg-black/40 border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/10"
          >
            Random Card
          </Button>
        </div>

        {/* Featured Content */}
        <div className="space-y-3">
          {featuredContent.map((item, index) => (
            <div key={index} className="flex items-center justify-center gap-3">
              <Badge className={`${item.color} text-white font-bold px-2 py-1 text-xs`}>
                {item.type}
              </Badge>
              <button
                onClick={() => {
                  setSearchQuery(item.name);
                  const params = new URLSearchParams();
                  params.set('search', item.name);
                  router.push(`/cards?${params.toString()}`);
                }}
                className="text-cyan-300 hover:text-cyan-100 transition-colors cursor-pointer"
              >
                {item.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardDatabaseSearch;