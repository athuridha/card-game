import Link from "next/link";
import { PhoneShell } from "@/components/ui/PhoneShell";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";

export default function Home() {
  return (
    <PhoneShell>
      <main className="flex min-h-[760px] flex-col items-center justify-center px-8 py-14 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Kartu Deep Talk</h1>
        <p className="mt-3 max-w-xs text-sm leading-6 text-zinc-500">Permainan kartu untuk obrolan mendalam</p>

        <div className="mt-10 w-full max-w-xs space-y-3">
          <Link href="/setup" className="block">
            <PrimaryButton>Mulai Main</PrimaryButton>
          </Link>
          <Link href="/cara-main" className="block">
            <SecondaryButton>Cara Main</SecondaryButton>
          </Link>
        </div>
      </main>
    </PhoneShell>
  );
}
