#!/usr/bin/env node

/**
 * One Piece TCG Seed Script — OP-01 Romance Dawn
 *
 * Idempotent — safe to run multiple times. Uses upsert on fixed IDs and unique constraints.
 * Seeds CardTypes, Rarities, a Set, and 55 representative OP-01 cards.
 *
 * Prerequisites: npm run db:seed:games must be run first (creates the one-piece game row).
 * Usage: npm run db:seed:onepiece
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const GAME_SLUG = 'one-piece';

// Fixed IDs prevent duplicate inserts on re-run
const CARD_TYPES = [
  {
    id: 'op-type-leader',
    name: 'Leader',
    description:
      'Leader card — one per deck, not counted in the 50-card main deck',
  },
  {
    id: 'op-type-character',
    name: 'Character',
    description: 'Character cards that represent allies and crew members',
  },
  {
    id: 'op-type-event',
    name: 'Event',
    description: 'One-time effect cards that are played and then discarded',
  },
  {
    id: 'op-type-stage',
    name: 'Stage',
    description: 'Stage cards with persistent field effects',
  },
];

const RARITIES = [
  {
    id: 'op-rarity-c',
    name: 'Common',
    color: '#9CA3AF',
    description: 'Common rarity',
  },
  {
    id: 'op-rarity-uc',
    name: 'Uncommon',
    color: '#3B82F6',
    description: 'Uncommon rarity',
  },
  {
    id: 'op-rarity-r',
    name: 'Rare',
    color: '#8B5CF6',
    description: 'Rare rarity',
  },
  {
    id: 'op-rarity-sr',
    name: 'Super Rare',
    color: '#F59E0B',
    description: 'Super Rare rarity',
  },
  {
    id: 'op-rarity-sec',
    name: 'Secret Rare',
    color: '#EF4444',
    description: 'Secret Rare rarity',
  },
  {
    id: 'op-rarity-l',
    name: 'Leader',
    color: '#D62828',
    description: 'Leader rarity — used only for Leader cards',
  },
  {
    id: 'op-rarity-p',
    name: 'Promo',
    color: '#10B981',
    description: 'Promotional card rarity',
  },
];

const SET = {
  id: 'set-op01',
  code: 'OP01',
  name: 'Romance Dawn',
  releaseDate: new Date('2022-07-08'),
  description:
    'The first booster set for the One Piece Card Game, featuring the Straw Hat Crew, Navy, and Whitebeard Pirates.',
};

/**
 * Builds a card data object.
 * typeId and rarityId must be one of the fixed IDs defined above.
 * attrs contains One Piece-specific gameAttributes (color, power, counter, life, attribute, trait).
 */
function card(
  setNumber,
  name,
  typeId,
  rarityId,
  cost,
  attrs = {},
  description = null,
  officialText = null
) {
  const gameAttributes = {};
  if (attrs.color !== undefined) gameAttributes.color = attrs.color;
  if (attrs.power !== undefined) gameAttributes.power = attrs.power;
  if (attrs.counter !== undefined) gameAttributes.counter = attrs.counter;
  if (attrs.life !== undefined) gameAttributes.life = attrs.life;
  if (attrs.attribute !== undefined) gameAttributes.attribute = attrs.attribute;
  if (attrs.trait !== undefined && attrs.trait !== null)
    gameAttributes.trait = attrs.trait;

  return {
    id: `op-card-${setNumber}`,
    setNumber,
    name,
    typeId,
    rarityId,
    cost,
    imageUrl: `/images/cards/op/${setNumber}.jpg`,
    description,
    officialText,
    gameAttributes,
  };
}

// Short aliases for readability in the card list below
const L = 'op-type-leader';
const CH = 'op-type-character';
const EV = 'op-type-event';
const ST = 'op-type-stage';

const C = 'op-rarity-c';
const UC = 'op-rarity-uc';
const R = 'op-rarity-r';
const SR = 'op-rarity-sr';
const SEC = 'op-rarity-sec';
const LR = 'op-rarity-l';

