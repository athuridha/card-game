"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PhoneShell } from "@/components/ui/PhoneShell";
import { TopBar } from "@/components/ui/TopBar";
import { PrimaryButton } from "@/components/ui/Buttons";

export default function AdminLoginPage() {
  const router = useRouter();
  const [callbackUrl] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get("callbackUrl") ?? "/admin";
    } catch {
      return "/admin";
    }
  });

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      identifier,
      password,
      callbackUrl,
    });

    setBusy(false);

    if (!res || res.error) {
      setError("Login gagal. Cek username/email dan password.");
      return;
    }

    router.push(res.url ?? callbackUrl);
  }

  return (
    <PhoneShell>
      <TopBar title="Login Admin" backHref="/" />
      <main className="px-5 py-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="text-sm font-semibold text-zinc-700">Masuk untuk akses Admin Panel</div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-600">Username / Email</label>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="username atau email"
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-600">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="password"
              autoComplete="current-password"
            />
          </div>

          {error ? <div className="text-xs font-semibold text-red-600">{error}</div> : null}

          <PrimaryButton type="submit" disabled={busy || !identifier.trim() || !password}>
            {busy ? "Masuk..." : "Masuk"}
          </PrimaryButton>
        </form>
      </main>
    </PhoneShell>
  );
}
