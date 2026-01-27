import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { seedCards } from "@/data/cards.seed";
import { todCards } from "@/data/tod.seed";
import type { Card } from "@/lib/cards/schema";

type DbCardRow = {
  id: string;
  text: string;
  category: string;
  level: number | null;
  kind: "truth" | "dare" | null;
};

export const runtime = "nodejs";

function fallbackCards() {
  return {
    deep: seedCards.cards,
    tod: todCards,
    source: "seed" as const,
  };
}

export async function GET() {
  try {
    if (!process.env.PRISMA_DATABASE_URL) {
      return NextResponse.json(fallbackCards(), {
        headers: {
          "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=600",
        },
      });
    }

    const [deepDeck, todDeck] = await Promise.all([
      prisma.deck.findUnique({ where: { id: "deep-talk" } }),
      prisma.deck.findUnique({ where: { id: "tod" } }),
    ]);

    if (!deepDeck) {
      return NextResponse.json(fallbackCards(), {
        headers: {
          "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=600",
        },
      });
    }

    const [deepCards, tod] = await Promise.all([
      prisma.card.findMany({
        where: { deckId: deepDeck.id },
        orderBy: { id: "asc" },
      }),
      todDeck
        ? prisma.card.findMany({ where: { deckId: todDeck.id }, orderBy: { id: "asc" } })
        : Promise.resolve([]),
    ]);

    const mappedDeep: Card[] = (deepCards as unknown as DbCardRow[]).map((c) => ({
      id: c.id,
      text: c.text,
      category: c.category,
      level: c.level ?? undefined,
    }));

    const mappedTod: Card[] = (tod as unknown as DbCardRow[]).map((c) => ({
      id: c.id,
      text: c.text,
      category: c.category,
      level: c.level ?? undefined,
      kind: c.kind ?? undefined,
    }));

    return NextResponse.json(
      {
        deep: mappedDeep,
        tod: mappedTod,
        source: "db" as const,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=600",
        },
      }
    );
  } catch {
    return NextResponse.json(fallbackCards(), {
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=600",
      },
    });
  }
}
