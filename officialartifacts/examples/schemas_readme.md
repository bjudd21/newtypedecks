# Gundam Card Game JSON Schemas

This directory contains JSON Schema definitions for all card types in the Gundam Card Game, based on the Comprehensive Rules Ver. 1.1.1.

## Overview

These schemas provide validation and documentation for digital card data, ensuring consistency and correctness when working with card information programmatically. Each schema follows JSON Schema Draft-07 specification and includes detailed descriptions for all properties.

## Schema Files

### Individual Card Type Schemas

- `unit-card.schema.json` - Unit cards that can attack and be deployed to the battle area
- `pilot-card.schema.json` - Pilot cards that pair with Units and provide dual effects
- `command-card.schema.json` - Command cards with instant effects, some with optional Pilot modes
- `base-card.schema.json` - Base cards deployed to the shield area for defense
- `resource-card.schema.json` - Resource cards that provide the energy to play other cards
- `token.schema.json` - Token definitions including EX Base and EX Resource tokens

### Unified Schema

- `unified-card.schema.json` - A single schema that can validate any card type using conditional logic

## Key Features

### Validation Rules

- Enforces game rules (e.g., Units must have AP/HP, Resources cannot have colors)
- Validates required vs optional fields based on card type
- Ensures proper data types and value ranges

### Effect System

All schemas properly categorize the five effect types from the rules:

- **Keyword Effects**: `<Repair>`, `<Blocker>`, `<First Strike>`, etc.
- **Triggered Effects**: `【Deploy】`, `【Attack】`, `【Destroyed】`, etc.
- **Activated Effects**: `【Activate･Main】`, `【Activate･Action】`
- **Constant Effects**: Always-active effects with optional conditions
- **Command Effects**: Effects on Command cards with `【Main】`/`【Action】` timing

### Complex Card Handling

- **Pilot Cards**: Dual effect structure (Pilot card effects vs Unit effects)
- **Command Cards**: Optional Pilot mode with separate effect sets
- **Link Units**: Proper link condition validation for Units
- **Tokens**: Special rules for EX tokens and removal mechanics

## Usage

### Validation

Use any JSON Schema validator. Examples with `ajv-cli`:

```bash
# Install ajv-cli
npm install -g ajv-cli

# Validate a Unit card
ajv validate -s unit-card.schema.json -d examples/rx-78-2-gundam.json

# Validate multiple cards
ajv validate -s unified-card.schema.json -d "examples/*.json"
```

### Programming Languages

**JavaScript/Node.js:**

```javascript
const Ajv = require('ajv');
const ajv = new Ajv();
const schema = require('./unit-card.schema.json');
const validate = ajv.compile(schema);

const cardData = {
  /* your card data */
};
const valid = validate(cardData);
if (!valid) console.log(validate.errors);
```

**Python:**

```python
import json
import jsonschema

with open('unit-card.schema.json') as f:
    schema = json.load(f)

with open('card-data.json') as f:
    card_data = json.load(f)

jsonschema.validate(card_data, schema)
```

## Data Structure

### Basic Card Properties

All cards (except tokens) include:

- `cardNumber` - Unique identifier (max 4 copies per deck)
- `cardName` - Display name
- `cardType` - One of: Unit, Pilot, Command, Base, Resource
- `color` - One of: blue, green, red, white (null for Resources)
- `level` - Resource requirement to play
- `cost` - Resources to rest when playing

### Game Mechanics

- **AP/HP**: Combat stats for Units and Bases
- **Modifiers**: AP/HP bonuses from Pilots
- **Link Conditions**: Requirements for Link Units
- **Traits**: Used for card interactions and Link conditions

## Examples Directory Structure

```
examples/
├── units/
│   ├── rx-78-2-gundam.json
│   ├── zaku-ii.json
│   └── gundam-barbatos.json
├── pilots/
│   ├── amuro-ray.json
│   ├── char-aznable.json
│   └── mikazuki-augus.json
├── commands/
│   ├── beam-saber.json
│   ├── newtype-flash.json
│   └── ace-pilot-command.json
├── bases/
│   ├── white-base.json
│   └── argama.json
├── resources/
│   └── standard-resource.json
└── tokens/
    ├── ex-base-token.json
    └── ex-resource-token.json
```

## Deck Construction Rules

These schemas enforce the deck construction rules from the comprehensive rules:

- **Deck Size**: 50 cards exactly
- **Resource Deck Size**: 10 cards exactly
- **Card Limits**: Maximum 4 copies of any card number in deck
- **Color Restrictions**: Deck must use 1-2 colors only
- **Resource Limits**: No limits on Resource card copies in resource deck

## Version History

- **v1.0.0** - Initial schemas based on Comprehensive Rules v1.1.1
- Support for all five card types
- Complete effect system modeling
- Token support including EX tokens

## Contributing

When updating schemas:

1. Ensure changes align with official Comprehensive Rules
2. Update version numbers in schema `$id` fields
3. Add new examples for any new card types or mechanics
4. Test validation with existing card data
5. Update this README with any structural changes

## Validation Tools

Recommended tools for working with these schemas:

- **ajv** - Fast JSON Schema validator for JavaScript
- **jsonschema** - Python JSON Schema validation
- **quicktype** - Generate type definitions from schemas
- **json-schema-to-markdown** - Generate documentation from schemas

## License

These schemas are provided for use with the Gundam Card Game. Card game rules and content are property of their respective owners.
