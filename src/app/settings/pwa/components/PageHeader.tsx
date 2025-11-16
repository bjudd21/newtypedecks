/**
 * Page header component for PWA settings
 */

import React from 'react';

export const PageHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">PWA Settings</h1>
      <p className="text-gray-600">
        Manage app installation, offline features, and cached data
      </p>
    </div>
  );
};
