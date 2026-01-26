import type { ReactNode } from "react";

export function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-zinc-100 px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-[420px]">
        <div className="min-h-[760px] w-full rounded-[28px] bg-white shadow-[0_18px_60px_rgba(0,0,0,0.10)] ring-1 ring-black/5">
          {children}
        </div>
      </div>
    </div>
  );
}
