/**
 * AnonymousDeckHeader Component
 * Information banner for anonymous deck building
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const AnonymousDeckHeader: React.FC = () => {
  return (
    <motion.div
      className="border-primary/30 from-card to-accent hover:shadow-primary/20 mb-6 rounded-xl border bg-gradient-to-r p-5 shadow-lg transition-all duration-300"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-lg">
            <svg
              className="text-primary/80 h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-primary/80 mb-1 text-base font-semibold">
            Anonymous Deck Building
          </h3>
          <p className="text-foreground text-sm leading-relaxed">
            Your deck is saved locally in your browser.
            <span className="text-primary font-medium">
              {' '}
              Sign in to save decks permanently and share them with others!
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};
