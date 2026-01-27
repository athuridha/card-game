import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

export const runtime = "nodejs";

function unauthorized() {
  return new NextResponse("Unauthorized", { status: 401 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.isAdmin) return unauthorized();

  const decks = await prisma.deck.findMany({
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { cards: true } } },
  });

  return NextResponse.json({
    decks: decks.map((d) => ({
      id: d.id,
      name: d.name,
      cardsCount: d._count.cards,
      updatedAt: d.updatedAt,
    })),
  });
}

const CreateDeckSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.isAdmin) return unauthorized();

  const body = await req.json().catch(() => null);
  const parsed = CreateDeckSchema.safeParse(body);
  if (!parsed.success) return new NextResponse("Invalid body", { status: 400 });

  const deck = await prisma.deck.create({ data: parsed.data });
  return NextResponse.json({ deck });
}
