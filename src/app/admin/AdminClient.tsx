"use client";

import { useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import { PhoneShell } from "@/components/ui/PhoneShell";
import { TopBar } from "@/components/ui/TopBar";
import { PrimaryButton, SmallPillButton } from "@/components/ui/Buttons";
import { CardsFileSchema, summarizeByCategory, type CardsFile } from "@/lib/cards/schema";
import { seedCards } from "@/data/cards.seed";

export function AdminClient() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [pending, setPending] = useState<CardsFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const current = useMemo(() => {
    const parsed = CardsFileSchema.safeParse(seedCards);
    return parsed.success ? parsed.data : seedCards;
  }, []);

  const preview = pending ?? current;
  const categories = useMemo(() => summarizeByCategory(preview.cards), [preview.cards]);

  async function onPickFile(file: File | null) {
    setError(null);
    setStatus(null);
    setPending(null);
    setFileName(null);
    if (!file) return;

    setFileName(file.name);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const parsed = CardsFileSchema.safeParse(json);
      if (!parsed.success) {
        setError("JSON tidak valid. Pastikan formatnya sesuai schema.");
        return;
      }
      setPending(parsed.data);
    } catch {
      setError("Gagal membaca file. Pastikan file JSON valid.");
    }
  }

  async function onPublish() {
    if (!pending) {
      setError("Pilih file dulu.");
      return;
    }

    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pending),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Gagal publish");
      }

      setStatus("Berhasil publish ke database.");
      setPending(null);
      setFileName(null);
    } catch {
      setError("Gagal publish. Pastikan Prisma sudah terhubung dan database siap.");
    } finally {
      setBusy(false);
    }
  }

  async function onSeedFromLocal() {
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Gagal seed");
      }
      setStatus("Seed berhasil (deep-talk + tod)." );
    } catch {
      setError("Gagal seed. Pastikan database siap.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PhoneShell>
      <TopBar title="Admin Panel" backHref="/" />
      <main className="px-5 py-6">
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <SmallPillButton onClick={() => signOut({ callbackUrl: "/" })}>Logout</SmallPillButton>
            <SmallPillButton onClick={onSeedFromLocal} disabled={busy}>Seed dari lokal</SmallPillButton>
          </div>

          <section className="space-y-2">
            <div className="text-sm font-semibold text-zinc-700">Upload JSON</div>
            <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50">
              <UploadIcon className="h-4 w-4" />
              <span>Pilih File</span>
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
              />
            </label>
            {fileName ? <div className="text-xs text-zinc-500">Dipilih: {fileName}</div> : null}
            {error ? <div className="text-xs font-semibold text-red-600">{error}</div> : null}
            {status ? <div className="text-xs font-semibold text-emerald-700">{status}</div> : null}
          </section>

          <section className="space-y-2">
            <div className="text-sm font-semibold text-zinc-700">Pratinjau Kategori</div>
            <div className="space-y-2">
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
            <div className="text-xs text-zinc-500">Total kartu: {preview.cards.length}</div>
          </section>

          <div className="pt-2">
            <PrimaryButton onClick={onPublish} disabled={busy || !pending}>
              {busy ? "Memproses..." : "Publish ke DB"}
            </PrimaryButton>
          </div>
        </div>
      </main>
    </PhoneShell>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 16V7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M8 10l4-4 4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
