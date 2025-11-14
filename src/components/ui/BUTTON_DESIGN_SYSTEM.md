# Button Design System

## Design Philosophy

The Gundam Card Game website uses **two primary color schemes** for buttons:

- **Cyan/Blue**: Technical, functional actions - the primary brand color for interactive elements
- **Purple**: Theme/brand decorative elements - used for navigation and contextual CTAs

**Shadow/Glow Philosophy**: Reserved for **critical actions only** (Save, Submit, Sign In, Purchase). Most buttons use subtle shadows for depth without drawing excessive attention.

---

## Button Variants

### Cyan/Blue Variants (Primary - Tech-Focused)

#### `variant="default"` or `variant="primary"`

**Use For**: Standard primary actions across the site
**Visual**: Cyan-to-blue gradient, white text
**Shadow**: Subtle cyan glow (emphasis="normal")

```tsx
<Button variant="default">Add to Deck</Button>
<Button>Search Cards</Button> // defaults to variant="default"
```

**Examples**:

- "Add to Deck" buttons
- "Add to Collection" buttons
- "Apply Filters" in search
- "Load More" pagination
- General form submissions (non-critical)

---

#### `variant="critical"`

**Use For**: Critical CTAs that require user attention
**Visual**: Cyan-to-blue gradient with **enhanced glow**
**Shadow**: Strong cyan glow (always high emphasis)

```tsx
<Button variant="critical">Sign In</Button>
<Button variant="critical">Save Deck</Button>
```

**Examples**:

- Sign In / Sign Up buttons
- Save / Update buttons in forms
- Create Account
- Confirm Purchase
- Delete confirmations (use with caution, consider destructive instead)

**Note**: This variant has built-in high emphasis and doesn't need `emphasis="high"`

---

#### `variant="outline"`

**Use For**: Secondary actions, cancel buttons, less prominent options
**Visual**: Transparent with cyan border, fills on hover
**Shadow**: Subtle cyan glow

```tsx
<Button variant="outline">Cancel</Button>
<Button variant="outline">View Details</Button>
```

**Examples**:

- Cancel/Back buttons
- "View More" / "See Details"
- Alternative actions in button groups
- Less important secondary options

---

### Purple Variants (Theme/Brand)

#### `variant="brand"`

