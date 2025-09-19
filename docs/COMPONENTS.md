# Component Library Documentation

This document describes the reusable UI components available in the Gundam Card Game website.

## Overview

The component library is built with:
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Accessibility** best practices
- **Responsive design** principles
- **Consistent design system**

## Component Categories

### UI Components
Basic building blocks for user interfaces.

### Layout Components
Components for page structure and layout.

### Navigation Components
Components for site navigation and routing.

## UI Components

### Button

A versatile button component with multiple variants and sizes.

```tsx
import { Button } from '@/components/ui';

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// With loading state
<Button isLoading>Loading...</Button>

// Disabled state
<Button disabled>Disabled</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- `disabled`: boolean
- `onClick`: () => void

### Input

A form input component with label and error support.

```tsx
import { Input } from '@/components/ui';

// Basic usage
<Input placeholder="Enter text..." />

// With label
<Input label="Email" placeholder="Enter your email" />

// With error
<Input 
  label="Password" 
  error="Password is required"
  placeholder="Enter password"
/>

// With helper text
<Input 
  label="Username"
  helperText="Choose a unique username"
  placeholder="Enter username"
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `placeholder`: string
- `type`: string
- `value`: string
- `onChange`: (e: ChangeEvent) => void

### Card

A container component for grouping related content.

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here...</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Components:**
- `Card` - Main container
- `CardHeader` - Header section
- `CardTitle` - Title text
- `CardContent` - Main content
- `CardFooter` - Footer section

### Modal

A modal dialog component for overlays and dialogs.

```tsx
import { Modal } from '@/components/ui';

const [isOpen, setIsOpen] = useState(false);

<Modal 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="md"
>
  <p>Modal content goes here...</p>
</Modal>
```

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `children`: ReactNode

### Badge

A small component for displaying labels and status indicators.

```tsx
import { Badge, RarityBadge } from '@/components/ui';

// Basic badge
<Badge>New</Badge>

// With variants
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>

// With sizes
<Badge size="sm">Small</Badge>
<Badge size="lg">Large</Badge>

// Rarity badge
<RarityBadge rarity="Rare" />
<RarityBadge rarity="Legendary" />
```

**Props:**
- `variant`: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
- `size`: 'sm' | 'md' | 'lg'
- `children`: ReactNode

### Spinner

Loading indicators for async operations.

```tsx
import { Spinner, LoadingOverlay, Skeleton } from '@/components/ui';

// Basic spinner
<Spinner />

// With sizes
<Spinner size="sm" />
<Spinner size="lg" />

// Loading overlay
<LoadingOverlay isLoading={isLoading}>
  <div>Content that might be loading...</div>
</LoadingOverlay>

// Skeleton loading
<Skeleton />
<Skeleton lines={3} />
```

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `isLoading`: boolean (for LoadingOverlay)
- `lines`: number (for Skeleton)

### Toast

Notification components for user feedback.

```tsx
import { Toast, ToastContainer } from '@/components/ui';

// Toast container
<ToastContainer position="top-right">
  <Toast
    id="toast-1"
    type="success"
    message="Operation completed successfully!"
    onClose={(id) => removeToast(id)}
  />
</ToastContainer>
```

**Props:**
- `id`: string
- `type`: 'success' | 'error' | 'warning' | 'info'
- `message`: string
- `duration`: number (milliseconds, 0 for persistent)
- `onClose`: (id: string) => void

### Select

A dropdown select component with search and keyboard navigation.

```tsx
import { Select } from '@/components/ui';

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

<Select
  options={options}
  value={selectedValue}
  onChange={setSelectedValue}
  placeholder="Select an option..."
/>
```

**Props:**
- `options`: SelectOption[]
- `value`: string
- `onChange`: (value: string) => void
- `placeholder`: string
- `disabled`: boolean

### Pagination

A pagination component for navigating through large datasets.

```tsx
import { Pagination } from '@/components/ui';

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  siblings={2}
/>
```

**Props:**
- `currentPage`: number
- `totalPages`: number
- `onPageChange`: (page: number) => void
- `siblings`: number (pages to show around current)

### Search

A search component with suggestions and debouncing.

```tsx
import { Search } from '@/components/ui';

const suggestions = [
  { id: '1', label: 'Gundam', value: 'gundam' },
  { id: '2', label: 'Char Aznable', value: 'char' },
];

<Search
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={handleSearch}
  suggestions={suggestions}
  placeholder="Search cards..."
  debounceTime={300}
/>
```

**Props:**
- `value`: string
- `onChange`: (value: string) => void
- `onSearch`: (query: string) => void
- `suggestions`: SearchSuggestion[]
- `placeholder`: string
- `debounceTime`: number

### FileUpload

A file upload component with drag-and-drop support.

