import type { ButtonHTMLAttributes, ReactNode } from "react";

export function PrimaryButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      {...props}
      className={
        "h-12 w-full rounded-xl bg-gradient-to-b from-emerald-600 to-emerald-700 px-4 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(16,185,129,0.25)] transition hover:from-emerald-600 hover:to-emerald-800 active:translate-y-px disabled:opacity-60 " +
        className
      }
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      {...props}
      className={
        "h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50 active:translate-y-px disabled:opacity-60 " +
        className
      }
    >
      {children}
    </button>
  );
}

export function SmallPillButton({
  children,
  active,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; active?: boolean }) {
  return (
    <button
      {...props}
      className={
        "inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border px-3 text-xs font-semibold transition active:translate-y-px " +
        (active
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50") +
        " " +
        className
      }
    >
      {children}
    </button>
  );
}
