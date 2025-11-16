/**
 * Empty state component when no cards in deck
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

interface EmptyStateProps {
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ className = '' }) => {
  return (
    <Card className={`${className} border-[#443a5c] bg-[#2d2640]`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base tracking-wide text-[#a89ec7] uppercase">
          <span>📋</span>
          Deck Validation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          className="py-6 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-sm text-gray-400">No cards in deck</div>
          <div className="mt-1 text-xs text-gray-500">
            Add cards to see validation results
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};
