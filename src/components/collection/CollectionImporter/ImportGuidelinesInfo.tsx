/**
 * ImportGuidelinesInfo Component
 * Information about import formats and guidelines
 */

import React from 'react';

export const ImportGuidelinesInfo: React.FC = () => {
  return (
    <div className="border-border bg-background text-muted-foreground rounded border p-3 text-xs">
      <div className="text-foreground mb-2 font-medium">Import Guidelines:</div>
      <ul className="space-y-1">
        <li>• Maximum 1000 cards per import</li>
        <li>• Cards are matched by name, set number, or card ID</li>
        <li>• Unmatched cards will be skipped with error details</li>
        <li>• CSV files should use commas or tabs as separators</li>
        <li>• JSON format should be an array of card objects</li>
      </ul>
    </div>
  );
};
