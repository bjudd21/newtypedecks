/**
 * Page header component for PWA settings
 */

import React from 'react';

export const PageHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <h1 className="text-foreground mb-2 text-3xl font-bold">PWA Settings</h1>
      <p className="text-muted-foreground">
        Manage app installation, offline features, and cached data
      </p>
    </div>
  );
};
