/**
 * OfflineStatusBadge Component
 * Displays online/offline status and pending sync count
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui';
import type { SaveStatus } from '@/hooks/useOfflineSync';

interface OfflineStatusBadgeProps {
  saveStatus: SaveStatus;
  lastSaved: Date | null;
  isOnline: boolean;
  pendingSyncCount: number;
}

export const OfflineStatusBadge: React.FC<OfflineStatusBadgeProps> = ({
  saveStatus,
  lastSaved,
  isOnline,
  pendingSyncCount,
}) => {
  return (
    <>
      {/* Save Status and Online/Offline Indicators */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 text-sm">
          {saveStatus === 'saving' && (
            <>
              <div className="h-3 w-3 animate-spin rounded-full border-b-2 border-[#8b7aaa]"></div>
              <span className="text-[#8b7aaa]">Saving...</span>
            </>
          )}
          {saveStatus === 'saved' && lastSaved && (
            <>
              <span className="text-green-400">✓</span>
              <span className="text-gray-400">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            </>
          )}
          {saveStatus === 'offline' && lastSaved && (
            <>
              <span className="text-orange-400">📡</span>
              <span className="text-orange-400">
                Saved offline {lastSaved.toLocaleTimeString()}
              </span>
            </>
          )}
          {saveStatus === 'error' && (
            <>
              <span className="text-red-400">⚠️</span>
              <span className="text-red-400">Save failed</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Online/Offline indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`h-2.5 w-2.5 rounded-full shadow-lg ${
                isOnline
                  ? 'bg-green-400 shadow-green-400/50'
                  : 'bg-red-400 shadow-red-400/50'
              } animate-pulse`}
            />
            <span className="text-xs font-medium text-gray-400">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Pending sync indicator */}
          {pendingSyncCount > 0 && (
            <Badge className="border-orange-500/30 bg-orange-500/20 text-orange-300">
              {pendingSyncCount} pending
            </Badge>
          )}
        </div>
      </motion.div>

      {/* Offline Mode Notice */}
      {!isOnline && (
        <motion.div
          className="rounded-xl border border-orange-500/30 bg-gradient-to-r from-orange-900/20 to-orange-800/20 p-4 shadow-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">📡</span>
            <div className="text-sm">
              <div className="mb-1 font-semibold text-orange-300">
                You&apos;re offline
              </div>
              <div className="text-orange-200/80">
                Your deck changes are being saved locally and will sync
                automatically when you&apos;re back online.
              </div>
              {pendingSyncCount > 0 && (
                <div className="mt-2 font-medium text-orange-300">
                  {pendingSyncCount} deck{pendingSyncCount === 1 ? '' : 's'}{' '}
                  waiting to sync
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};
