import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";
import { CardsFileSchema } from "@/lib/cards/schema";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  const parsed = CardsFileSchema.safeParse(json);
  if (!parsed.success) {
    return new NextResponse("Schema invalid", { status: 400 });
  }

  const file = parsed.data;

  // For now, import into the default deck: deep-talk
  const deckId = "deep-talk";
  await prisma.deck.upsert({
    where: { id: deckId },
    update: { name: "Deep Talk" },
    create: { id: deckId, name: "Deep Talk" },
  });

  await prisma.card.deleteMany({ where: { deckId } });

  if (file.cards.length) {
    await prisma.card.createMany({
      data: file.cards.map((c) => ({
        id: c.id,
        deckId,
        text: c.text,
        category: c.category,
        level: c.level ?? null,
        kind: null,
      })),
    });
  }

  return NextResponse.json({ ok: true, imported: file.cards.length });
}