function getCards() {
  return [
    // ── Leaders (Leader rarity, no cost) ─────────────────────────────────────

    card(
      'OP01-001',
      'Monkey D. Luffy',
      L,
      LR,
      null,
      {
        color: 'Red',
        power: 5000,
        life: 4,
        attribute: 'Strike',
        trait: 'Straw Hat Crew',
      },
      'The future King of the Pirates leads the Straw Hat Crew.',
      '[Activate: Main] [Once Per Turn] Give up to 1 of your Characters DON!! ×1.'
    ),

    card(
      'OP01-002',
      'Roronoa Zoro',
      L,
      LR,
      null,
      {
        color: 'Green',
        power: 5000,
        life: 4,
        attribute: 'Slash',
        trait: 'Straw Hat Crew',
      },
      'The swordsman who aims to become the greatest in the world.',
      "[Activate: Main] [Once Per Turn] If you have 6 or more DON!! on your field, K.O. 1 of your opponent's Characters with 3000 power or less."
    ),

    card(
      'OP01-003',
      'Nami',
      L,
      LR,
      null,
      {
        color: 'Blue',
        power: 5000,
        life: 4,
        attribute: 'Ranged',
        trait: 'Straw Hat Crew',
      },
      'The Straw Hat navigator and master thief.',
      "[Your Turn] Once per turn, when a card is put into play from your hand or your opponent's hand, draw 1 card."
    ),

    card(
      'OP01-004',
      'Nami',
      L,
      LR,
      null,
      {
        color: 'Green',
        power: 5000,
        life: 5,
        attribute: 'Ranged',
        trait: 'Straw Hat Crew',
      },
      'The navigator of the Straw Hat Crew, alternate version.',
      '[Activate: Main] [Once Per Turn] Your Leader gains +1000 power during this turn.'
    ),

    card(
      'OP01-005',
      'Monkey D. Garp',
      L,
      LR,
      null,
      {
        color: 'Blue',
        power: 5000,
        life: 4,
        attribute: 'Strike',
        trait: 'Navy',
      },
      "The Hero of the Marines and Luffy's grandfather.",
      '[Your Turn] Once per turn, when your opponent plays a card, this Leader gains +2000 power for the rest of that battle.'
    ),

    card(
      'OP01-006',
      'Edward Newgate',
      L,
      LR,
      null,
      {
        color: 'Black',
        power: 5000,
        life: 5,
        attribute: 'Strike',
        trait: 'Whitebeard Pirates',
      },
      'The strongest man in the world and captain of the Whitebeard Pirates.',
      '[Your Turn] When you play a Character with a cost of 6 or more, this Leader gains +2000 power during this battle.'
    ),

    // ── Characters — Red (Straw Hat Crew) ────────────────────────────────────

    card(
      'OP01-007',
      'Usopp',
      CH,
      C,
      2,
      {
        color: 'Red',
        power: 2000,
        counter: 1000,
        attribute: 'Ranged',
        trait: 'Straw Hat Crew',
      },
      'The brave warrior of the sea and sharpshooter of the Straw Hat Crew.',
      '[On Play] Look at the top 3 cards of your deck. Reveal up to 1 card with a cost of 2 or less and add it to your hand. Return the rest to the bottom in any order.'
    ),

    card(
      'OP01-008',
      'Tony Tony Chopper',
      CH,
      C,
      1,
      {
        color: 'Red',
        power: 1000,
        counter: 2000,
        attribute: 'Strike',
        trait: 'Straw Hat Crew',
      },
      'The doctor of the Straw Hat Crew who ate the Human-Human Fruit.',
      null
    ),

    card(
      'OP01-009',
      'Sanji',
      CH,
      C,
      3,
      {
        color: 'Red',
        power: 3000,
        counter: 1000,
        attribute: 'Strike',
        trait: 'Straw Hat Crew',
      },
      'The cook of the Straw Hat Crew whose kicks can set the sky ablaze.',
      '[On Play] Give up to 1 of your Leader or Characters DON!! ×1.'
    ),

    card(
      'OP01-010',
      'Nico Robin',
      CH,
      UC,
      3,
      {
        color: 'Red',
        power: 3000,
        counter: 1000,
        attribute: 'Wisdom',
        trait: 'Straw Hat Crew',
      },
      'The archaeologist of the Straw Hat Crew who can read the Poneglyphs.',
      '[On Play] Look at the top 5 cards of your deck and put them back in any order.'
    ),

    card(
      'OP01-011',
      'Roronoa Zoro',
      CH,
      R,
      4,
      {
        color: 'Red',
        power: 5000,
        attribute: 'Slash',
        trait: 'Straw Hat Crew',
      },
      'The swordsman who swore to never lose again.',
      '[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)'
    ),

    card(
      'OP01-012',
      'Monkey D. Luffy',
      CH,
      SR,
      5,
      {
        color: 'Red',
        power: 6000,
        attribute: 'Strike',
        trait: 'Straw Hat Crew',
      },
      'The captain of the Straw Hat Crew who will become King of the Pirates.',
      "[On Play] K.O. up to 1 of your opponent's Characters with a power of 5000 or less. [Rush] (This card can attack on the turn it is played.)"
    ),

    card(
      'OP01-013',
      'Nami',
      CH,
      UC,
      2,
      {
        color: 'Red',
        power: 2000,
        counter: 1000,
        attribute: 'Ranged',
        trait: 'Straw Hat Crew',
      },
      'The navigator of the Straw Hat Crew with a passion for money.',
      '[On Play] Draw 1 card, then discard 1 card.'
    ),

    card(
      'OP01-014',
      'Franky',
      CH,
      C,
      3,
      {
        color: 'Red',
        power: 4000,
        attribute: 'Special',
        trait: 'Straw Hat Crew',
      },
      'The cyborg shipwright of the Straw Hat Crew who built the Thousand Sunny.',
      null
    ),

    card(
      'OP01-015',
      'Brook',
      CH,
      C,
      2,
      {
        color: 'Red',
        power: 3000,
        counter: 1000,
        attribute: 'Slash',
        trait: 'Straw Hat Crew',
      },
      'The skeletal musician of the Straw Hat Crew who ate the Revive-Revive Fruit.',
      '[On Play] Your Leader or 1 of your Characters gains +1000 power during this turn.'
    ),

    // ── Characters — Blue (Navy) ──────────────────────────────────────────────

    card(
      'OP01-016',
      'Helmeppo',
      CH,
      C,
      1,
      {
        color: 'Blue',
        power: 1000,
        counter: 2000,
        attribute: 'Slash',
        trait: 'Navy',
      },
      'Son of former Captain Morgan, now a Navy officer alongside Coby.',
      null
    ),

    card(
      'OP01-017',
      'Coby',
      CH,
      C,
      2,
      {
        color: 'Blue',
        power: 2000,
        counter: 1000,
        attribute: 'Strike',
        trait: 'Navy',
      },
      'A young Marine who dreams of becoming an Admiral.',
      '[On Play] Look at the top card of your deck. You may put it on the top or bottom of your deck.'
    ),

    card(
      'OP01-018',
      'Tashigi',
      CH,
      UC,
      3,
      {
        color: 'Blue',
        power: 3000,
        counter: 1000,
        attribute: 'Slash',
        trait: 'Navy',
      },
      'A Marine officer who wields Shigure and aims to confiscate all great swords.',
      '[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)'
    ),

    card(
      'OP01-019',
      'Smoker',
      CH,
      R,
      4,
      { color: 'Blue', power: 5000, attribute: 'Special', trait: 'Navy' },
      'The White Hunter, a Marine Captain who ate the Smoke-Smoke Fruit.',
      "[Your Turn] [Once Per Turn] When your opponent plays a Character, you may rest this Character to negate that Character's On Play effect."
    ),

    card(
      'OP01-020',
      'Monkey D. Garp',
      CH,
      SR,
      5,
      { color: 'Blue', power: 7000, attribute: 'Strike', trait: 'Navy' },
      'The legendary Marine hero who cornered Gol D. Roger multiple times.',
      "[On Play] Return up to 1 of your opponent's Characters with a cost of 4 or less to the owner's hand."
    ),

    card(
      'OP01-021',
      'Kizaru',
      CH,
      R,
      4,
      { color: 'Blue', power: 6000, attribute: 'Special', trait: 'Navy' },
      'Marine Admiral Borsalino, who ate the Glint-Glint Fruit granting the power of light.',
      null
    ),

    // ── Characters — Green ────────────────────────────────────────────────────

    card(
      'OP01-022',
      'Koby',
      CH,
      C,
      1,
      {
        color: 'Green',
        power: 1000,
        counter: 2000,
        attribute: 'Strike',
        trait: 'Navy',
      },
      "Luffy's first friend who joined the Navy to pursue his dream.",
      null
    ),

    card(
      'OP01-023',
      'Kureha',
      CH,
      C,
      2,
      {
        color: 'Green',
        power: 1000,
        counter: 2000,
        attribute: 'Wisdom',
        trait: 'Drum Kingdom',
      },
      'The legendary doctor of Drum Island, said to be 141 years old.',
      '[On Play] If you have 5 or more cards in your hand, draw 2 cards, then discard 2 cards.'
    ),

    // ── Characters — Black (Whitebeard Pirates) ───────────────────────────────

    card(
      'OP01-024',
      'Fossa',
      CH,
      C,
      2,
      {
        color: 'Black',
        power: 3000,
        counter: 1000,
        attribute: 'Slash',
        trait: 'Whitebeard Pirates',
      },
      'A division commander of the Whitebeard Pirates.',
      null
    ),

    card(
      'OP01-025',
      'Jozu',
      CH,
      UC,
      3,
      {
        color: 'Black',
        power: 5000,
        attribute: 'Strike',
        trait: 'Whitebeard Pirates',
      },
      'The third division commander of the Whitebeard Pirates, whose body can transform into diamond.',
      '[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)'
    ),

    card(
      'OP01-026',
      'Vista',
      CH,
      UC,
      3,
      {
        color: 'Black',
        power: 4000,
        counter: 1000,
        attribute: 'Slash',
        trait: 'Whitebeard Pirates',
      },
      'The fifth division commander of the Whitebeard Pirates, a master swordsman.',
      null
    ),

    card(
      'OP01-027',
      'Marco',
      CH,
      R,
      4,
      {
        color: 'Black',
        power: 5000,
        attribute: 'Special',
        trait: 'Whitebeard Pirates',
      },
      'The first division commander of the Whitebeard Pirates who ate the Phoenix-Phoenix Fruit.',
      '[On Play] You may trash 1 card from your hand: Give up to 1 of your Characters DON!! ×2.'
    ),

    card(
      'OP01-028',
      'Portgas D. Ace',
      CH,
      SR,
      5,
      {
        color: 'Black',
        power: 6000,
        attribute: 'Special',
        trait: 'Whitebeard Pirates',
      },
      "Second division commander of the Whitebeard Pirates and Luffy's sworn brother.",
      '[Rush] (This card can attack on the turn it is played.) [On Play] This Character gains [Double Attack] during this turn.'
    ),

    card(
      'OP01-029',
      'Edward Newgate',
      CH,
      SEC,
      9,
      {
        color: 'Black',
        power: 12000,
        attribute: 'Strike',
        trait: 'Whitebeard Pirates',
      },
      'The strongest man in the world, captain of the Whitebeard Pirates.',
      "[On Play] K.O. up to 2 of your opponent's Characters. [Your Turn] This Character cannot be K.O'd in battle."
    ),

    // ── Characters — Purple ───────────────────────────────────────────────────

    card(
      'OP01-030',
      'Crocodile',
      CH,
      UC,
      3,
      {
        color: 'Purple',
        power: 4000,
        counter: 1000,
        attribute: 'Special',
        trait: 'Warlord',
      },
      'Sir Crocodile, former Warlord of the Sea who ate the Sand-Sand Fruit.',
      null
    ),

    card(
      'OP01-031',
      'Boa Hancock',
      CH,
      UC,
      4,
      {
        color: 'Purple',
        power: 5000,
        attribute: 'Special',
        trait: 'Warlord/Kuja Pirates',
      },
      'The Pirate Empress and Warlord of the Sea who ate the Love-Love Fruit.',
      "[On Play] Rest up to 1 of your opponent's Characters."
    ),

    card(
      'OP01-032',
      'Dracule Mihawk',
      CH,
      R,
      5,
      { color: 'Purple', power: 6000, attribute: 'Slash', trait: 'Warlord' },
      'The greatest swordsman in the world and former Warlord of the Sea.',
      null
    ),

    card(
      'OP01-033',
      'Donquixote Doflamingo',
      CH,
      SR,
      5,
      {
        color: 'Purple',
        power: 6000,
        attribute: 'Special',
        trait: 'Warlord/Donquixote Pirates',
      },
      'The Heavenly Demon and king of Dressrosa who ate the String-String Fruit.',
      "[On Play] Return up to 1 of your opponent's rested Characters with a cost of 5 or less to the owner's hand."
    ),

    card(
      'OP01-034',
      'Silvers Rayleigh',
      CH,
      R,
      5,
      {
        color: 'Purple',
        power: 6000,
        attribute: 'Slash',
        trait: 'Roger Pirates',
      },
      'The Dark King, first mate of the Roger Pirates.',
      '[Blocker] [On K.O.] Draw 1 card.'
    ),

    card(
      'OP01-035',
      'Trafalgar D. Water Law',
      CH,
      R,
      4,
      {
        color: 'Purple',
        power: 5000,
        attribute: 'Slash',
        trait: 'Heart Pirates',
      },
      'The Surgeon of Death, captain of the Heart Pirates.',
      '[On Play] Look at the top 5 cards of your deck. Place 1 on the top of your deck and return the rest to the bottom in any order.'
    ),

    // ── Characters — Yellow (Red Hair Pirates) ────────────────────────────────

    card(
      'OP01-036',
      'Lucky Roux',
      CH,
      C,
      2,
      {
        color: 'Yellow',
        power: 3000,
        counter: 1000,
        attribute: 'Strike',
        trait: 'Red Hair Pirates',
      },
      'A member of the Red Hair Pirates, known for his enormous size and appetite.',
      null
    ),

    card(
      'OP01-037',
      'Yasopp',
      CH,
      C,
      2,
      {
        color: 'Yellow',
        power: 2000,
        counter: 1000,
        attribute: 'Ranged',
        trait: 'Red Hair Pirates',
      },
      "The sharpshooter of the Red Hair Pirates and Usopp's father.",
      '[On Play] Return up to 1 Event card from your trash to your hand.'
    ),

    card(
      'OP01-038',
      'Ben Beckman',
      CH,
      UC,
      3,
      {
        color: 'Yellow',
        power: 4000,
        counter: 1000,
        attribute: 'Ranged',
        trait: 'Red Hair Pirates',
      },
      'The first mate of the Red Hair Pirates.',
      '[Trigger] (When this card is revealed from your Life cards, you may play it.) [On Play] Your Leader gains +2000 power during this turn.'
    ),

    card(
      'OP01-039',
      'Shanks',
      CH,
      SR,
      8,
      {
        color: 'Yellow',
        power: 10000,
        attribute: 'Slash',
        trait: 'Red Hair Pirates',
      },
      'One of the Four Emperors and captain of the Red Hair Pirates.',
      '[Rush] [On Play] Your opponent cannot activate Blocker effects during this battle.'
    ),

    // ── Characters — Multi ────────────────────────────────────────────────────

    card(
      'OP01-040',
      'Whitebeard Pirates Commander',
      CH,
      C,
      2,
      {
        color: 'Multi',
        power: 2000,
        counter: 1000,
        attribute: 'Strike',
        trait: 'Whitebeard Pirates',
      },
      'A loyal commander serving under Edward Newgate aboard the Moby Dick.',
      null
    ),

    // ── Events ───────────────────────────────────────────────────────────────

    card(
      'OP01-041',
      'Gomu Gomu no Gatling',
      EV,
      C,
      2,
      { color: 'Red', trait: 'Straw Hat Crew' },
      "Luffy's signature rapid-fire barrage of rubber punches.",
      '[Counter] Up to 1 of your Leader or Characters gains +4000 power during this battle. [Trigger] Up to 1 of your Leader or Characters gains +2000 power during this turn.'
    ),

    card(
      'OP01-042',
      'Santoryu Oni Giri',
      EV,
      UC,
      3,
      { color: 'Red', trait: 'Straw Hat Crew' },
      "Zoro's three-sword style finishing move.",
      "[Main] K.O. up to 1 of your opponent's Characters with a power of 4000 or less. [Trigger] K.O. up to 1 of your opponent's Characters with a power of 3000 or less."
    ),

    card(
      'OP01-043',
      'Coup de Burst',
      EV,
      R,
      3,
      { color: 'Red', trait: 'Straw Hat Crew' },
      "The Thousand Sunny's emergency escape technique.",
      '[Counter] Up to 1 of your Leader or Characters gains +6000 power during this battle.'
    ),

    card(
      'OP01-044',
      'Gura Gura no Mi',
      EV,
      SR,
      3,
      { color: 'Black', trait: 'Whitebeard Pirates' },
      'The Tremor-Tremor Fruit that grants the power to create earthquakes.',
      "[Main] K.O. up to 1 of your opponent's Characters. [Trigger] K.O. up to 1 of your opponent's Characters with a power of 6000 or less."
    ),

    card(
      'OP01-045',
      "Conqueror's Haki",
      EV,
      R,
      2,
      { color: 'Yellow', trait: 'Red Hair Pirates' },
      'The rarest form of Haki that can knock out weaker-willed opponents.',
      "[Counter] Up to 1 of your Leader or Characters gains +4000 power during this battle. [Trigger] Rest up to 1 of your opponent's Characters."
    ),

    card(
      'OP01-046',
      'Navy Justice',
      EV,
      C,
      1,
      { color: 'Blue', trait: 'Navy' },
      'The absolute justice enforced by the Navy worldwide.',
      '[Counter] Up to 1 of your Leader or Characters gains +2000 power during this battle. [Trigger] Draw 1 card.'
    ),

    card(
      'OP01-047',
      'Impel Down Lockup',
      EV,
      UC,
      2,
      { color: 'Blue', trait: 'Navy' },
      'The dreaded undersea prison where the worst criminals are kept.',
      "[Main] Return up to 1 of your opponent's Characters with a cost of 3 or less to the owner's hand."
    ),

    card(
      'OP01-048',
      'Cross of Doom',
      EV,
      UC,
      2,
      { color: 'Purple', trait: 'Warlord' },
      'A signature technique that leaves enemies paralyzed.',
      '[Counter] Up to 1 of your Leader or Characters gains +4000 power during this battle.'
    ),

    card(
      'OP01-049',
      'Fire Fist',
      EV,
      R,
      3,
      { color: 'Black', trait: 'Whitebeard Pirates' },
      "Portgas D. Ace's signature fire technique.",
      '[Main] Your opponent discards 2 cards from their hand. [Trigger] Your opponent discards 1 card from their hand.'
    ),

    card(
      'OP01-050',
      'Gear 2',
      EV,
      UC,
      2,
      { color: 'Red', trait: 'Straw Hat Crew' },
      'Luffy pumps his blood at high speed to dramatically enhance his combat abilities.',
      '[Main] Up to 1 of your Leader or Characters gains +3000 power during this turn. [Trigger] Up to 1 of your Leader or Characters gains +2000 power during this turn.'
    ),

    // ── Stages ────────────────────────────────────────────────────────────────

    card(
      'OP01-051',
      'Thousand Sunny',
      ST,
      C,
      2,
      { color: 'Red', trait: 'Straw Hat Crew' },
      'The ship of the Straw Hat Crew, built from Adam Wood by Franky.',
      '[Activate: Main] [Once Per Turn] Rest this Stage: Give up to 1 of your Leader or Characters DON!! ×1.'
    ),

    card(
      'OP01-052',
      'Moby Dick',
      ST,
      C,
      2,
      { color: 'Black', trait: 'Whitebeard Pirates' },
      'The flagship of the Whitebeard Pirates, the largest ship in the world.',
      '[Activate: Main] [Once Per Turn] Rest this Stage: Give up to 1 of your Leader or Characters DON!! ×1.'
    ),

    card(
      'OP01-053',
      'Marine Ford',
      ST,
      UC,
      3,
      { color: 'Blue', trait: 'Navy' },
      'The Navy HQ where the battle of Marineford took place.',
      '[Your Turn] All of your Characters with the Navy trait gain +1000 power.'
    ),

    card(
      'OP01-054',
      'New World',
      ST,
      C,
      1,
      { color: 'Yellow', trait: 'Red Hair Pirates' },
      'The second half of the Grand Line where the Four Emperors reign.',
      '[Activate: Main] [Once Per Turn] Rest this Stage: Look at the top 2 cards of your deck. Return them in any order.'
    ),

    card(
      'OP01-055',
      'Sabaody Archipelago',
      ST,
      UC,
      2,
      { color: 'Multi' },
      'The lawless archipelago where pirates gather before entering the New World.',
      '[Your Turn] When you play a card, you may rest this Stage to reduce its cost by 1.'
    ),
  ];
}

