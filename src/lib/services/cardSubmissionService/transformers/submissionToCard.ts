/**
 * Transform submission to card data
 */

import { prisma } from '@/lib/database';
import type { CardSubmissionWithRelations } from '@/lib/types/submission';
import type { CreateCardData } from '@/lib/types/card';

/**
 * Transform submission to card data for publishing
 */
export async function transformSubmissionToCardData(
  submission: CardSubmissionWithRelations
): Promise<CreateCardData> {
  // Ensure we have required references
  let typeId = submission.typeId;
  let rarityId = submission.rarityId;
  let setId = submission.setId;

  // Create missing references if needed
  if (!typeId) {
    typeId = await findOrCreateCardType('Unit');
  }

  if (!rarityId) {
    rarityId = await findOrCreateRarity('Common');
  }

  if (!setId) {
    setId = await findOrCreateSet(
      submission.setName || 'Community Submissions',
      submission.setCode || 'CS'
    );
  }

  return {
    name: submission.name,
    typeId,
    rarityId,
    setId,
    setNumber: submission.setNumber,
    imageUrl: submission.imageUrl || '',
    imageUrlSmall: undefined,
    imageUrlLarge: undefined,
    description: submission.description ?? undefined,
    officialText: submission.officialText ?? undefined,
    level: submission.level ?? undefined,
    cost: submission.cost ?? undefined,
    clashPoints: submission.clashPoints ?? undefined,
    price: submission.price ?? undefined,
    hitPoints: submission.hitPoints ?? undefined,
    attackPoints: submission.attackPoints ?? undefined,
    faction: submission.faction ?? undefined,
    pilot: submission.pilot ?? undefined,
    model: submission.model ?? undefined,
    series: submission.series ?? undefined,
    nation: submission.nation ?? undefined,
    keywords: submission.keywords,
    tags: submission.tags,
    abilities: submission.abilities ?? undefined,
    isFoil: submission.isFoil,
    isPromo: submission.isPromo,
    isAlternate: submission.isAlternate,
    language: submission.language,
  };
}

/**
 * Find or create card type
 */
async function findOrCreateCardType(name: string): Promise<string> {
  let cardType = await prisma.cardType.findUnique({
    where: { name },
  });

  if (!cardType) {
    cardType = await prisma.cardType.create({
      data: {
        name,
        description: `Auto-created type: ${name}`,
      },
    });
  }

  return cardType.id;
}

/**
 * Find or create rarity
 */
async function findOrCreateRarity(name: string): Promise<string> {
  let rarity = await prisma.rarity.findUnique({
    where: { name },
  });

  if (!rarity) {
    rarity = await prisma.rarity.create({
      data: {
        name,
        color: '#6B7280',
        description: `Auto-created rarity: ${name}`,
      },
    });
  }

  return rarity.id;
}

/**
 * Find or create set
 */
async function findOrCreateSet(name: string, code: string): Promise<string> {
  let cardSet = await prisma.set.findUnique({
    where: { code },
  });

  if (!cardSet) {
    cardSet = await prisma.set.create({
      data: {
        name,
        code,
        releaseDate: new Date(),
        description: `Auto-created set: ${name}`,
      },
    });
  }

  return cardSet.id;
}
