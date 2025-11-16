/**
 * UserProfile Utility Functions
 * Date formatting and badge utilities
 */

export const formatJoinDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
  }).format(date);
};

export const getLastActiveText = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Active today';
  if (diffDays === 1) return 'Active yesterday';
  if (diffDays < 7) return `Active ${diffDays} days ago`;
  if (diffDays < 30) return `Active ${Math.floor(diffDays / 7)} weeks ago`;
  return `Last seen ${Math.floor(diffDays / 30)} months ago`;
};

export const getBadgeRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'legendary':
      return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
    case 'rare':
      return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
    case 'uncommon':
      return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
    default:
      return 'bg-gray-400 text-white';
  }
};
