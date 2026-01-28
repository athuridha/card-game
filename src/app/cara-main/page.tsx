import Link from "next/link";
import { PhoneShell } from "@/components/ui/PhoneShell";
import { TopBar } from "@/components/ui/TopBar";
import { PrimaryButton } from "@/components/ui/Buttons";

export default function CaraMainPage() {
  return (
    <PhoneShell>
      <TopBar title="Cara Main" backHref="/" />
      <main className="px-5 py-6">
        <div className="space-y-4 text-sm leading-6 text-zinc-700">
          <p>
            Ini adalah permainan kartu pertanyaan untuk ngobrol lebih dalam. Tidak ada jawaban benar/salah — yang penting
            jujur dan saling menghargai.
          </p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Tekan <b>Mulai Main</b>, atur pemain (opsional) dan mode.</li>
            <li>Di layar permainan, tekan <b>Kartu Berikutnya</b> untuk mengambil kartu.</li>
            <li>Kalau ada nama pemain, kamu bisa pakai sebagai panduan giliran (opsional).</li>
            <li>Kalau ada pertanyaan yang terlalu berat, pakai <b>Lewat (TOD)</b> / <b>TOD</b> sebagai pengganti.</li>
          </ol>
          <p className="text-zinc-500">Tips: Pastikan semua nyaman, boleh skip kalau belum siap.</p>
        </div>

        <div className="mt-8">
          <Link href="/setup" className="block">
            <PrimaryButton>Mulai</PrimaryButton>
          </Link>
        </div>
      </main>
    </PhoneShell>
  );
}
