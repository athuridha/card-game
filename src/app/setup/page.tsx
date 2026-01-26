"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PhoneShell } from "@/components/ui/PhoneShell";
import { TopBar } from "@/components/ui/TopBar";
import { PrimaryButton } from "@/components/ui/Buttons";
import { NumberSegment, ModeSegment } from "@/components/ui/Segment";
import type { GameMode } from "@/lib/game/storage";
import { seedCards } from "@/data/cards.seed";
import { CardsFileSchema, summarizeByCategory } from "@/lib/cards/schema";
import { useRouter } from "next/navigation";
import { useGame } from "@/lib/game/useGame";

export default function SetupPage() {
  const router = useRouter();

  const cardsFile = useMemo(() => {
    const parsed = CardsFileSchema.safeParse(seedCards);
    return parsed.success ? parsed.data : seedCards;
  }, []);

  const cards = cardsFile.cards;
  const { actions } = useGame(cards);

  const [playerCount, setPlayerCount] = useState<number>(4);
  const [players, setPlayers] = useState<string[]>(["Amara", "Budi", "Citra", "Dani"]);
  const [mode, setMode] = useState<GameMode>("Santai");

  const categories = useMemo(() => summarizeByCategory(cards), [cards]);

  function onChangePlayerCount(n: number) {
    setPlayerCount(n);
    setPlayers((prev) => {
      const next = prev.slice(0, n);
      while (next.length < n) next.push("");
      return next;
    });
  }

  function updatePlayer(i: number, v: string) {
    setPlayers((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
  }

  function shufflePlayers() {
    setPlayers((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    });
  }

  function onStart() {
    actions.startNewGame({
      mode,
      playerCount,
      players,
    });
    router.push("/play");
  }

  return (
    <PhoneShell>
      <TopBar title="Atur Pemain" backHref="/" />
      <main className="px-5 py-6">
        <div className="space-y-6">
          <section className="space-y-3">
            <div className="text-sm font-semibold text-zinc-700">Pilih Jumlah Pemain</div>
            <NumberSegment value={playerCount} onChange={onChangePlayerCount} options={[2, 3, 4, 5, 6]} />
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-zinc-700">Nama Pemain (opsional)</div>
              <button
                type="button"
                onClick={shufflePlayers}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Acak
              </button>
            </div>
            <div className="space-y-2">
              {Array.from({ length: playerCount }).map((_, i) => (
                <input
                  key={i}
                  value={players[i] ?? ""}
                  onChange={(e) => updatePlayer(i, e.target.value)}
                  placeholder={`Pemain ${i + 1}`}
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-800 shadow-sm outline-none placeholder:text-zinc-400 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                />
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <div className="text-sm font-semibold text-zinc-700">Mode Permainan</div>
            <ModeSegment
              value={mode}
              onChange={(v) => setMode(v as GameMode)}
              left={{ label: "Santai", value: "Santai" }}
              right={{ label: "Bertahap", value: "Bertahap" }}
            />
          </section>

          <section className="space-y-2">
            <div className="text-xs font-semibold text-zinc-500">Pratinjau Kategori</div>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((c) => (
                <div key={c.category} className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-zinc-700">{c.category}</span>
                    <span className="ml-auto text-zinc-500">({c.count})</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="pt-2">
            <PrimaryButton onClick={onStart}>Mulai</PrimaryButton>
            <div className="mt-3 text-center text-xs text-zinc-500">
              atau kembali ke <Link href="/" className="font-semibold text-emerald-700">Home</Link>
            </div>
          </div>
        </div>
      </main>
    </PhoneShell>
  );
}
