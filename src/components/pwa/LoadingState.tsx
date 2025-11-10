/**
 * Loading State Component
 * Displays loading spinner for PWA settings
 */

'use client';

import React from 'react';

export function LoadingState() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="py-12 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Loading PWA settings...</p>
      </div>
    </div>
  );
}
