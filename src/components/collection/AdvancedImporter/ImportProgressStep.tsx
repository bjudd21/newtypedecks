/**
 * Step 5: Import Progress
 */

import React from 'react';

export function ImportProgressStep() {
  return (
    <div className="py-8 text-center">
      <div className="mb-2 text-lg font-medium text-white">
        Importing Collection...
      </div>
      <div className="text-muted-foreground text-sm">
        Please wait while we process your cards
      </div>
    </div>
  );
}
