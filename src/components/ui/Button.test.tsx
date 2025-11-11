// Test file for Button component
import { render, screen } from '@/lib/test-utils';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    // Check for gradient theme classes
    expect(button).toHaveClass(
      'bg-gradient-to-r',
      'from-cyan-500',
      'to-blue-600'
    );
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass(
      'bg-gradient-to-r',
      'from-gray-700',
      'to-gray-800'
    );

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button')).toHaveClass(
      'border',
      'border-cyan-400',
      'bg-transparent',
      'text-cyan-400'
    );

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).toHaveClass(
      'text-cyan-400',
      'hover:bg-cyan-400/10'
    );

    rerender(<Button variant="destructive">Destructive</Button>);
    expect(screen.getByRole('button')).toHaveClass(
      'bg-gradient-to-r',
      'from-red-500',
      'to-red-700'
    );
  });

  it('renders with cyberpunk theme variants', () => {
    const { rerender } = render(<Button variant="cyber">Cyber</Button>);
    expect(screen.getByRole('button')).toHaveClass(
      'bg-gradient-to-r',
      'from-cyan-400',
      'to-purple-600',
      'border-2',
      'border-cyan-400'
    );

    rerender(<Button variant="neon">Neon</Button>);
    expect(screen.getByRole('button')).toHaveClass(
      'bg-transparent',
      'text-green-400',
      'border-2',
      'border-green-400'
    );

    rerender(<Button variant="plasma">Plasma</Button>);
    expect(screen.getByRole('button')).toHaveClass(
      'bg-gradient-to-r',
      'from-purple-600',
      'to-orange-500',
      'border-2'
    );

    rerender(<Button variant="hologram">Hologram</Button>);
    expect(screen.getByRole('button')).toHaveClass(
      'bg-transparent',
      'text-cyan-400',
      'backdrop-blur-sm'
    );
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-8', 'px-3', 'text-xs');

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-10', 'px-5', 'text-sm');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-12', 'px-8', 'text-base');

    rerender(<Button size="xl">Extra Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-14', 'px-10', 'text-lg');

    rerender(<Button size="icon">Icon</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-11', 'w-11');
  });

  it('shows loading state', () => {
    render(<Button isLoading>Loading</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');

    // Check for loading spinner
    const spinner = button.querySelector('svg');
    expect(spinner).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button');
    button.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('forwards ref correctly', () => {
    const ref = jest.fn();
    render(<Button ref={ref}>Ref test</Button>);

    expect(ref).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<Button className="custom-button-class">Custom</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-button-class');
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );

    const button = screen.getByRole('button');
    button.click();

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when loading', () => {
    const handleClick = jest.fn();
    render(
      <Button isLoading onClick={handleClick}>
        Loading
      </Button>
    );

    const button = screen.getByRole('button');
    button.click();

    expect(handleClick).not.toHaveBeenCalled();
  });
});
