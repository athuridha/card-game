import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";
import { seedCards } from "@/data/cards.seed";
import { todCards } from "@/data/tod.seed";

export const runtime = "nodejs";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session || !session.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await prisma.deck.upsert({
    where: { id: "deep-talk" },
    update: { name: "Deep Talk" },
    create: { id: "deep-talk", name: "Deep Talk" },
  });

  await prisma.deck.upsert({
    where: { id: "tod" },
    update: { name: "Truth or Dare" },
    create: { id: "tod", name: "Truth or Dare" },
  });

  await prisma.card.deleteMany({ where: { deckId: { in: ["deep-talk", "tod"] } } });

  await prisma.card.createMany({
    data: seedCards.cards.map((c) => ({
      id: c.id,
      deckId: "deep-talk",
      text: c.text,
      category: c.category,
      level: c.level ?? null,
      kind: null,
    })),
  });

  await prisma.card.createMany({
    data: todCards.map((c) => ({
      id: c.id,
      deckId: "tod",
      text: c.text,
      category: c.category,
      level: c.level ?? null,
      kind: c.kind === "dare" ? "dare" : "truth",
    })),
  });

  return NextResponse.json({ ok: true, deep: seedCards.cards.length, tod: todCards.length });
}
