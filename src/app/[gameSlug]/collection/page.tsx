/**
 * Collection page - Personal collection management interface
 */

import { CollectionManager } from '@/components/collection';

export default function CollectionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 bg-gradient-to-r from-[#8b7aaa] via-[#a89ec7] to-[#8b7aaa] bg-clip-text text-3xl font-bold text-transparent">
          My Collection
        </h1>
        <p className="text-gray-400">
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