```tsx
import { FileUpload } from '@/components/ui';

<FileUpload
  onUpload={handleFileUpload}
  onError={handleUploadError}
  accept="image/*"
  maxSize={5 * 1024 * 1024} // 5MB
  multiple={false}
/>
```

**Props:**
- `onUpload`: (file: File) => Promise<void>
- `onError`: (error: string) => void
- `accept`: string (file types)
- `maxSize`: number (bytes)
- `multiple`: boolean
- `disabled`: boolean

## Layout Components

### PageLayout

A consistent page layout wrapper.

```tsx
import { PageLayout } from '@/components/layout';

<PageLayout>
  <h1>Page Title</h1>
  <p>Page content...</p>
</PageLayout>
```

**Props:**
- `children`: ReactNode
- `className`: string

## Navigation Components

### Navbar

Main navigation bar component.

```tsx
import { Navbar } from '@/components/navigation';

<Navbar />
```

### MobileMenu

Mobile navigation menu component.

```tsx
import { MobileMenu } from '@/components/navigation';

<MobileMenu />
```

### Breadcrumb

Breadcrumb navigation component.

```tsx
import { Breadcrumb } from '@/components/navigation';

const items = [
  { label: 'Home', href: '/' },
  { label: 'Cards', href: '/cards' },
  { label: 'RX-78-2 Gundam', href: '/cards/card-001' },
];

<Breadcrumb items={items} />
```

**Props:**
- `items`: BreadcrumbItem[]

## Design System

### Colors

The design system uses a consistent color palette:

```css
/* Primary Colors */
--primary-50: #eff6ff;
--primary-500: #3b82f6;
--primary-900: #1e3a8a;

/* Gray Scale */
--gray-50: #f9fafb;
--gray-500: #6b7280;
--gray-900: #111827;

/* Status Colors */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;
```

### Typography

```css
/* Font Families */
--font-sans: 'Inter', system-ui, sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
```

### Spacing

```css
/* Spacing Scale */
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-6: 1.5rem;
--space-8: 2rem;
--space-12: 3rem;
--space-16: 4rem;
```

### Shadows

```css
/* Shadow Scale */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

## Accessibility

All components follow accessibility best practices:

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Proper tab order and focus management
- Keyboard shortcuts where appropriate

### Screen Readers
- Proper ARIA labels and descriptions
- Semantic HTML elements
- Screen reader announcements for dynamic content

### Color Contrast
- WCAG AA compliant color combinations
- High contrast mode support
- Color is not the only way to convey information

### Focus Management
- Visible focus indicators
- Logical focus flow
- Focus trapping in modals

## Responsive Design

Components are designed to work across all screen sizes:

### Breakpoints
```css
/* Mobile First Approach */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Mobile Considerations
- Touch-friendly target sizes (44px minimum)
- Swipe gestures where appropriate
- Optimized layouts for small screens

### Desktop Considerations
- Hover states for interactive elements
- Keyboard shortcuts
- Efficient use of screen real estate

## Testing

### Component Testing

```tsx
import { render, screen } from '@/lib/test-utils';
import { Button } from '@/components/ui';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Accessibility Testing

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should not have accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Best Practices

### Component Design
1. **Single Responsibility** - Each component should have one clear purpose
2. **Composition** - Build complex components from simple ones
3. **Props Interface** - Define clear, typed prop interfaces
4. **Default Props** - Provide sensible defaults where appropriate

### Performance
1. **Memoization** - Use React.memo for expensive components
2. **Lazy Loading** - Load components only when needed
3. **Bundle Size** - Keep components lightweight
4. **Tree Shaking** - Export components individually

### Maintainability
1. **Documentation** - Document all props and usage examples
2. **Tests** - Write comprehensive tests for all components
3. **Consistency** - Follow established patterns and conventions
4. **Versioning** - Maintain backward compatibility

## Contributing

### Adding New Components

1. **Create the component file**
   ```tsx
   // src/components/ui/NewComponent.tsx
   export interface NewComponentProps {
     // Define props
   }
   
   export const NewComponent: React.FC<NewComponentProps> = (props) => {
     // Component implementation
   };
   ```

2. **Add to index file**
   ```tsx
   // src/components/ui/index.ts
   export { NewComponent } from './NewComponent';
   export type { NewComponentProps } from './NewComponent';
   ```

3. **Write tests**
   ```tsx
   // src/components/ui/NewComponent.test.tsx
   describe('NewComponent', () => {
     // Test implementation
   });
   ```

4. **Update documentation**
   - Add component to this documentation
   - Include usage examples
   - Document all props

### Component Guidelines

- Use TypeScript for all components
- Follow the established naming conventions
- Include proper accessibility attributes
- Write comprehensive tests
- Document all props and usage examples
- Ensure responsive design
- Follow the design system