**Use For**: Theme-related CTAs, decorative actions, dashboard navigation
**Visual**: Purple gradient (#8b7aaa to #6b5a8a), white text
**Shadow**: Subtle purple glow

```tsx
<Button variant="brand">Build New Deck</Button>
<Button variant="brand">Explore Collection</Button>
```

**Examples**:

- "Build New Deck" - Dashboard CTA
- "View Dashboard" when context requires purple theme
- Hero section CTAs
- Feature highlight buttons
- Tab navigation (active state)

---

#### `variant="brandOutline"`

**Use For**: Secondary brand actions, purple-themed navigation
**Visual**: Transparent with purple border, fills purple on hover
**Shadow**: Subtle purple glow

```tsx
<Button variant="brandOutline">My Decks</Button>
<Button variant="brandOutline">Back to Dashboard</Button>
```

**Examples**:

- Secondary navigation in purple-themed sections
- Outline style where brand color is appropriate
- Less prominent decorative CTAs

---

### Other Variants

#### `variant="destructive"`

**Use For**: Dangerous/irreversible actions
**Visual**: Red gradient, white text
**Shadow**: Subtle red glow, or strong with `emphasis="high"`

```tsx
<Button variant="destructive">Delete</Button>
<Button variant="destructive" emphasis="high">Delete Account</Button>
```

---

#### `variant="secondary"`

**Use For**: Tertiary actions, less important options
**Visual**: Gray gradient, white text
**Shadow**: Minimal gray shadow

```tsx
<Button variant="secondary">Skip</Button>
```

---

#### `variant="ghost"`

**Use For**: Minimal-emphasis text buttons
**Visual**: Cyan text only, transparent background
**Shadow**: None (subtle background on hover)

```tsx
<Button variant="ghost">Learn More</Button>
```

---

#### `variant="link"`

**Use For**: Inline text links with button behavior
**Visual**: Cyan text with underline on hover
**Shadow**: None

```tsx
<Button variant="link">Terms of Service</Button>
```

---

### Special Effect Variants

#### `variant="cyber"`

**Use For**: Tech/futuristic features, advanced tools
**Visual**: Cyan-to-purple gradient with animated shimmer
**Shadow**: Cyan glow with animation

```tsx
<Button variant="cyber">Advanced Search</Button>
```

---

#### `variant="neon"`

**Use For**: Special green-themed features
**Visual**: Green border with hover fill, animated glow
**Shadow**: Green neon glow

```tsx
<Button variant="neon">Live Match</Button>
```

---

#### `variant="plasma"`

**Use For**: Special purple/orange-themed features
**Visual**: Purple-to-orange gradient with animated effects
**Shadow**: Purple glow with animation

```tsx
<Button variant="plasma">Premium Feature</Button>
```

---

#### `variant="hologram"`

**Use For**: Futuristic/special state indicators
**Visual**: Transparent cyan with holographic animation
**Shadow**: Cyan glow with animation

```tsx
<Button variant="hologram">Holographic View</Button>
```

---

## Emphasis Prop

Controls the intensity of shadow/glow effects. **Use sparingly** - most buttons should use default `emphasis="normal"`.

### `emphasis="high"`

**Use For**: Critical CTAs that need maximum attention
**Effect**: Enhanced shadow glow (2xl shadow)

```tsx
<Button variant="default" emphasis="high">Save Changes</Button>
<Button variant="brand" emphasis="high">Start Now</Button>
<Button variant="destructive" emphasis="high">Delete Forever</Button>
```

**When to Use**:

- Form submission buttons (Save, Submit, Create)
- Authentication (Sign In, Sign Up, Reset Password)
- Purchase/payment buttons
- Primary hero CTAs
- Irreversible actions requiring attention

---

### `emphasis="normal"` (default)

**Use For**: Most buttons across the site
**Effect**: Subtle shadow glow (lg shadow)

```tsx
<Button>Add to Deck</Button>
<Button emphasis="normal">Search</Button> // explicit, but redundant
```

**When to Use**:

- Standard primary actions
- Secondary actions
- Most interactive elements
- Default for all buttons

---

### `emphasis="low"`

**Use For**: Minimal visual weight buttons
**Effect**: No shadow/glow

```tsx
<Button variant="secondary" emphasis="low">
  Skip
</Button>
```

**When to Use**:

- Very subtle tertiary actions
- Buttons that shouldn't draw attention
- Dense UI areas where shadows would be overwhelming

---

## Size Prop

```tsx
size = 'sm'; // Small: 8px height, 3px padding, xs text
size = 'md'; // Medium: 10px height, 5px padding, sm text
size = 'default'; // Default: 11px height, 6px padding, sm text
size = 'lg'; // Large: 12px height, 8px padding, base text
size = 'xl'; // Extra Large: 14px height, 10px padding, lg text
size = 'icon'; // Square: 11px x 11px for icon-only buttons
```

---

## Decision Tree

### When should I use Cyan vs Purple?

```
Is this a functional action? (Add, Save, Search, Filter, etc.)
├─ YES → Use Cyan (default, primary, outline)
└─ NO → Is it decorative/navigational in a themed section?
    ├─ YES → Use Purple (brand, brandOutline)
    └─ NO → Use Cyan (default)
```

### When should I use high emphasis?

```
Is this a critical action? (Auth, Save, Purchase, Delete)
├─ YES → Is it the PRIMARY action on the page?
│   ├─ YES → Use emphasis="high" or variant="critical"
│   └─ NO → Use normal emphasis
└─ NO → Use normal emphasis
```

### Which variant for my use case?

| Use Case                   | Variant                                     | Emphasis |
| -------------------------- | ------------------------------------------- | -------- |
| Add card to deck           | `default`                                   | `normal` |
| Save deck                  | `critical` or `default` + `emphasis="high"` | -        |
| Sign in                    | `critical`                                  | -        |
| Cancel action              | `outline`                                   | `normal` |
| Build new deck (Dashboard) | `brand`                                     | `normal` |
| Delete card                | `destructive`                               | `normal` |
| Delete account             | `destructive`                               | `high`   |
| Back button                | `outline` or `secondary`                    | `normal` |
| Advanced search            | `cyber`                                     | -        |
| View more details          | `outline` or `ghost`                        | `normal` |

---

## Examples by Page Context

### Auth Pages

```tsx
<Button variant="critical">Sign In</Button>
<Button variant="outline">Cancel</Button>
<Button variant="link">Forgot Password?</Button>
```

### Deck Builder

```tsx
<Button>Add Card</Button>                        // default variant
<Button emphasis="high">Save Deck</Button>       // critical save action
<Button variant="outline">Cancel</Button>
<Button variant="outline">Export</Button>
<Button variant="secondary">New Deck</Button>
```

### Dashboard/Landing

```tsx
<Button variant="brand">Build New Deck</Button>  // purple themed
<Button variant="brand">View Collection</Button>
<Button variant="outline">Browse Cards</Button>
```

### Admin Forms

```tsx
<Button emphasis="high">Create Card</Button>     // critical action
<Button variant="outline">Cancel</Button>
<Button variant="destructive">Delete</Button>
```

### Card Search

```tsx
<Button>Search</Button>                          // primary action
<Button variant="cyber">Advanced Filters</Button> // special feature
<Button variant="outline">Reset</Button>
```

---

## Anti-Patterns (DON'T DO THIS)

❌ **Don't override button colors with custom className**

```tsx
// BAD
<Button className="bg-purple-500">Save</Button>
<Button variant="outline" className="border-purple-500 text-purple-500">Cancel</Button>
```

✅ **Use the appropriate variant instead**

```tsx
// GOOD
<Button variant="brand">Save</Button>
<Button variant="brandOutline">Cancel</Button>
```

---

❌ **Don't use high emphasis everywhere**

```tsx
// BAD - too many high-emphasis buttons
<Button emphasis="high">View</Button>
<Button emphasis="high">Edit</Button>
<Button emphasis="high">Delete</Button>
```

✅ **Reserve high emphasis for critical actions**

```tsx
// GOOD - only the primary action gets emphasis
<Button>View</Button>
<Button>Edit</Button>
<Button variant="destructive" emphasis="high">Delete</Button>
```

---

❌ **Don't mix cyan and purple randomly**

```tsx
// BAD - inconsistent color usage
<Button variant="brand">Search</Button>      // purple for functional action
<Button variant="default">Build Deck</Button> // cyan for themed CTA
```

✅ **Follow the color guidelines**

```tsx
// GOOD
<Button variant="default">Search</Button>    // cyan for functional
<Button variant="brand">Build Deck</Button>  // purple for themed
```

---

## Migration Guide

If you're updating existing buttons:

1. **Remove custom className color overrides**
   - Replace `className="bg-gradient-to-r from-[#8b7aaa]..."` with `variant="brand"`
   - Replace `className="border-[#8b7aaa] text-[#8b7aaa]..."` with `variant="brandOutline"`

2. **Identify button purpose**
   - Functional action → Use cyan variants (default, outline)
   - Themed/decorative → Use purple variants (brand, brandOutline)
   - Critical action → Add `emphasis="high"` or use `variant="critical"`

3. **Remove manual shadow implementations**
   - Delete `className="shadow-lg shadow-[color]/30"` - this is now automatic
   - The variant handles shadows appropriately

4. **Update focus states**
   - Remove custom `focus:ring-[color]` - focus rings now match the variant color

---

## Accessibility Notes

- All buttons have proper focus rings that match their color scheme
- Focus rings have 2px width with offset for visibility
- Disabled state reduces opacity to 50% and removes pointer events
- Loading state shows spinner and disables interaction
- Proper contrast ratios maintained (WCAG AA compliant)

---

## Questions?

If you're unsure which variant to use:

1. Check the decision tree above
2. Look for similar patterns in existing pages
3. Default to `variant="default"` with `emphasis="normal"` - it's the safest choice
4. Consult the design system or team lead for special cases
