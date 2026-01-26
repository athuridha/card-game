import { z } from "zod";

export const CardSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  category: z.string().min(1),
  kind: z.enum(["truth", "dare"]).optional(),
  level: z.number().int().min(1).max(3).optional(),
  tags: z.array(z.string().min(1)).optional(),
});

export type Card = z.infer<typeof CardSchema>;

export const CardsFileSchema = z.object({
  version: z.string().min(1).optional(),
  updatedAt: z.string().min(1).optional(),
  cards: z.array(CardSchema).min(1),
});

export type CardsFile = z.infer<typeof CardsFileSchema>;

export function summarizeByCategory(cards: Card[]): Array<{ category: string; count: number }> {
  const map = new Map<string, number>();
  for (const card of cards) {
    map.set(card.category, (map.get(card.category) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([category, count]) => ({ category, count }));
}
