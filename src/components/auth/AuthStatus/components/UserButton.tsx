/**
 * User dropdown button
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';

interface UserButtonProps {
  userName?: string | null;
  isDropdownOpen: boolean;
  onToggle: () => void;
}

export const UserButton: React.FC<UserButtonProps> = ({
  userName,
  isDropdownOpen,
  onToggle,
}) => {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className="flex items-center space-x-2"
      >
        <span className="font-semibold uppercase">
          {userName?.split(' ')[0] || 'Menu'}
        </span>
        <motion.svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isDropdownOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </Button>
    </motion.div>
  );
};
