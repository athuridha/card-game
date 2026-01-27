import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

export const runtime = "nodejs";

function unauthorized() {
  return new NextResponse("Unauthorized", { status: 401 });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.isAdmin) return unauthorized();

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = z.object({ name: z.string().min(1) }).safeParse(body);
  if (!parsed.success) return new NextResponse("Invalid body", { status: 400 });

  const deck = await prisma.deck.update({ where: { id }, data: { name: parsed.data.name } });
  return NextResponse.json({ deck });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.isAdmin) return unauthorized();

  const { id } = await ctx.params;
  await prisma.deck.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
