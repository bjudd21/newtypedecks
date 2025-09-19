// Test file for Badge component
import { render, screen } from '@/lib/test-utils';
import { Badge, RarityBadge } from './Badge';

describe('Badge Component', () => {
  it('renders with default props', () => {
    render(<Badge>Default Badge</Badge>);

    const badge = screen.getByText('Default Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Badge variant="primary">Primary</Badge>);
    expect(screen.getByText('Primary')).toHaveClass(
      'bg-blue-100',
      'text-blue-800'
    );

    rerender(<Badge variant="success">Success</Badge>);
    expect(screen.getByText('Success')).toHaveClass(
      'bg-green-100',
      'text-green-800'
    );

    rerender(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText('Warning')).toHaveClass(
      'bg-yellow-100',
      'text-yellow-800'
    );

    rerender(<Badge variant="error">Error</Badge>);
    expect(screen.getByText('Error')).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Badge size="sm">Small</Badge>);
    expect(screen.getByText('Small')).toHaveClass('px-2', 'py-1', 'text-xs');

    rerender(<Badge size="lg">Large</Badge>);
    expect(screen.getByText('Large')).toHaveClass('px-3', 'py-2', 'text-base');

    rerender(<Badge size="md">Medium</Badge>);
    expect(screen.getByText('Medium')).toHaveClass(
      'px-2.5',
      'py-1.5',
      'text-sm'
    );
  });

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);

    const badge = screen.getByText('Custom');
    expect(badge).toHaveClass('custom-class');
  });
});

describe('RarityBadge Component', () => {
  it('renders common rarity with default variant', () => {
    render(<RarityBadge rarity="Common">Common</RarityBadge>);

    const badge = screen.getByText('Common');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  it('renders rare rarity with primary variant', () => {
    render(<RarityBadge rarity="Rare">Rare</RarityBadge>);

    const badge = screen.getByText('Rare');
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('renders legendary rarity with warning variant', () => {
    render(<RarityBadge rarity="Legendary">Legendary</RarityBadge>);

    const badge = screen.getByText('Legendary');
    expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  it('renders mythic rarity with error variant', () => {
    render(<RarityBadge rarity="Mythic">Mythic</RarityBadge>);

    const badge = screen.getByText('Mythic');
    expect(badge).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('applies custom color when provided', () => {
    render(
      <RarityBadge rarity="Custom" color="#FF5733">
        Custom
      </RarityBadge>
    );

    const badge = screen.getByText('Custom');
    expect(badge).toHaveClass('bg-[#FF5733]');
  });
});
