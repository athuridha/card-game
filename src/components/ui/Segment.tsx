import type { ReactNode } from "react";

export function NumberSegment({
  value,
  onChange,
  options,
}: {
  value: number;
  onChange: (n: number) => void;
  options: number[];
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {options.map((n) => {
        const active = value === n;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={
              "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition active:translate-y-px " +
              (active
                ? "bg-emerald-600 text-white shadow-[0_10px_24px_rgba(16,185,129,0.25)]"
                : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-50")
            }
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}

export function ModeSegment({
  left,
  right,
  value,
  onChange,
}: {
  left: { label: ReactNode; value: string };
  right: { label: ReactNode; value: string };
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex h-10 w-full rounded-full bg-zinc-100 p-1">
      {[left, right].map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={
              "flex flex-1 items-center justify-center rounded-full text-sm font-semibold transition " +
              (active ? "bg-emerald-600 text-white" : "text-zinc-600")
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
