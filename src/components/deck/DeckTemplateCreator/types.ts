/**
 * Type definitions for DeckTemplateCreator
 */

export interface DeckTemplateCreatorProps {
  deckId: string;
  deckName: string;
  deckDescription?: string;
  cardCount: number;
  onTemplateCreated?: (templateId: string) => void;
  className?: string;
}
