/**
 * Collection page - Personal collection management interface
 */

import { CollectionManager } from '@/components/collection';

export default function CollectionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Collection</h1>
        <p className="text-gray-600">
          Track and manage your personal Gundam Card Game collection
        </p>
      </div>

      <CollectionManager />
    </div>
  );
}

export const metadata = {
  title: 'My Collection | Gundam Card Game',
  description: 'Manage your personal Gundam Card Game collection',
};
