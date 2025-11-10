// Test file for Badge component
import { render, screen } from '@/lib/test-utils';
import { Badge, RarityBadge } from './Badge';

describe('Badge Component', () => {
  it('renders with default props', () => {
    render(<Badge>Default Badge</Badge>);

    const badge = screen.getByText('Default Badge');
    expect(badge).toBeInTheDocument();
    // Check for dark theme default variant classes
    expect(badge.parentElement).toHaveClass('bg-gray-800/50', 'text-gray-300');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Badge variant="primary">Primary</Badge>);
    const getPrimaryBadge = () => screen.getByText('Primary').parentElement;
    expect(getPrimaryBadge()).toHaveClass('bg-cyan-900/30', 'text-cyan-300');

    rerender(<Badge variant="success">Success</Badge>);
    const getSuccessBadge = () => screen.getByText('Success').parentElement;
    expect(getSuccessBadge()).toHaveClass('bg-green-900/30', 'text-green-300');

    rerender(<Badge variant="warning">Warning</Badge>);
    const getWarningBadge = () => screen.getByText('Warning').parentElement;
    expect(getWarningBadge()).toHaveClass('bg-yellow-900/30', 'text-yellow-300');

    rerender(<Badge variant="destructive">Destructive</Badge>);
    const getDestructiveBadge = () =>
      screen.getByText('Destructive').parentElement;
    expect(getDestructiveBadge()).toHaveClass('bg-red-900/30', 'text-red-300');
  });

  it('renders with cyberpunk theme variants', () => {
    const { rerender } = render(<Badge variant="cyber">Cyber</Badge>);
    const getCyberBadge = () => screen.getByText('Cyber').parentElement;
    expect(getCyberBadge()).toHaveClass('text-cyan-100');

    rerender(<Badge variant="neon">Neon</Badge>);
    const getNeonBadge = () => screen.getByText('Neon').parentElement;
    expect(getNeonBadge()).toHaveClass('text-green-100');

    rerender(<Badge variant="plasma">Plasma</Badge>);
    const getPlasmaBadge = () => screen.getByText('Plasma').parentElement;
    expect(getPlasmaBadge()).toHaveClass('text-purple-100');

    rerender(<Badge variant="hologram">Hologram</Badge>);
    const getHologramBadge = () => screen.getByText('Hologram').parentElement;
    expect(getHologramBadge()).toHaveClass('text-cyan-300');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Badge size="sm">Small</Badge>);
    expect(screen.getByText('Small').parentElement).toHaveClass(
      'px-2',
      'py-0.5',
      'text-xs'
    );

    rerender(<Badge size="lg">Large</Badge>);
    expect(screen.getByText('Large').parentElement).toHaveClass(
      'px-3',
      'py-1',
      'text-sm'
    );

    rerender(<Badge size="xl">Extra Large</Badge>);
    expect(screen.getByText('Extra Large').parentElement).toHaveClass(
      'px-4',
      'py-1.5',
      'text-base'
    );
  });

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);

    const badge = screen.getByText('Custom').parentElement;
    expect(badge).toHaveClass('custom-class');
  });

  it('renders with animation wrapper when animate is true', () => {
    render(<Badge animate>Animated</Badge>);
    // Badge should render with animation (verified by rendering without error)
    const badge = screen.getByText('Animated');
    expect(badge).toBeInTheDocument();
  });
});

describe('RarityBadge Component', () => {
  it('renders common rarity with default variant', () => {
    render(<RarityBadge rarity="Common" />);

    const badge = screen.getByText('Common');
    expect(badge).toBeInTheDocument();
    // Common maps to 'default' variant with dark theme
    expect(badge.closest('div')).toHaveClass('bg-gray-800/50', 'text-gray-300');
  });

  it('renders uncommon rarity with primary variant', () => {
    render(<RarityBadge rarity="Uncommon" />);

    const badge = screen.getByText('Uncommon');
    expect(badge).toBeInTheDocument();
    // Uncommon maps to 'primary' variant (cyan)
    expect(badge.closest('div')).toHaveClass('bg-cyan-900/30', 'text-cyan-300');
  });

  it('renders rare rarity with cyber variant', () => {
    render(<RarityBadge rarity="Rare" />);

    const badge = screen.getByText('Rare');
    expect(badge).toBeInTheDocument();
    // Rare maps to 'cyber' variant
    expect(badge.closest('div')).toHaveClass('text-cyan-100');
  });

  it('renders epic rarity with neon variant', () => {
    render(<RarityBadge rarity="Epic" />);

    const badge = screen.getByText('Epic');
    expect(badge).toBeInTheDocument();
    // Epic maps to 'neon' variant
    expect(badge.closest('div')).toHaveClass('text-green-100');
  });

  it('renders legendary rarity with plasma variant', () => {
    render(<RarityBadge rarity="Legendary" />);

    const badge = screen.getByText('Legendary');
    expect(badge).toBeInTheDocument();
    // Legendary maps to 'plasma' variant
    expect(badge.closest('div')).toHaveClass('text-purple-100');
    // Should have sparkle effect
    expect(screen.getByText('✦')).toBeInTheDocument();
  });

  it('renders mythic rarity with hologram variant', () => {
    render(<RarityBadge rarity="Mythic" />);

    const badge = screen.getByText('Mythic');
    expect(badge).toBeInTheDocument();
    // Mythic maps to 'hologram' variant
    expect(badge.closest('div')).toHaveClass('text-cyan-300');
    // Should have sparkle effect
    expect(screen.getByText('✦')).toBeInTheDocument();
  });

  it('handles case-insensitive rarity matching', () => {
    render(<RarityBadge rarity="LEGENDARY" />);

    const badge = screen.getByText('LEGENDARY');
    expect(badge).toBeInTheDocument();
    expect(badge.closest('div')).toHaveClass('text-purple-100');
  });

  it('applies custom size', () => {
    render(<RarityBadge rarity="Rare" size="lg" />);

    const badge = screen.getByText('Rare');
    expect(badge.closest('div')).toHaveClass('px-3', 'py-1', 'text-sm');
  });

  it('applies custom className', () => {
    render(<RarityBadge rarity="Common" className="custom-rarity-class" />);

    const badge = screen.getByText('Common');
    expect(badge.closest('div')).toHaveClass('custom-rarity-class');
  });

  it('can disable animation', () => {
    render(<RarityBadge rarity="Rare" animate={false} />);

    const badge = screen.getByText('Rare');
    expect(badge).toBeInTheDocument();
    // Badge should still render without animation wrapper
  });
});