async function seedOnePiece() {
  console.warn('Seeding One Piece TCG data (OP-01 Romance Dawn)...\n');

  // Resolve the one-piece game record first
  const game = await prisma.game.findUnique({ where: { slug: GAME_SLUG } });
  if (!game) {
    console.error(
      `Error: Game with slug "${GAME_SLUG}" not found. Run "npm run db:seed:games" first.`
    );
    process.exit(1);
  }
  console.warn(`  [OK] Found game: ${game.name} (id: ${game.id})\n`);

  // Upsert card types
  console.warn('  Upserting card types...');
  for (const ct of CARD_TYPES) {
    await prisma.cardType.upsert({
      where: { id: ct.id },
      update: { name: ct.name, description: ct.description, gameId: game.id },
      create: { ...ct, gameId: game.id },
    });
    console.warn(`    [OK] ${ct.name}`);
  }

  // Upsert rarities
  console.warn('\n  Upserting rarities...');
  for (const r of RARITIES) {
    await prisma.rarity.upsert({
      where: { id: r.id },
      update: {
        name: r.name,
        color: r.color,
        description: r.description,
        gameId: game.id,
      },
      create: { ...r, gameId: game.id },
    });
    console.warn(`    [OK] ${r.name}`);
  }

  // Upsert set
  console.warn('\n  Upserting set...');
  const set = await prisma.set.upsert({
    where: { code: SET.code },
    update: {
      name: SET.name,
      releaseDate: SET.releaseDate,
      description: SET.description,
      gameId: game.id,
    },
    create: { ...SET, gameId: game.id },
  });
  console.warn(`    [OK] ${set.name} (${set.code})\n`);

  // Upsert cards
  console.warn('  Upserting cards...');
  const cards = getCards();
  let count = 0;

  for (const c of cards) {
    await prisma.card.upsert({
      where: { setId_setNumber: { setId: set.id, setNumber: c.setNumber } },
      update: {
        name: c.name,
        cost: c.cost,
        typeId: c.typeId,
        rarityId: c.rarityId,
        imageUrl: c.imageUrl,
        description: c.description,
        officialText: c.officialText,
        gameAttributes: c.gameAttributes,
        gameId: game.id,
      },
      create: {
        id: c.id,
        name: c.name,
        cost: c.cost,
        typeId: c.typeId,
        rarityId: c.rarityId,
        setId: set.id,
        setNumber: c.setNumber,
        imageUrl: c.imageUrl,
        description: c.description,
        officialText: c.officialText,
        gameAttributes: c.gameAttributes,
        gameId: game.id,
      },
    });
    count++;
  }

  console.warn(`    [OK] ${count} cards upserted`);
  console.warn('\nOne Piece seeding complete.');
  console.warn(`  Game:       ${game.name}`);
  console.warn(`  Set:        ${SET.name} (${SET.code})`);
  console.warn(`  Card types: ${CARD_TYPES.length}`);
  console.warn(`  Rarities:   ${RARITIES.length}`);
  console.warn(`  Cards:      ${count}`);
}

seedOnePiece()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
