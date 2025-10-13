# Gundam Card Game Website - Anatomy Guide

This document provides a comprehensive reference for all UI components and their proper terminology used throughout the Gundam Card Game website.

## Table of Contents
1. [Global Components](#global-components)
2. [Home Page](#home-page)
3. [Cards Page](#cards-page)
4. [Card Detail Overlay](#card-detail-overlay)
5. [Common Patterns](#common-patterns)

---

## Global Components

These components appear across multiple or all pages of the website.

### Header / Navigation Bar
**Location**: Top of every page
**File**: `src/app/layout.tsx`, `src/components/navigation/Navbar.tsx`

Components within the header:
- **Logo/Site Title**: "Gundam Card Game" text on the left
- **Navigation Links**: Horizontal menu items (Home, Cards, Decks, Compare, etc.)
- **PWA Status Indicator**: Green dot showing online/offline status
- **Auth Buttons**: "SIGN IN" and "SIGN UP" buttons
- **Mobile Menu**: Hamburger menu for mobile devices

### Footer
**Location**: Bottom of every page
**File**: `src/components/layout/LegalComplianceFooter.tsx`

Components:
- **Copyright Information**: Legal disclaimer about Bandai Namco
- **Non-Affiliation Statement**: Clarifies unofficial status
- **Legal Links**: Terms, Privacy Policy, etc.

---

## Home Page

**Route**: `/`
**File**: `src/app/page.tsx`

### Hero Section
**Location**: Top center of home page, immediately below header
**File**: `src/app/page.tsx` (lines with large heading)

Components:
- **Hero Heading**: Large text "Gundam Card Game is a powerful card search"
- **Hero Search Bar**: Main search input with search icon
- **Quick Action Buttons**: Row of action buttons below search
  - ADVANCED SEARCH
  - DECK BUILDER
  - ALL SETS
  - RANDOM CARD

### Announcements Section
**Location**: Below hero section
**File**: `src/app/page.tsx`

Components:
- **Announcement Items**: Individual news items with badges
- **NEW Badge**: Colored badges (orange/blue) indicating new content
- **Announcement Text**: Description of the update

### Content Sections
**Location**: Main body of home page

Common sections include:
- **Recent Decks**: Horizontal carousel of deck previews
- **Popular Cards**: Grid of trending cards
- **Featured Sets**: Showcase of latest card sets
- **Section Heading**: Title of each content section
- **View All Link**: "View recent decks →" style navigation links

---

## Cards Page

**Route**: `/cards`
**File**: `src/app/cards/NewCardsPageClient.tsx`

### Search Header
**Location**: Top of cards page
**Components**:
- **Search Input**: Text field with magnifying glass icon
- **Search Button**: "Search" or "SEARCH" button
- **Search Icon Bubble**: Circular purple gradient icon with search symbol

### Filter Bar
**Location**: Below search header
**File**: `src/app/cards/NewCardsPageClient.tsx` (lines 141-200)

Components:
- **Color Filters**: Row of colored circle buttons
  - Blue, Green, Red, Purple, White, Yellow, Colorless
- **Divider**: Vertical separator line
- **Type Filters**: Button group for card types
  - Unit, Command, Base, Pilot buttons
- **Quick Action Buttons**:
  - 📚 Sets button
  - 🎲 Random button
- **View Toggle**: Grid/List view icons

### Sort Bar
**Location**: Below filter bar
**File**: `src/app/cards/NewCardsPageClient.tsx` (lines 203-230)

Components:
- **Sort Label**: "Sort by:" text
- **Sort Dropdown**: Select menu with options
  - Name (A-Z)
  - Cost (Low to High)
  - Level (Low to High)
  - Attack (High to Low)
  - Recently Added
- **Results Count**: "X cards found" display

### Card Grid
**Location**: Main content area
**File**: `src/components/card/CardGrid.tsx`

Components:
- **Card Items**: Individual card previews in grid layout
  - Card Image
  - Card Name overlay
  - Level badge (e.g., "Lv 2")
  - Rarity indicator (colored dot)
  - Card number (e.g., "card-001")
- **Grid Layout**: 5 cards per row on desktop, responsive down to 2 on mobile

### Pagination Controls
**Location**: Top and bottom of card grid
**File**: `src/app/cards/NewCardsPageClient.tsx` (lines 234-304)

Components:
- **Previous Button**: "← Previous" navigation
- **Page Display**: "1 / 5" style current page indicator
- **Next Button**: "Next →" navigation
- **Page Counter**: "Page 1 of 5" text

---

## Card Detail Overlay

**Route**: Opens as modal on card click
**File**: `src/components/card/CardDetailOverlay.tsx`

### Overlay Structure

#### Header
**Location**: Top of modal, sticky
Components:
- **Card Name**: Large title text
- **Close Button**: X icon button

#### Content Layout
**Layout**: Two-column grid

##### Left Column - Card Image
Components:
- **Card Image Display**: Large card preview with 5:7 aspect ratio
- **Image Placeholder**: Icon shown when no image available

##### Right Column - Card Information

**Sections (top to bottom)**:

1. **Badge Row**
   - Rarity Badge (Yellow/Red/Purple/Gray)
   - Type Badge (Blue)
   - Faction Badge (Green)

2. **Stats Grid** (2-column)
   - Cost box
   - Level box
   - Attack box
   - Defense box

3. **Set Information** (conditional)
   - Series
   - Set name
   - Card number

4. **Card Text** (conditional)
   - Description/effect text

5. **Mobile Suit Information** (conditional)
   - Pilot name
   - Mobile suit model

6. **Abilities** (conditional)
   - Ability badges in flex-wrap layout

7. **Action Buttons**
   - "Add to Deck" button (cyan gradient)
   - "Add to Collection" button (outline style)

---

## Common Patterns

### Buttons

#### Primary Button
- **Style**: Cyan/purple gradient background
- **Usage**: Main call-to-action
- **Example**: "SEARCH", "ADD TO DECK"

#### Secondary Button
- **Style**: Outline with border
- **Usage**: Alternative actions
- **Example**: "ADD TO COLLECTION"

#### Filter Button
- **Style**: Dark background with hover effect
- **Usage**: Toggle filters on/off
- **Example**: "Unit", "Command", "Base"

### Badges

#### Rarity Badges
- **Colors**:
  - Yellow: Rare
  - Red: Super Rare
  - Purple: Ultra Rare
  - Gray: Uncommon/Common

#### Type Badges
- **Color**: Blue
- **Usage**: Card type identification

#### NEW Badges
- **Colors**:
  - Orange: Major announcements
  - Blue: Standard updates
- **Usage**: Highlight new content

### Cards

#### Card Preview (Grid View)
Components:
- Card image background
- Card name text overlay (bottom)
- Level badge (top left)
- Rarity indicator dot (bottom right)
- Card number (below card)

#### Card Stats Box
Style: Dark gray background with border
Layout: Label on top, value below
Text: Small gray label, large white number

---

## Color Palette

### Primary Theme Colors
- **Background Primary**: `#1a1625`
- **Background Secondary**: `#2a1f3d`
- **Card Background**: `#2d2640`
- **Border Primary**: `#443a5c`
- **Border Hover**: `#6b5a8a`
- **Accent Primary**: `#6b5a8a`
- **Accent Hover**: `#8b7aaa`

### Status Colors
- **Online**: Green (`#22c55e`)
- **Offline**: Red (`#ef4444`)
- **Warning**: Yellow (`#eab308`)

---

## Responsive Breakpoints

### Grid Layouts
- **Mobile** (< 640px): 2 cards per row
- **Small** (640px+): 3 cards per row
- **Medium** (768px+): 4 cards per row
- **Large** (1024px+): 5 cards per row

### Navigation
- **Desktop** (768px+): Horizontal navigation bar
- **Mobile** (< 768px): Hamburger menu

---

## File Reference

### Key Component Files
```
src/
├── app/
│   ├── layout.tsx                 # Root layout with header/footer
│   ├── page.tsx                   # Home page with hero section
│   └── cards/
│       ├── page.tsx              # Cards page wrapper
│       └── NewCardsPageClient.tsx # Cards page main component
├── components/
│   ├── card/
│   │   ├── CardGrid.tsx          # Card grid layout
│   │   └── CardDetailOverlay.tsx # Card detail modal
│   ├── navigation/
│   │   ├── Navbar.tsx            # Main navigation
│   │   └── MobileMenu.tsx        # Mobile navigation
│   └── layout/
│       └── LegalComplianceFooter.tsx # Footer component
```

---

## Usage Examples

### Referring to Components

**Good**:
- "Update the Hero Section heading text"
- "Change the color of the Search Header icon"
- "Add a new badge to the Filter Bar"
- "Adjust spacing in the Card Grid"
- "Modify the Close Button in the Card Detail Overlay"

**Avoid**:
- "The big text at the top" → Use "Hero Heading"
- "The search thing" → Use "Search Bar" or "Search Input"
- "The card popup" → Use "Card Detail Overlay"
- "The menu bar" → Use "Navigation Bar" or "Header"

---

## Quick Reference Chart

| What You See | Proper Term | Location |
|--------------|-------------|----------|
| "Gundam Card Game" (top left) | Logo/Site Title | Header |
| Home, Cards, Decks links | Navigation Links | Navigation Bar |
| Large heading on home | Hero Heading | Hero Section |
| Search box on home | Hero Search Bar | Hero Section |
| ADVANCED SEARCH button | Quick Action Button | Hero Section |
| NEW badge | Announcement Badge | Announcements Section |
| Colored circles | Color Filter Buttons | Filter Bar |
| Grid/List icons | View Toggle | Filter Bar |
| "Sort by:" dropdown | Sort Dropdown | Sort Bar |
| Individual card in grid | Card Preview | Card Grid |
| Card popup window | Card Detail Overlay | Modal |
| "Add to Deck" button | Primary Action Button | Card Detail Overlay |
| X button (top right) | Close Button | Overlay Header |

---

*Last Updated: 2025-10-13*
