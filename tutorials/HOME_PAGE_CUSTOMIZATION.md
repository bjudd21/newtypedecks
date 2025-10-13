# Home Page Customization Guide

This guide shows you how to easily customize the home page (`src/app/page.tsx`) without breaking anything.

## File Location
`/Users/mkv/Documents/Projects/GCG/src/app/page.tsx`

---

## Easy Customizations

### 1. Change the Main Heading Text

**Location:** Lines 26-33

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

**Location:** Line 53

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

**Location:** Lines 66-86

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

**Location:** Lines 95-106

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

**Location:** Line 115

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

**Location:** Lines 155-190

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

## Color Customization

### Background Gradient

**Location:** Line 21

**Current:**
```tsx
className="min-h-screen bg-gradient-to-b from-[#1a1625] via-[#2a1f3d] to-[#1a1625]"
```

**Examples:**
```tsx
// Darker purple gradient
className="min-h-screen bg-gradient-to-b from-[#0f0d15] via-[#1a1625] to-[#0f0d15]"

// Blue-purple gradient
className="min-h-screen bg-gradient-to-b from-[#1a1b2e] via-[#2a1f3d] to-[#1a1b2e]"

// Lighter purple
className="min-h-screen bg-gradient-to-b from-[#2a1f3d] via-[#3a2f4d] to-[#2a1f3d]"
```

### Search Bar Colors

**Location:** Line 54

**Current:**
```tsx
className="w-full py-4 pl-12 pr-4 bg-[#2d2640] border border-[#443a5c] rounded-md text-base text-white placeholder-gray-500 focus:outline-none focus:border-[#6b5a8a] focus:ring-2 focus:ring-[#6b5a8a]/30 transition-all"
```

**Color meanings:**
- `bg-[#2d2640]` - Background color
- `border-[#443a5c]` - Border color
- `focus:border-[#6b5a8a]` - Border color when focused
- `focus:ring-[#6b5a8a]/30` - Glow effect when focused

**Examples:**
```tsx
// Lighter background
bg-[#3a3050]

// Brighter focus border
focus:border-[#8b7aaa]

// Stronger glow effect
focus:ring-[#6b5a8a]/50
```

---

## Animation Customization

### Hero Text Animation Speed

**Location:** Lines 26-33

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

**Location:** Lines 67, 72, 77, 82

**Current:**
```tsx
className="bg-[#2d2640] hover:bg-[#3a3050] border-[#443a5c] text-white"
```

**Examples:**
```tsx
// Brighter hover
hover:bg-[#4a4060]

// Add scale effect (requires adding to motion component)
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

---

## Layout Adjustments

### Hero Section Height

**Location:** Line 23

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

**Location:** Line 24

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

**Location:** Line 121

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

**Location:** Line 122

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
3. **Keep the file structure** - Don't remove closing tags `</div>`, `</section>`, etc.
4. **Preserve className syntax** - Always keep quotes around class names
5. **Check browser console** - Press F12 in browser to see errors
6. **Use hard refresh** - Press ⌘⇧R (Mac) or Ctrl⇧R (Windows) to see changes

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
