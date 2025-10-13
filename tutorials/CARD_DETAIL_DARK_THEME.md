# Card Detail Page - Dark Theme Update Guide

This is a summary of the changes needed to convert CardDetailClient.tsx to dark theme.

## Color Mappings

### Text Colors
- `text-gray-900` → `text-white`
- `text-gray-700` → `text-gray-300`
- `text-gray-600` → `text-gray-400`
- `text-gray-500` → `text-gray-400`
- `text-gray-400` → `text-gray-500`

### Background Colors
- `bg-white` → `bg-gray-900`
- `bg-gray-50` → `bg-gray-800`
- `bg-gray-100` → `bg-gray-700`
- Card backgrounds → `bg-gray-800 border-gray-700`

### Accent Colors (keep as is or adjust)
- Green sections (`bg-green-50`) → `bg-green-900/20`
- Blue sections (`bg-blue-50`) → `bg-blue-900/20`
- Purple sections (`bg-purple-50`) → `bg-purple-900/20`

### Interactive Elements
- Hover states: add `hover:text-cyan-400` for links
- Buttons: use `variant="cyber"` instead of `variant="primary"`
- Borders: `border-gray-700` instead of `border-gray-200/300`

## Specific Sections to Update

1. **Breadcrumb** (line 137-145) - Done ✓
2. **Card Header** (line 147-160) - Done ✓
3. **Card Information Card** (line 184-313)
4. **Description Card** (line 315-325)
5. **Official Text Card** (line 327-346)
6. **Abilities Card** (line 348-399)
7. **Keywords Card** (line 401-417)
8. **Rulings Card** (line 419-511)
9. **Card Metadata** (line 513-592)
10. **Action Buttons** (line 596-612)

## Quick Find & Replace Patterns

1. All `Card` components need dark styling
2. All label text needs to be `text-gray-400` instead of `text-gray-700`
3. All value text needs to be `text-white` instead of `text-gray-900`
4. All input/select elements need dark backgrounds and borders

This file is too large to edit efficiently in one go. Would recommend using the modal overlay approach instead or implementing a dark mode toggle.
