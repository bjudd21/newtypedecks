# Home Page Customization Guide

This guide shows you how to easily customize the purple-themed home page (`src/app/page.tsx`) without breaking anything.

> **Note**: The entire website uses a consistent purple theme. When making changes, maintain the purple color palette for visual consistency.

## File Location
`/Users/mkv/Documents/Projects/GCG/src/app/page.tsx`

---

## Easy Customizations

### 1. Change the Main Heading Text

**Component:** Hero Heading (in Hero Section)

**Current:**
```tsx
<motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-white">
  Gundam Card Game is a powerful <span className="font-semibold">card search</span>
</motion.h1>
```

**Examples:**
```tsx
// Option 1: More casual
Gundam Card Game is a powerful <span className="font-semibold">card database</span>

// Option 2: More descriptive
Build, share, and explore <span className="font-semibold">Gundam card decks</span>

// Option 3: Community focused
The ultimate <span className="font-semibold">Gundam card community</span>
```

---

### 2. Change Search Bar Placeholder Text

**Component:** Hero Search Bar (in Hero Section)

**Current:**
```tsx
placeholder="Search for cards..."
```

**Examples:**
```tsx
placeholder="Find your perfect card..."
placeholder="Search cards by name, type, or set..."
placeholder="What card are you looking for?"
```

---

### 3. Modify Quick Action Buttons

**Component:** Quick Action Buttons (below Hero Search Bar)

**Current buttons:**
- Advanced Search → `/cards`
- Deck Builder → `/decks`
- All Sets → `/cards?view=sets`
- Random Card → `/cards/random`

**Add a new button:**
```tsx
<Link href="/collection">
  <Button variant="secondary" size="sm" className="bg-[#2d2640] hover:bg-[#3a3050] border-[#443a5c] text-white">
    My Collection
  </Button>
</Link>
```

**Change button text:**
```tsx
// Before
Advanced Search

// After
Browse All Cards
```

---

### 4. Update News Badges

**Component:** Announcement Items (in Announcements Section)

**Current:**
```tsx
<div className="flex items-center gap-2">
  <Badge className="bg-orange-600 text-white font-semibold text-xs">NEW</Badge>
  <span className="text-gray-300">Latest Booster Set Available</span>
</div>
```

**Change colors:**
```tsx
// Green badge
<Badge className="bg-green-600 text-white font-semibold text-xs">NEW</Badge>

// Purple badge
<Badge className="bg-purple-600 text-white font-semibold text-xs">NEW</Badge>

// Red badge
<Badge className="bg-red-600 text-white font-semibold text-xs">LIVE</Badge>
```

**Change text:**
```tsx
<span className="text-gray-300">New cards added daily</span>
<span className="text-gray-300">Join our Discord community</span>
<span className="text-gray-300">Card database updated</span>
```

**Add a new news item:**
```tsx
<div className="flex items-center gap-2">
  <Badge className="bg-green-600 text-white font-semibold text-xs">UPDATE</Badge>
  <span className="text-gray-300">Deck sharing now available</span>
</div>
```

---

### 5. Change "Recent Decks" Section Title

**Component:** Section Heading (in Content Sections)

**Current:**
```tsx
<h2 className="text-2xl font-semibold text-white">Recent Decks</h2>
```

**Examples:**
```tsx
<h2 className="text-2xl font-semibold text-white">Popular Decks</h2>
<h2 className="text-2xl font-semibold text-white">Featured Decks</h2>
<h2 className="text-2xl font-semibold text-white">Community Decks</h2>
```

---

### 6. Change Footer Links

**Component:** Footer (in Legal Compliance Footer)

**Add a new footer column:**
```tsx
<div>
  <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">SOCIAL</h3>
  <ul className="space-y-2">
    <li><Link href="/discord" className="text-sm text-gray-500 hover:text-white transition-colors">Discord</Link></li>
    <li><Link href="/twitter" className="text-sm text-gray-500 hover:text-white transition-colors">Twitter</Link></li>
  </ul>
</div>
```

**Change existing footer links:**
```tsx
// Before
<li><Link href="/about" className="text-sm text-gray-500 hover:text-white transition-colors">About</Link></li>

// After
<li><Link href="/about" className="text-sm text-gray-500 hover:text-white transition-colors">About Us</Link></li>
```

---

## Purple Theme Customization

> **Important**: The entire website uses a consistent purple theme. When customizing colors, stay within the purple palette to maintain visual consistency across all pages.

### Purple Theme Color Reference
- `#1a1625` - Deep purple-black (primary background)
- `#2a1f3d` - Medium purple-gray (secondary background)
- `#2d2640` - Card backgrounds
- `#3a3050` - Lighter surfaces, hover states
- `#443a5c` - Default borders
- `#6b5a8a` - Interactive borders
- `#8b7aaa` - Active borders, primary purple
- `#a89ec7` - Text and headings

### Background Gradient

**Component:** Page Background (root container)

**Current:**
```tsx
className="min-h-screen bg-gradient-to-b from-[#1a1625] via-[#2a1f3d] to-[#1a1625]"
```

**Purple Theme Examples:**
```tsx
// Darker purple gradient
className="min-h-screen bg-gradient-to-b from-[#0f0d15] via-[#1a1625] to-[#0f0d15]"

// Lighter purple (more visible)
className="min-h-screen bg-gradient-to-b from-[#2a1f3d] via-[#3a2f4d] to-[#2a1f3d]"

// Three-tone gradient
className="min-h-screen bg-gradient-to-b from-[#1a1625] via-[#2d2640] to-[#1a1625]"
```

### Search Bar Colors

**Component:** Hero Search Bar input field

