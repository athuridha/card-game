"use client";

import type { Card } from "@/lib/cards/schema";

const KEY = "mainkartu:cards-cache:v1";
const MAX_AGE_MS = 1000 * 60 * 60 * 6; // 6 hours

export type CardsPayload = {
  deep: Card[];
  tod: Card[];
  source: "db" | "seed";
};

export function readCachedCards(): CardsPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { savedAt: number; payload: CardsPayload };
    if (!parsed?.savedAt || !parsed?.payload) return null;
    if (Date.now() - parsed.savedAt > MAX_AGE_MS) return null;
    return parsed.payload;
  } catch {
    return null;
  }
}

export function writeCachedCards(payload: CardsPayload) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify({ savedAt: Date.now(), payload }));
}

export async function fetchCardsFromApi(): Promise<CardsPayload> {
  const res = await fetch("/api/cards", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load cards");
  return (await res.json()) as CardsPayload;
}

export async function ensureCardsLoaded(): Promise<CardsPayload> {
  const cached = readCachedCards();
  if (cached) return cached;
  const payload = await fetchCardsFromApi();
  writeCachedCards(payload);
  return payload;
}
