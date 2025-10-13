# Card Import Guide

This guide explains how to import card images and provide card information for display in the Gundam Card Game website.

## Table of Contents
1. [Card Images](#card-images)
2. [Card Data Format](#card-data-format)
3. [Providing Card Information](#providing-card-information)
4. [Bulk Import Templates](#bulk-import-templates)
5. [Examples](#examples)

---

## Card Images

### Image Specifications

**Recommended Format**:
- **File Type**: PNG or JPG
- **Aspect Ratio**: 5:7 (card standard)
- **Recommended Dimensions**:
  - Original: 750 x 1050 pixels (minimum)
  - Large: 600 x 840 pixels
  - Small: 300 x 420 pixels
  - Thumbnail: 150 x 210 pixels
- **File Size**: Under 2MB per image
- **Quality**: High resolution, clear text

### File Naming Convention

Use the card's set number for consistency:

```
[SET_CODE]-[CARD_NUMBER].[extension]

Examples:
ST01-001.png
ST01-002.jpg
BT-01-045.png
PR-001.png
```

**Format Breakdown**:
- `SET_CODE`: Set identifier (ST01, BT-01, PR, etc.)
- `CARD_NUMBER`: Card number within the set (001, 002, etc.)
- Use leading zeros for numbers (001, not 1)

### File Location

Place card images in one of these locations:

**Option 1 - Public Directory** (Development/Testing):
```
public/images/cards/
  ├── ST01-001.png
  ├── ST01-002.png
  └── ST01-003.png
```

**Option 2 - Organized by Set**:
```
public/images/cards/
  ├── ST01/
  │   ├── ST01-001.png
  │   ├── ST01-002.png
  │   └── ST01-003.png
  ├── BT-01/
  │   ├── BT-01-001.png
  │   └── BT-01-002.png
  └── PR/
      └── PR-001.png
```

**Option 3 - External URL**:
- You can also provide external URLs (e.g., from Cloudinary, AWS S3, or any CDN)
- Just provide the full URL when submitting card data

### Image Sizes

The system can handle multiple image sizes automatically:
- **imageUrl**: Main/original image (required)
- **imageUrlSmall**: Small thumbnail (optional)
- **imageUrlLarge**: Large display (optional)

If you only provide the main image, the system will use it for all sizes.

---

## Card Data Format

### Required Fields

These fields are **required** for every card:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `name` | String | Card name | "Char Aznable" |
| `setNumber` | String | Card number in set | "ST01-002" |
| `imageUrl` | String | Path or URL to image | "/images/cards/ST01-002.png" |
| `typeId` | String | Card type ID | "character" |
| `rarityId` | String | Rarity ID | "uncommon" |
| `setId` | String | Set ID | "st01" |

### Optional Fields

These fields are **optional** but recommended:

#### Game Stats
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `level` | Number | Card level | 2 |
| `cost` | Number | Play cost | 1 |
| `clashPoints` | Number | Clash Points (CP) | 5 |
| `price` | Number | Price to play | 2 |
| `hitPoints` | Number | Hit Points (HP) | 4 |
| `attackPoints` | Number | Attack Points (AP) | 3 |

#### Character/Lore Information
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `faction` | String | Faction/Group | "Principality of Zeon" |
| `pilot` | String | Pilot name | "Char Aznable" |
| `model` | String | Mobile suit model | "MS-06S" |
| `series` | String | Anime series | "UC" |
| `nation` | String | Nation affiliation | "Principality of Zeon" |

#### Card Text
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `description` | String | Card effect/flavor text | "The Red Comet, Char Aznable." |
| `officialText` | String | Official card text | "When this card attacks..." |
| `abilities` | String (JSON) | Special abilities | '["Quick", "Pierce"]' |
| `keywords` | Array | Searchable keywords | ["ace", "zeon", "commander"] |
| `tags` | Array | Categorization tags | ["red-comet", "antagonist"] |

#### Metadata
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `isFoil` | Boolean | Is foil version? | false |
| `isPromo` | Boolean | Is promo card? | false |
| `isAlternate` | Boolean | Is alternate art? | false |
| `language` | String | Card language | "en" |

---

## Providing Card Information

### Method 1: Single Card JSON Format

When providing information for a **single card**, use this format:

```json
{
  "name": "Char Aznable",
  "setNumber": "ST01-002",
  "imageUrl": "/images/cards/ST01-002.png",
  "typeId": "character",
  "rarityId": "uncommon",
  "setId": "st01",
  "level": 2,
  "cost": 1,
  "description": "The Red Comet, Char Aznable.",
  "faction": "Principality of Zeon",
  "pilot": "Char Aznable",
  "series": "UC",
  "keywords": ["ace", "zeon", "commander"],
  "tags": ["red-comet", "antagonist"]
}
```

### Method 2: Simplified Text Format

For quick communication, you can use this simplified format:

```
Card Name: Char Aznable
Set/Number: ST01-002
Image: /images/cards/ST01-002.png
Type: Character
Rarity: Uncommon
Level: 2
Cost: 1
Description: The Red Comet, Char Aznable.
Faction: Principality of Zeon
Pilot: Char Aznable
Series: UC
Keywords: ace, zeon, commander
```

### Method 3: Markdown Table

For multiple cards, you can use a markdown table:

```markdown
| Name | Set/Number | Type | Rarity | Level | Cost | Image |
|------|------------|------|--------|-------|------|-------|
| Char Aznable | ST01-002 | Character | Uncommon | 2 | 1 | ST01-002.png |
| Amuro Ray | ST01-001 | Character | Uncommon | 2 | 1 | ST01-001.png |
| RX-78-2 Gundam | ST01-003 | Unit | Rare | 3 | 2 | ST01-003.png |
```

Then provide additional details separately for each card.

### Method 4: Natural Language

You can also describe cards naturally, and I'll extract the information:

> "I have a new card to add. It's called **Char Aznable**, card number **ST01-002**.
> It's a **Character** type card with **Uncommon** rarity from the **ST01** set.
> The card is **Level 2** with a **cost of 1**.
> The description says 'The Red Comet, Char Aznable.'
> It belongs to the **Principality of Zeon** faction.
> The image is located at `/images/cards/ST01-002.png`."

---

## Bulk Import Templates

### CSV Template

For importing **multiple cards** at once, use this CSV format:

**File**: `cards-import.csv`

```csv
name,setNumber,imageUrl,type,rarity,set,level,cost,description,faction,pilot,model,series,keywords,tags
"Char Aznable","ST01-002","/images/cards/ST01-002.png","Character","Uncommon","ST01",2,1,"The Red Comet, Char Aznable.","Principality of Zeon","Char Aznable","","UC","ace,zeon,commander","red-comet,antagonist"
"Amuro Ray","ST01-001","/images/cards/ST01-001.png","Character","Uncommon","ST01",2,1,"The hero of the One Year War.","Earth Federation","Amuro Ray","","UC","ace,federation,gundam-pilot","white-base,protagonist"
"RX-78-2 Gundam","ST01-003","/images/cards/ST01-003.png","Unit","Rare","ST01",3,2,"The legendary mobile suit.","Earth Federation","Amuro Ray","RX-78-2","UC","gundam,prototype","federation,iconic"
```

**Instructions**:
1. Save as `.csv` file
2. Send the file with message: "Import these cards from CSV"
3. I'll process and create the import

### JSON Bulk Import

For **bulk imports** with complex data:

**File**: `cards-import.json`

```json
{
  "set": {
    "name": "Starter Set 01",
    "code": "ST01",
    "releaseDate": "2024-01-15",
    "description": "First starter set for Gundam Card Game"
  },
  "cards": [
    {
      "name": "Char Aznable",
      "setNumber": "ST01-002",
      "imageUrl": "/images/cards/ST01-002.png",
      "type": "Character",
      "rarity": "Uncommon",
      "level": 2,
      "cost": 1,
      "description": "The Red Comet, Char Aznable.",
      "faction": "Principality of Zeon",
      "pilot": "Char Aznable",
      "series": "UC",
      "keywords": ["ace", "zeon", "commander"],
      "tags": ["red-comet", "antagonist"]
    },
    {
      "name": "Amuro Ray",
      "setNumber": "ST01-001",
      "imageUrl": "/images/cards/ST01-001.png",
      "type": "Character",
      "rarity": "Uncommon",
      "level": 2,
      "cost": 1,
      "description": "The hero of the One Year War.",
      "faction": "Earth Federation",
      "pilot": "Amuro Ray",
      "series": "UC",
      "keywords": ["ace", "federation", "gundam-pilot"],
      "tags": ["white-base", "protagonist"]
    }
  ]
}
```

**Instructions**:
1. Save as `.json` file
2. Send the file with message: "Import cards from this JSON file"
3. I'll validate and process the import

---

## Examples

### Example 1: Single Card with Image

**Message to send**:
```
I want to add a new card to the database:

Name: Char Aznable
Set Number: ST01-002
Image: I've placed the image at public/images/cards/ST01-002.png
Type: Character
Rarity: Uncommon
Set: ST01 (Starter Set 01)
Level: 2
Cost: 1
Description: "The Red Comet, Char Aznable."
Faction: Principality of Zeon
Pilot: Char Aznable
Series: UC (Universal Century)
Keywords: ace, zeon, commander
Tags: red-comet, antagonist
```

### Example 2: Multiple Cards with JSON

**Message to send**:
```
I need to import 3 cards from the ST01 set. Here's the JSON:

[Attach or paste the JSON from above]

All images are in public/images/cards/ with filenames matching the card numbers.
```

### Example 3: Update Existing Card

**Message to send**:
```
Update card ST01-002 (Char Aznable):
- Change level from 2 to 3
- Add new keyword: "rival"
- Update description to: "The Red Comet, Char Aznable. Rival of Amuro Ray."
```

### Example 4: Card with Full Stats

**Message to send**:
```json
{
  "name": "MS-06S Zaku II Commander Type",
  "setNumber": "ST01-010",
  "imageUrl": "/images/cards/ST01-010.png",
  "type": "Unit",
  "rarity": "Rare",
  "set": "ST01",
  "level": 4,
  "cost": 3,
  "clashPoints": 6,
  "hitPoints": 5,
  "attackPoints": 4,
  "description": "Char's custom red Zaku, three times faster than normal.",
  "officialText": "[Ace Pilot] This card cannot be destroyed by card effects.",
  "faction": "Principality of Zeon",
  "pilot": "Char Aznable",
  "model": "MS-06S",
  "series": "UC",
  "nation": "Principality of Zeon",
  "abilities": "[\"Quick\", \"Ace Pilot\"]",
  "keywords": ["mobile-suit", "zaku", "red-comet", "ace"],
  "tags": ["iconic", "char-custom"],
  "isFoil": false,
  "isPromo": false,
  "language": "en"
}
```

---

## Common Card Types

### Card Types (typeId)
- `unit` - Unit cards (Mobile Suits, Vehicles)
- `character` - Character cards (Pilots, Officers)
- `command` - Command cards (Tactics, Strategies)
- `operation` - Operation cards (Events, Actions)
- `base` - Base cards (Locations, Facilities)
- `pilot` - Pilot cards (Character subset)

### Rarities (rarityId)
- `common` - Common (Gray)
- `uncommon` - Uncommon (Gray)
- `rare` - Rare (Yellow)
- `super-rare` - Super Rare (Red)
- `ultra-rare` - Ultra Rare (Purple)
- `secret-rare` - Secret Rare (Rainbow/Gold)

### Factions
- Earth Federation
- Principality of Zeon
- AEUG
- Titans
- Crossbone Vanguard
- ZAFT
- Orb Union
- Celestial Being
- A-LAWS

### Series Codes
- `UC` - Universal Century
- `CE` - Cosmic Era
- `AD` - Anno Domini
- `AC` - After Colony
- `FC` - Future Century
- `AG` - Advanced Generation
- `PD` - Post Disaster

---

## Quick Reference

### Minimum Required Information

To add a card, you **must** provide:
1. ✅ Card name
2. ✅ Set number (e.g., ST01-002)
3. ✅ Image location or URL
4. ✅ Card type
5. ✅ Rarity
6. ✅ Set code/ID

### Highly Recommended Information

For the best display, also include:
- Level and Cost
- Description/Card text
- Faction (for filtering)
- Series (for categorization)
- Pilot/Model (for search)
- Keywords and tags (for search functionality)

---

## Tips

### Image Tips
1. **Use high resolution** - Card text should be readable
2. **Consistent naming** - Follow the set number format
3. **Organize by set** - Group images by set for easier management
4. **Backup originals** - Keep original high-res versions
5. **Test locally** - Verify images load in browser before importing

### Data Tips
1. **Be consistent** - Use same faction/series names across cards
2. **Use keywords** - Add searchable keywords for better discovery
3. **Check spellings** - Card names and pilots should match official names
4. **Add tags** - Tags help with filtering and collections
5. **Review before bulk import** - Check a few cards first to verify format

### Communication Tips
1. **Attach images** - Provide images via file attachment or specify location
2. **Use JSON for bulk** - JSON is easier for multiple cards
3. **Be specific** - Include all available information
4. **Test one first** - Import one card to verify the process before bulk importing
5. **Request confirmation** - Ask me to confirm the data before saving

---

## Troubleshooting

### Image Not Displaying
- ✓ Check file path is correct
- ✓ Verify image exists at specified location
- ✓ Check file extension matches (png vs jpg)
- ✓ Ensure image is in `public/` folder or accessible URL

### Card Not Saving
- ✓ Verify all required fields are provided
- ✓ Check that typeId, rarityId, and setId exist in database
- ✓ Ensure setNumber is unique within the set
- ✓ Verify JSON format is valid (no syntax errors)

### Search Not Finding Card
- ✓ Add relevant keywords to the card
- ✓ Ensure name, pilot, and model fields are filled
- ✓ Check faction and series are spelled correctly
- ✓ Add searchable tags

---

## Need Help?

When requesting card imports, you can:
- Send me a JSON file
- Send me a CSV file
- Describe the card in natural language
- Provide a screenshot with text description
- Ask me to create a template for your specific needs

**Example request**:
> "I need to import 20 cards from the BT-01 set. Can you create a CSV template I can fill out?"

---

*Last Updated: 2025-10-13*
