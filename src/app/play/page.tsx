"use client";

import { useEffect, useMemo, useState } from "react";
import { PhoneShell } from "@/components/ui/PhoneShell";
import { TopBar } from "@/components/ui/TopBar";
import { PrimaryButton, SmallPillButton } from "@/components/ui/Buttons";
import { seedCards } from "@/data/cards.seed";
import { todCards } from "@/data/tod.seed";
import { CardsFileSchema } from "@/lib/cards/schema";
import { useGame } from "@/lib/game/useGame";
import { readCachedCards, ensureCardsLoaded, writeCachedCards } from "@/lib/cards/clientCache";

export default function PlayPage() {
  const cardsFile = useMemo(() => {
    const parsed = CardsFileSchema.safeParse(seedCards);
    return parsed.success ? parsed.data : seedCards;
  }, []);

  const [loadedDeep, setLoadedDeep] = useState(() => readCachedCards()?.deep ?? cardsFile.cards);
  const [loadedTod, setLoadedTod] = useState(() => readCachedCards()?.tod ?? todCards);

  useEffect(() => {
    const cached = readCachedCards();
    if (cached) return;
    (async () => {
      try {
        const payload = await ensureCardsLoaded();
        writeCachedCards(payload);
        setLoadedDeep(payload.deep);
        setLoadedTod(payload.tod);
      } catch {
        // ignore; seed stays
      }
    })();
  }, []);

  const { state, activeCard, todActiveCard, isFavorite, remaining, actions } = useGame(loadedDeep, loadedTod);
  const [showHistory, setShowHistory] = useState(false);
  const [showTod, setShowTod] = useState(false);

  const currentPlayerName =
    state.players?.[Math.max(0, Math.min(state.currentPlayerIndex, (state.players?.length ?? 1) - 1))] || "";
  const showTurn = Boolean(currentPlayerName.trim());

  return (
    <PhoneShell>
      <div className="flex min-h-dvh flex-col">
        <TopBar title={showTurn ? `Giliran: ${currentPlayerName}` : "Permainan"} backHref="/setup" />

        <main className="flex flex-1 flex-col px-5 py-6">
          <div className="mx-auto flex w-full max-w-[380px] flex-1 flex-col justify-center">
            <div className="w-full rounded-[22px] border border-zinc-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
              <div className="relative overflow-hidden rounded-[22px] px-6 pb-8 pt-7">
                <div className="absolute -right-16 -bottom-16 h-52 w-52 rounded-full bg-gradient-to-br from-emerald-200/60 to-emerald-500/40" />
                <div className="relative">
                  <div className="mx-auto flex max-w-[180px] items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(16,185,129,0.25)]">
                    {activeCard?.category ?? "Kartu"}
                  </div>
                  <div className="mt-10 px-2 text-center text-2xl font-semibold leading-9 tracking-tight text-zinc-900">
                    {activeCard?.text ?? "Tekan ‘Kartu Berikutnya’ untuk mulai."}
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <PrimaryButton onClick={actions.drawNext}>Kartu Berikutnya</PrimaryButton>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <SmallPillButton onClick={actions.skip}>Lewat</SmallPillButton>
              <SmallPillButton
                onClick={() => {
                  actions.drawTodRandom();
                  setShowTod(true);
                }}
              >
                <DiceIcon />
                TOD
              </SmallPillButton>
              <SmallPillButton active={isFavorite} onClick={actions.toggleFavorite}>
                <HeartIcon filled={isFavorite} />
                Favorit
              </SmallPillButton>
              <SmallPillButton onClick={() => setShowHistory(true)}>
                <ClockIcon />
                Riwayat
              </SmallPillButton>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
              <div>Sisa: {remaining}</div>
              <button
                type="button"
                onClick={actions.resetDeck}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-semibold text-zinc-600 hover:bg-zinc-100"
              >
                <RefreshIcon className="h-4 w-4" />
                Reset
              </button>
            </div>
          </div>
        </main>

        {showHistory ? (
          <HistoryModal
            onClose={() => setShowHistory(false)}
            history={state.history}
            favorites={state.favorites}
            getText={(id) => cardsFile.cards.find((c) => c.id === id)?.text ?? id}
          />
        ) : null}

        {showTod ? (
          <TodResultModal
            onClose={() => setShowTod(false)}
            onReroll={() => actions.drawTodRandom()}
            card={todActiveCard}
          />
        ) : null}
      </div>
    </PhoneShell>
  );
}

function HistoryModal({
  onClose,
  history,
  favorites,
  getText,
}: {
  onClose: () => void;
  history: string[];
  favorites: Record<string, true>;
  getText: (id: string) => string;
}) {
  const reversed = [...history].reverse();
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center">
      <div className="w-full max-w-[420px] rounded-2xl bg-white shadow-xl ring-1 ring-black/10">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
          <div className="text-sm font-semibold text-zinc-800">Riwayat</div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-zinc-100"
            aria-label="Tutup"
          >
            <XIcon className="h-5 w-5 text-zinc-700" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-auto px-4 py-3">
          {reversed.length === 0 ? (
            <div className="py-10 text-center text-sm text-zinc-500">Belum ada kartu.</div>
          ) : (
            <div className="space-y-2">
              {reversed.map((id) => (
                <div key={id} className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800">
                  <div className="flex items-start gap-2">
                    <div className="mt-1">
                      <span className={favorites[id] ? "text-emerald-600" : "text-zinc-300"}>♥</span>
                    </div>
                    <div className="leading-6">{getText(id)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-zinc-200 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 w-full rounded-xl bg-zinc-100 text-sm font-semibold text-zinc-800 hover:bg-zinc-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M12 21s-7-4.6-9.2-8.7C1 9 2.6 6.5 5.4 6.1c1.7-.2 3.3.5 4.3 1.8 1-1.3 2.6-2 4.3-1.8C16.8 6.5 18.4 9 18.2 12.3 19 16.4 12 21 12 21z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M12 21a9 9 0 1 0-9-9 9 9 0 0 0 9 9z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 7v5l3 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M20 12a8 8 0 1 1-2.3-5.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M20 4v6h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M18 6L6 18M6 6l12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TodResultModal({
  onClose,
  onReroll,
  card,
}: {
  onClose: () => void;
  onReroll: () => void;
  card: { text: string; kind?: "truth" | "dare" } | null;
}) {
  const label = card?.kind === "dare" ? "Tantangan" : "Jujur";
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center">
      <div className="w-full max-w-[420px] rounded-2xl bg-white shadow-xl ring-1 ring-black/10">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
          <div className="text-sm font-semibold text-zinc-800">TOD (Random)</div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-zinc-100"
            aria-label="Tutup"
          >
            <XIcon className="h-5 w-5 text-zinc-700" />
          </button>
        </div>

        <div className="px-4 py-4">
          <div className="mx-auto inline-flex items-center justify-center rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
            {label}
          </div>
          <div className="mt-3 rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-base font-semibold leading-7 text-zinc-900">
            {card?.text ?? "Sedang mengambil kartu..."}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onReroll}
              className="h-11 rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-800 shadow-sm hover:bg-zinc-50"
            >
              Random lagi
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(16,185,129,0.25)] hover:bg-emerald-700"
            >
              Oke
            </button>
          </div>
          <div className="mt-3 text-xs text-zinc-500">TOD tidak mengganti kartu utama.</div>
        </div>
      </div>
    </div>
  );
}

function DiceIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M5 7.5 12 3l7 4.5v9L12 21l-7-4.5v-9Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 9.5h.01M15 14.5h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
