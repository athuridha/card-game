import Link from "next/link";

export function TopBar({ title, backHref }: { title: string; backHref?: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-zinc-200 px-5 py-4">
      {backHref ? (
        <Link
          href={backHref}
          aria-label="Kembali"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-zinc-100"
        >
          <ArrowLeftIcon className="h-5 w-5 text-zinc-700" />
        </Link>
      ) : (
        <div className="h-9 w-9" />
      )}
      <div className="flex-1 text-center text-base font-semibold text-zinc-800">{title}</div>
      <div className="h-9 w-9" />
    </div>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
