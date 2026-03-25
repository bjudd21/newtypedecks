'use client';
/**
 * Dropdown menu with animated menu items
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { dropdownVariants, itemVariants } from '../constants';
import { AdminIcon } from './icons/AdminIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import type { MenuItem } from '../types';

interface DropdownMenuProps {
  isOpen: boolean;
  menuItems: MenuItem[];
  userRole?: string;
  onClose: () => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isOpen,
  menuItems,
  userRole,
  onClose,
}) => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* Dropdown */}
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="border-border bg-card absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-lg border shadow-2xl shadow-black/50 backdrop-blur-xl"
          >
            <div className="py-1.5">
              {menuItems.map((item, index) => (
                <div key={item.label}>
                  <motion.button
                    variants={itemVariants}
                    onClick={item.onClick}
                    className="group text-foreground hover:bg-accent hover:text-foreground focus:ring-ring flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-all focus:ring-2 focus:outline-none focus:ring-inset"
                    whileHover={{ x: 4 }}
                  >
                    <span className="text-primary group-hover:text-primary/80 transition-colors">
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                  </motion.button>
                  {index === 0 && (
                    <motion.div
                      variants={itemVariants}
                      className="border-border/60 my-1.5 border-t"
                    />
                  )}
                </div>
              ))}

              {/* Admin Panel (if applicable) */}
              {(userRole === 'ADMIN' || userRole === 'MODERATOR') && (
                <>
                  <motion.div
                    variants={itemVariants}
                    className="border-border/60 my-1.5 border-t"
                  />
                  <motion.button
                    variants={itemVariants}
                    onClick={() => {
                      router.push('/admin');
                      onClose();
                    }}
                    className="group focus:ring-ring flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-amber-400 transition-all hover:bg-amber-950/30 hover:text-amber-300 focus:ring-2 focus:outline-none focus:ring-inset"
                    whileHover={{ x: 4 }}
                  >
                    <span className="text-amber-500 transition-colors group-hover:text-amber-400">
                      <AdminIcon />
                    </span>
                    <span className="flex-1">Admin Panel</span>
                  </motion.button>
                </>
              )}

              {/* Sign Out */}
              <motion.div
                variants={itemVariants}
                className="border-border/60 my-1.5 border-t"
              />
              <motion.button
                variants={itemVariants}
                onClick={handleSignOut}
                className="group focus:ring-ring flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-400 transition-all hover:bg-red-950/30 hover:text-red-300 focus:ring-2 focus:outline-none focus:ring-inset"
                whileHover={{ x: 4 }}
              >
                <span className="text-red-500 transition-colors group-hover:text-red-400">
                  <LogoutIcon />
                </span>
                <span className="flex-1">Sign Out</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
