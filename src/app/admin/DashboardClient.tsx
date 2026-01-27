"use client";

import { useEffect, useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import { PhoneShell } from "@/components/ui/PhoneShell";
import { TopBar } from "@/components/ui/TopBar";
import { PrimaryButton, SmallPillButton } from "@/components/ui/Buttons";

type DeckRow = { id: string; name: string; cardsCount: number; updatedAt: string };
type CardRow = {
  id: string;
  deckId: string;
  text: string;
  category: string;
  level: number | null;
  kind: "truth" | "dare" | null;
};

type Tab = "overview" | "decks" | "cards" | "import";

function SectionTitle({ children }: { children: string }) {
  return <div className="text-sm font-semibold text-zinc-800">{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-semibold text-zinc-600">{label}</div>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-emerald-200 " +
        (props.className ?? "")
      }
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={
        "min-h-24 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-emerald-200 " +
        (props.className ?? "")
      }
    />
  );
}

export function DashboardClient() {
  const [tab, setTab] = useState<Tab>("overview");
  const [decks, setDecks] = useState<DeckRow[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<string>("deep-talk");

  const [cards, setCards] = useState<CardRow[]>([]);
  const [cardsQuery, setCardsQuery] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const selectedDeck = useMemo(() => decks.find((d) => d.id === selectedDeckId) ?? null, [decks, selectedDeckId]);

  async function loadDecks() {
    const res = await fetch("/api/admin/decks", { cache: "no-store" });
    if (!res.ok) throw new Error("Gagal memuat decks");
    const json = (await res.json()) as { decks: DeckRow[] };
    setDecks(json.decks);
    if (!json.decks.some((d) => d.id === selectedDeckId) && json.decks.length) {
      setSelectedDeckId(json.decks[0].id);
    }
  }

  async function loadCards(deckId: string, q: string) {
    const url = new URL(window.location.origin + "/api/admin/cards");
    url.searchParams.set("deckId", deckId);
    if (q.trim()) url.searchParams.set("q", q.trim());
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) throw new Error("Gagal memuat cards");
    const json = (await res.json()) as { cards: CardRow[] };
    setCards(json.cards);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await loadDecks();
        if (!cancelled) setError(null);
      } catch {
        if (!cancelled) setError("Gagal memuat dashboard.");
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tab !== "cards") return;
    let cancelled = false;
    (async () => {
      try {
        await loadCards(selectedDeckId, cardsQuery);
        if (!cancelled) setError(null);
      } catch {
        if (!cancelled) setError("Gagal memuat kartu.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tab, selectedDeckId, cardsQuery]);

  async function onSeed() {
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      if (!res.ok) throw new Error("seed failed");
      setStatus("Seed berhasil.");
      await loadDecks();
    } catch {
      setError("Gagal seed.");
    } finally {
      setBusy(false);
    }
  }

  async function onCreateDeck(id: string, name: string) {
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name }),
      });
      if (!res.ok) throw new Error("create deck failed");
      setStatus("Deck dibuat.");
      await loadDecks();
      setSelectedDeckId(id);
    } catch {
      setError("Gagal membuat deck (cek id unik)." );
    } finally {
      setBusy(false);
    }
  }

  async function onDeleteDeck(id: string) {
    if (!confirm(`Hapus deck '${id}'? Semua cards ikut terhapus.`)) return;
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      const res = await fetch(`/api/admin/decks/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete deck failed");
      setStatus("Deck dihapus.");
      await loadDecks();
      setTab("decks");
    } catch {
      setError("Gagal menghapus deck.");
    } finally {
      setBusy(false);
    }
  }

  async function onCreateCard(payload: {
    id: string;
    deckId: string;
    text: string;
    category: string;
    level: number | null;
    kind: "truth" | "dare" | null;
  }) {
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("create card failed");
      setStatus("Card dibuat.");
      await loadCards(payload.deckId, cardsQuery);
    } catch {
      setError("Gagal membuat card (cek id unik)." );
    } finally {
      setBusy(false);
    }
  }

  async function onDeleteCard(id: string) {
    if (!confirm(`Hapus card '${id}'?`)) return;
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      const res = await fetch(`/api/admin/cards/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete card failed");
      setStatus("Card dihapus.");
      await loadCards(selectedDeckId, cardsQuery);
    } catch {
      setError("Gagal menghapus card.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PhoneShell>
      <TopBar title="Admin Dashboard" backHref="/" />
      <main className="px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <SmallPillButton onClick={() => setTab("overview")} disabled={tab === "overview"}>
              Overview
            </SmallPillButton>
            <SmallPillButton onClick={() => setTab("decks")} disabled={tab === "decks"}>
              Decks
            </SmallPillButton>
            <SmallPillButton onClick={() => setTab("cards")} disabled={tab === "cards"}>
              Cards
            </SmallPillButton>
            <SmallPillButton onClick={() => setTab("import")} disabled={tab === "import"}>
              Import
            </SmallPillButton>
          </div>
          <SmallPillButton onClick={() => signOut({ callbackUrl: "/" })}>Logout</SmallPillButton>
        </div>

        {error ? <div className="mt-3 text-xs font-semibold text-red-600">{error}</div> : null}
        {status ? <div className="mt-3 text-xs font-semibold text-emerald-700">{status}</div> : null}

        <div className="mt-5">
          {tab === "overview" ? (
            <div className="space-y-4">
              <SectionTitle>Quick Actions</SectionTitle>
              <div className="grid gap-3">
                <PrimaryButton onClick={onSeed} disabled={busy}>
                  {busy ? "Memproses..." : "Seed deck default (deep-talk + tod)"}
                </PrimaryButton>
                <div className="text-xs text-zinc-600">
                  Setelah seed, aplikasi otomatis bisa load dari DB via <span className="font-semibold">/api/cards</span>.
                </div>
              </div>
            </div>
          ) : null}

          {tab === "decks" ? <DecksView decks={decks} selectedId={selectedDeckId} onSelect={setSelectedDeckId} onCreate={onCreateDeck} onDelete={onDeleteDeck} busy={busy} /> : null}

          {tab === "cards" ? (
            <CardsView
              decks={decks}
              selectedDeckId={selectedDeckId}
              onSelectDeck={setSelectedDeckId}
              query={cardsQuery}
              onQuery={setCardsQuery}
              cards={cards}
              onCreate={onCreateCard}
              onDelete={onDeleteCard}
              busy={busy}
            />
          ) : null}

          {tab === "import" ? <ImportView busy={busy} onImported={() => setStatus("Import selesai.")} /> : null}
        </div>

        {selectedDeck ? (
          <div className="mt-6 text-xs text-zinc-500">
            Aktif: <span className="font-semibold text-zinc-700">{selectedDeck.name}</span> ({selectedDeck.id})
          </div>
        ) : null}
      </main>
    </PhoneShell>
  );
}

function DecksView({
  decks,
  selectedId,
  onSelect,
  onCreate,
  onDelete,
  busy,
}: {
  decks: DeckRow[];
  selectedId: string;
  onSelect: (id: string) => void;
  onCreate: (id: string, name: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  busy: boolean;
}) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");

  return (
    <div className="space-y-4">
      <SectionTitle>Decks</SectionTitle>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="grid gap-3">
          <Field label="Deck ID">
            <Input value={id} onChange={(e) => setId(e.target.value)} placeholder="contoh: have-fun" />
          </Field>
          <Field label="Nama">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="contoh: Have Fun" />
          </Field>
          <PrimaryButton onClick={() => onCreate(id.trim(), name.trim())} disabled={busy || !id.trim() || !name.trim()}>
            Buat Deck
          </PrimaryButton>
        </div>
      </div>

      <div className="space-y-2">
        {decks.map((d) => (
          <div
            key={d.id}
            className={
              "flex items-center gap-3 rounded-2xl border px-4 py-3 " +
              (d.id === selectedId ? "border-emerald-200 bg-emerald-50" : "border-zinc-200 bg-white")
            }
          >
            <button onClick={() => onSelect(d.id)} className="flex-1 text-left">
              <div className="text-sm font-semibold text-zinc-800">{d.name}</div>
              <div className="text-xs text-zinc-500">
                {d.id} • {d.cardsCount} cards
              </div>
            </button>
            <SmallPillButton onClick={() => onDelete(d.id)} disabled={busy}>
              Hapus
            </SmallPillButton>
          </div>
        ))}
      </div>
    </div>
  );
}

function CardsView({
  decks,
  selectedDeckId,
  onSelectDeck,
  query,
  onQuery,
  cards,
  onCreate,
  onDelete,
  busy,
}: {
  decks: DeckRow[];
  selectedDeckId: string;
  onSelectDeck: (id: string) => void;
  query: string;
  onQuery: (q: string) => void;
  cards: CardRow[];
  onCreate: (payload: {
    id: string;
    deckId: string;
    text: string;
    category: string;
    level: number | null;
    kind: "truth" | "dare" | null;
  }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  busy: boolean;
}) {
  const [id, setId] = useState("");
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState<string>("");
  const [kind, setKind] = useState<string>("");

  return (
    <div className="space-y-4">
      <SectionTitle>Cards</SectionTitle>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="grid gap-3">
          <Field label="Deck">
            <select
              value={selectedDeckId}
              onChange={(e) => onSelectDeck(e.target.value)}
              className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-emerald-200"
            >
              {decks.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.id})
                </option>
              ))}
            </select>
          </Field>

          <Field label="Cari (id/text/category)">
            <Input value={query} onChange={(e) => onQuery(e.target.value)} placeholder="contoh: masa depan" />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="grid gap-3">
          <Field label="Card ID">
            <Input value={id} onChange={(e) => setId(e.target.value)} placeholder="contoh: deep-999" />
          </Field>
          <Field label="Kategori">
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="contoh: Kehidupan" />
          </Field>
          <Field label="Level (1-3, optional)">
            <Input value={level} onChange={(e) => setLevel(e.target.value)} placeholder="1" inputMode="numeric" />
          </Field>
          <Field label="Kind (truth/dare, optional)">
            <Input value={kind} onChange={(e) => setKind(e.target.value)} placeholder="truth" />
          </Field>
          <Field label="Text">
            <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Isi pertanyaan..." />
          </Field>
          <PrimaryButton
            onClick={async () => {
              const normalizedKind = kind.trim().toLowerCase();
              const parsedKind: "truth" | "dare" | null =
                normalizedKind === "truth" || normalizedKind === "dare" ? normalizedKind : null;

              await onCreate({
                id: id.trim(),
                deckId: selectedDeckId,
                text: text.trim(),
                category: category.trim(),
                level: level.trim() ? Number(level.trim()) : null,
                kind: parsedKind,
              });
              setId("");
              setText("");
              setCategory("");
              setLevel("");
              setKind("");
            }}
            disabled={busy || !id.trim() || !text.trim() || !category.trim()}
          >
            Tambah Card
          </PrimaryButton>
        </div>
      </div>

      <div className="space-y-2">
        {cards.map((c) => (
          <div key={c.id} className="rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-zinc-500">{c.id}</div>
                <div className="mt-1 text-sm font-semibold text-zinc-800">{c.category}</div>
                <div className="mt-2 text-sm text-zinc-700">{c.text}</div>
                <div className="mt-2 text-xs text-zinc-500">
                  deck: {c.deckId} • level: {c.level ?? "-"} • kind: {c.kind ?? "-"}
                </div>
              </div>
              <SmallPillButton onClick={() => onDelete(c.id)} disabled={busy}>
                Hapus
              </SmallPillButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImportView({ busy, onImported }: { busy: boolean; onImported: () => void }) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onImport() {
    setError(null);
    try {
      const parsed = JSON.parse(text);
      const res = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      if (!res.ok) throw new Error("import failed");
      onImported();
      setText("");
    } catch {
      setError("Gagal import. Pastikan JSON valid sesuai schema (cards[]).");
    }
  }

  return (
    <div className="space-y-4">
      <SectionTitle>Import JSON</SectionTitle>
      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="text-xs text-zinc-600">Tempel JSON di bawah ini (format lama: {`{ cards: [...] }`}).</div>
        <div className="mt-3">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={'{\n  "cards": [...]\n}'}
            className="min-h-56 font-mono"
          />
        </div>
        {error ? <div className="mt-2 text-xs font-semibold text-red-600">{error}</div> : null}
        <div className="mt-3">
          <PrimaryButton onClick={onImport} disabled={busy || !text.trim()}>
            Import ke deep-talk
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
