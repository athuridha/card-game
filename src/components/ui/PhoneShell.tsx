import type { ReactNode } from "react";

export function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-white sm:bg-zinc-100">
      <div className="mx-auto min-h-dvh w-full sm:max-w-[420px] sm:py-12">
        <div className="min-h-dvh w-full bg-white sm:min-h-[760px] sm:rounded-[28px] sm:shadow-[0_18px_60px_rgba(0,0,0,0.10)] sm:ring-1 sm:ring-black/5 safe-area">
          {children}
        </div>
      </div>
    </div>
  );
}