**Current Purple Theme:**
```tsx
className="w-full py-4 pl-12 pr-4 bg-[#2d2640] border border-[#443a5c] rounded-md text-base text-white placeholder-gray-500 focus:outline-none focus:border-[#6b5a8a] focus:ring-2 focus:ring-[#6b5a8a]/30 transition-all"
```

**Purple Theme Color Breakdown:**
- `bg-[#2d2640]` - Card background purple
- `border-[#443a5c]` - Default border purple
- `focus:border-[#6b5a8a]` - Interactive border purple when focused
- `focus:ring-[#6b5a8a]/30` - Purple glow effect (30% opacity)

**Purple Theme Variations:**
```tsx
// Lighter background (more prominent)
bg-[#3a3050]

// Brighter focus (more visible interaction)
focus:border-[#8b7aaa]

// Stronger glow effect
focus:ring-[#6b5a8a]/50

// Alternative: gradient border on focus
focus:border-[#8b7aaa] focus:ring-[#8b7aaa]/40
```

---

## Animation Customization

### Hero Text Animation Speed

**Component:** Hero Heading animation

**Current:**
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
```

**Examples:**
```tsx
// Faster animation
transition={{ duration: 0.3 }}

// Slower animation
transition={{ duration: 1.2 }}

// Add bounce effect
transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
```

### Button Hover Effects

**Component:** Quick Action Buttons

**Current Purple Theme:**
```tsx
className="bg-[#2d2640] hover:bg-[#3a3050] border-[#443a5c] text-white"
```

**Purple Theme Examples:**
```tsx
// Brighter purple hover
hover:bg-[#4a4060]

// Subtle border highlight on hover
hover:border-[#6b5a8a]

// Add scale effect with Framer Motion
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}

// Purple gradient hover effect
hover:bg-gradient-to-r hover:from-[#8b7aaa] hover:to-[#6b5a8a]
```

---

## Layout Adjustments

### Hero Section Height

**Component:** Hero Section container

**Current:**
```tsx
className="relative min-h-[70vh] flex items-center justify-center px-4 py-20"
```

**Examples:**
```tsx
// Taller hero
min-h-[85vh]

// Shorter hero
min-h-[60vh]

// Full screen hero
min-h-screen
```

### Content Width

**Component:** Hero Section content wrapper

**Current:**
```tsx
className="w-full max-w-3xl mx-auto text-center"
```

**Examples:**
```tsx
// Wider content
max-w-4xl

// Narrower content
max-w-2xl

// Much wider
max-w-6xl
```

---

## Advanced: Recent Decks Grid

**Component:** Recent Decks Section grid layout

**Current:** 5 columns on large screens
```tsx
className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
```

**Examples:**
```tsx
// 4 columns on large screens
grid-cols-2 md:grid-cols-3 lg:grid-cols-4

// 6 columns on large screens
grid-cols-2 md:grid-cols-4 lg:grid-cols-6

// Larger gaps
gap-6
```

### Number of Deck Cards Shown

**Component:** Recent Decks cards array

**Current:** Shows 5 placeholder decks
```tsx
{[1, 2, 3, 4, 5].map((deck) => (
```

**Examples:**
```tsx
// Show 8 decks
{[1, 2, 3, 4, 5, 6, 7, 8].map((deck) => (

// Show 3 decks
{[1, 2, 3].map((deck) => (
```

---

## Tips for Safe Editing

1. **Always keep a backup** - Copy the file before making changes
2. **Test one change at a time** - Easier to find issues
3. **Maintain purple theme consistency** - Use colors from the purple palette
4. **Keep the file structure** - Don't remove closing tags `</div>`, `</section>`, etc.
5. **Preserve className syntax** - Always keep quotes around class names
6. **Check browser console** - Press F12 in browser to see errors
7. **Use hard refresh** - Press ⌘⇧R (Mac) or Ctrl⇧R (Windows) to see changes

---

## Common Issues

### Changes Not Appearing?
1. Hard refresh browser: ⌘⇧R (Mac) or Ctrl⇧R (Windows)
2. Clear browser cache: Safari → Clear History
3. Restart dev server: `killall node && npm run dev`

### Page Looks Broken?
1. Check browser console for errors (F12)
2. Look for mismatched quotes or missing closing tags
3. Restore from backup and try again

### Colors Look Wrong?
- Hex colors must start with `#` and be in brackets: `[#1a1625]`
- Use Tailwind color names for standard colors: `text-white`, `bg-purple-600`
- **Stay within the purple theme** - Use the purple palette colors for consistency
- Avoid using blue, cyan, or green for primary UI elements (they're reserved for status indicators)

---

## Need More Help?

- **Tailwind CSS Documentation**: https://tailwindcss.com/docs
- **Framer Motion (animations)**: https://www.framer.com/motion/
- **Color Picker Tool**: https://coolors.co/ (for finding hex colors)
- **Gradient Generator**: https://cssgradient.io/ (for creating gradients)

---

## Quick Reference: Common Tailwind Classes

### Text Sizes
- `text-xs` - Extra small
- `text-sm` - Small
- `text-base` - Normal (16px)
- `text-lg` - Large
- `text-xl` - Extra large
- `text-2xl` - 2x large
- `text-4xl` - 4x large

### Colors
- `text-white`, `text-gray-300`, `text-gray-500`
- `bg-purple-600`, `bg-blue-600`, `bg-green-600`
- `border-gray-300`, `border-purple-500`

### Spacing
- `mb-4` - Margin bottom (4 units)
- `mt-8` - Margin top (8 units)
- `px-4` - Padding left/right (4 units)
- `py-8` - Padding top/bottom (8 units)
- `gap-4` - Gap between grid/flex items

### Layout
- `flex` - Flexbox container
- `grid` - Grid container
- `grid-cols-3` - 3 column grid
- `gap-4` - Gap between items
- `mx-auto` - Center horizontally
- `text-center` - Center text
