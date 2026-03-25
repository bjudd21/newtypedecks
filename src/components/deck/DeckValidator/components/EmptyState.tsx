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
    <Card className={`${className} border-border bg-card`}>
      <CardHeader>
        <CardTitle className="text-primary/80 flex items-center gap-2 text-base tracking-wide uppercase">
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
          <div className="text-muted-foreground text-sm">No cards in deck</div>
          <div className="text-muted-foreground/70 mt-1 text-xs">
            Add cards to see validation results
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};
