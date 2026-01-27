import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

export const runtime = "nodejs";

function unauthorized() {
  return new NextResponse("Unauthorized", { status: 401 });
}

const UpdateCardSchema = z.object({
  text: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  level: z.number().int().min(1).max(3).nullable().optional(),
  kind: z.enum(["truth", "dare"]).nullable().optional(),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.isAdmin) return unauthorized();

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = UpdateCardSchema.safeParse(body);
  if (!parsed.success) return new NextResponse("Invalid body", { status: 400 });

  const card = await prisma.card.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ card });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.isAdmin) return unauthorized();

  const { id } = await ctx.params;
  await prisma.card.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
