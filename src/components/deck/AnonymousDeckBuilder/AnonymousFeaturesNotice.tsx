/**
 * AnonymousFeaturesNotice Component
 * Displays features available for anonymous users
 */

import React from 'react';
import { motion } from 'framer-motion';

export const AnonymousFeaturesNotice: React.FC = () => {
  return (
    <motion.div
      className="rounded-xl border border-[#443a5c] bg-gradient-to-br from-[#2d2640] to-[#3a3050] p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <h4 className="mb-4 text-lg font-semibold text-[#a89ec7]">
        Anonymous Deck Building Features:
      </h4>
      <ul className="space-y-2 text-sm text-gray-300">
        <li className="flex items-center gap-2">
          <span className="text-green-400">✅</span>
          Build decks with full card search and filtering
        </li>
        <li className="flex items-center gap-2">
          <span className="text-green-400">✅</span>
          Automatic local saving (persists until you clear browser data)
        </li>
        <li className="flex items-center gap-2">
          <span className="text-green-400">✅</span>
          Export decks in multiple formats (JSON, Text, CSV)
        </li>
        <li className="flex items-center gap-2">
          <span className="text-green-400">✅</span>
          Real-time deck validation and statistics
        </li>
        <li className="flex items-center gap-2">
          <span className="text-green-400">✅</span>
          Drag and drop card management
        </li>
        <li className="flex items-center gap-2">
          <span className="text-green-400">✅</span>
          Share decks via temporary URLs
        </li>
      </ul>
      <div className="mt-4 border-t border-[#443a5c] pt-4">
        <p className="text-sm text-gray-300">
          <strong className="text-[#a89ec7]">Want more?</strong> Sign in to save
          decks permanently, share them with others, and access your deck
          collection from any device!
        </p>
      </div>
    </motion.div>
  );
};
