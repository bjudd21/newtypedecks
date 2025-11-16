/**
 * DeckRatings Utility Functions
 * Date formatting and rating text conversion
 */

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const getRatingText = (rating: number) => {
  switch (rating) {
    case 5:
      return 'Excellent';
    case 4:
      return 'Good';
    case 3:
      return 'Average';
    case 2:
      return 'Poor';
    case 1:
      return 'Terrible';
    default:
      return '';
  }
};
