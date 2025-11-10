'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Badge } from '@/components/ui';

interface CardDatabaseSearchProps {
  className?: string;
}

export const CardDatabaseSearch: React.FC<CardDatabaseSearchProps> = ({
  className,
}) => {
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
    <div className={`mx-auto w-full max-w-6xl ${className || ''}`}>
      {/* Main Search Interface */}
      <div className="mb-16 text-center">
        <div className="mb-8">
          <h1 className="mb-4 text-5xl font-bold md:text-6xl">
            <span className="text-white">Search</span>{' '}
            <span className="text-gradient">is a powerful</span>{' '}
            <span className="text-neon">Gundam Card Game</span>{' '}
            <span className="text-gradient">card search</span>
          </h1>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative mx-auto max-w-4xl">
            <div className="cyber-border backdrop-blur-strong flex items-center rounded-lg bg-black/40 p-4">
              <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-purple-400">
                <svg
                  className="h-6 w-6 text-white"
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
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for cards, mechanics, or game text..."
                className="flex-1 border-none bg-transparent text-lg text-white placeholder-gray-400 focus:outline-none focus:ring-0"
              />
              <Button type="submit" variant="cyber" className="ml-4 px-6">
                Search
              </Button>
            </div>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => handleQuickAction('advanced')}
            className="border-cyan-400/30 bg-black/40 px-6 py-3 text-cyan-300 hover:bg-cyan-400/10"
          >
            Advanced Search
          </Button>
          <Button
            variant="outline"
            onClick={() => handleQuickAction('syntax')}
            className="border-cyan-400/30 bg-black/40 px-6 py-3 text-cyan-300 hover:bg-cyan-400/10"
          >
            Syntax Guide
          </Button>
          <Button
            variant="outline"
            onClick={() => handleQuickAction('sets')}
            className="border-cyan-400/30 bg-black/40 px-6 py-3 text-cyan-300 hover:bg-cyan-400/10"
          >
            All Sets
          </Button>
          <Button
            variant="outline"
            onClick={() => handleQuickAction('random')}
            className="border-cyan-400/30 bg-black/40 px-6 py-3 text-cyan-300 hover:bg-cyan-400/10"
          >
            Random Card
          </Button>
        </div>

        {/* Featured Content */}
        <div className="space-y-3">
          {featuredContent.map((item, index) => (
            <div key={index} className="flex items-center justify-center gap-3">
              <Badge
                className={`${item.color} px-2 py-1 text-xs font-bold text-white`}
              >
                {item.type}
              </Badge>
              <button
                onClick={() => {
                  setSearchQuery(item.name);
                  const params = new URLSearchParams();
                  params.set('search', item.name);
                  router.push(`/cards?${params.toString()}`);
                }}
                className="cursor-pointer text-cyan-300 transition-colors hover:text-cyan-100"
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
