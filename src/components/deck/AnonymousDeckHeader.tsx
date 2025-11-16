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
      className="mb-6 rounded-xl border border-[#8b7aaa]/30 bg-gradient-to-r from-[#2d2640] to-[#3a3050] p-5 shadow-lg transition-all duration-300 hover:shadow-[#8b7aaa]/20"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8b7aaa]/20">
            <svg
              className="h-6 w-6 text-[#a89ec7]"
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
          <h3 className="mb-1 text-base font-semibold text-[#a89ec7]">
            Anonymous Deck Building
          </h3>
          <p className="text-sm leading-relaxed text-gray-300">
            Your deck is saved locally in your browser.
            <span className="font-medium text-[#8b7aaa]">
              {' '}
              Sign in to save decks permanently and share them with others!
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};
