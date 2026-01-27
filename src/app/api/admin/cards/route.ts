import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

export const runtime = "nodejs";

function unauthorized() {
  return new NextResponse("Unauthorized", { status: 401 });
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.isAdmin) return unauthorized();

  const url = new URL(req.url);
  const deckId = url.searchParams.get("deckId") ?? "";
  const q = (url.searchParams.get("q") ?? "").trim();

  if (!deckId) return new NextResponse("deckId required", { status: 400 });

  const cards = await prisma.card.findMany({
    where: {
      deckId,
      ...(q
        ? {
            OR: [
              { text: { contains: q, mode: "insensitive" } },
              { category: { contains: q, mode: "insensitive" } },
              { id: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { id: "asc" },
    take: 200,
  });

  return NextResponse.json({ cards });
}

const CreateCardSchema = z.object({
  id: z.string().min(1),
  deckId: z.string().min(1),
  text: z.string().min(1),
  category: z.string().min(1),
  level: z.number().int().min(1).max(3).nullable().optional(),
  kind: z.enum(["truth", "dare"]).nullable().optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.isAdmin) return unauthorized();

  const body = await req.json().catch(() => null);
  const parsed = CreateCardSchema.safeParse(body);
  if (!parsed.success) return new NextResponse("Invalid body", { status: 400 });

  const { id, deckId, text, category, level, kind } = parsed.data;

  const card = await prisma.card.create({
    data: {
      id,
      deckId,
      text,
      category,
      level: level ?? null,
      kind: kind ?? null,
    },
  });

  return NextResponse.json({ card });
}
