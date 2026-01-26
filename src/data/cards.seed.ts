import type { CardsFile } from "@/lib/cards/schema";

export const seedCards: CardsFile = {
  version: "seed-2026-01-26",
  updatedAt: new Date().toISOString(),
  cards: [
    // Masa Depan (12)
    { id: "future-001", category: "Masa Depan", text: "Apa impian terbesarmu untuk 5 tahun ke depan?" },
    { id: "future-002", category: "Masa Depan", text: "Kalau semua berjalan ideal, kamu ingin tinggal di kota/negara mana?" },
    { id: "future-003", category: "Masa Depan", text: "Kebiasaan apa yang ingin kamu punya dalam 1 tahun ke depan?" },
    { id: "future-004", category: "Masa Depan", text: "Hal apa yang paling kamu pengen coba sebelum usia tertentu?" },
    { id: "future-005", category: "Masa Depan", text: "Kalau kamu bisa belajar satu skill sampai jago, apa itu dan kenapa?" },
    { id: "future-006", category: "Masa Depan", text: "Versi dirimu yang kamu kejar itu seperti apa?" },
    { id: "future-007", category: "Masa Depan", text: "Kalau kamu punya waktu luang 6 bulan, kamu akan pakai untuk apa?" },
    { id: "future-008", category: "Masa Depan", text: "Apa hal yang pengen kamu buktikan ke dirimu sendiri?" },
    { id: "future-009", category: "Masa Depan", text: "Kapan terakhir kali kamu merasa ‘hidupmu mulai berubah’? Kenapa?" },
    { id: "future-010", category: "Masa Depan", text: "Apa definisi ‘sukses’ menurutmu saat ini?" },
    { id: "future-011", category: "Masa Depan", text: "Kalau kamu menulis surat untuk dirimu 1 tahun lagi, kamu mau bilang apa?" },
    { id: "future-012", category: "Masa Depan", text: "Apa satu hal kecil yang bisa kamu mulai minggu ini untuk masa depanmu?" },

    // Hubungan (10)
    { id: "rel-001", category: "Hubungan", text: "Menurutmu, apa yang bikin seseorang terasa ‘aman’ untuk diajak cerita?" },
    { id: "rel-002", category: "Hubungan", text: "Saat konflik, kamu biasanya butuh apa dulu: waktu, penjelasan, atau pelukan?" },
    { id: "rel-003", category: "Hubungan", text: "Apa bentuk perhatian yang paling kamu hargai, walau terlihat sederhana?" },
    { id: "rel-004", category: "Hubungan", text: "Hal apa yang sulit kamu minta dari orang lain? Kenapa?" },
    { id: "rel-005", category: "Hubungan", text: "Kapan kamu merasa paling dicintai/dihargai oleh orang terdekatmu?" },
    { id: "rel-006", category: "Hubungan", text: "Kalau kamu bisa memperbaiki satu pola hubunganmu, itu apa?" },
    { id: "rel-007", category: "Hubungan", text: "Apa batasan (boundaries) yang paling penting buatmu dalam hubungan?" },
    { id: "rel-008", category: "Hubungan", text: "Apa hal yang pengen kamu pelajari tentang cara mencintai dengan lebih sehat?" },
    { id: "rel-009", category: "Hubungan", text: "Menurutmu, kapan harus bertahan dan kapan harus melepas?" },
    { id: "rel-010", category: "Hubungan", text: "Apa satu hal yang kamu harap orang-orang mengerti tentang dirimu?" },

    // Emosi (8)
    { id: "emo-001", category: "Emosi", text: "Emosi apa yang paling sering kamu tahan-tahan?" },
    { id: "emo-002", category: "Emosi", text: "Hal apa yang akhir-akhir ini bikin kamu merasa berat, tapi jarang kamu ceritakan?" },
    { id: "emo-003", category: "Emosi", text: "Kalau kamu lagi cemas, apa yang paling membantu menenangkanmu?" },
    { id: "emo-004", category: "Emosi", text: "Kapan terakhir kali kamu bangga sama diri sendiri?" },
    { id: "emo-005", category: "Emosi", text: "Apa yang biasanya memicu kamu jadi defensif?" },
    { id: "emo-006", category: "Emosi", text: "Apa yang kamu pengen maafin dari masa lalu, tapi masih sulit?" },
    { id: "emo-007", category: "Emosi", text: "Apa tanda kecil kalau kamu sebenarnya lagi capek?" },
    { id: "emo-008", category: "Emosi", text: "Kalau kamu bisa ngomong jujur tanpa takut dihakimi, kamu mau bilang apa sekarang?" },

    // Kehidupan (14)
    { id: "life-001", category: "Kehidupan", text: "Rutinitas apa yang diam-diam paling berpengaruh ke hidupmu?" },
    { id: "life-002", category: "Kehidupan", text: "Apa prinsip hidup yang paling kamu pegang saat ini?" },
    { id: "life-003", category: "Kehidupan", text: "Hal kecil apa yang bikin harimu membaik?" },
    { id: "life-004", category: "Kehidupan", text: "Apa definisi ‘bahagia’ versi kamu, tanpa jawaban yang terdengar keren?" },
    { id: "life-005", category: "Kehidupan", text: "Kapan kamu merasa paling ‘jadi diri sendiri’?" },
    { id: "life-006", category: "Kehidupan", text: "Apa kebiasaan yang pengen kamu hentikan karena sudah nggak sehat?" },
    { id: "life-007", category: "Kehidupan", text: "Apa hal yang paling kamu syukuri akhir-akhir ini?" },
    { id: "life-008", category: "Kehidupan", text: "Kalau hidupmu adalah buku, bab apa yang sedang kamu jalani sekarang?" },
    { id: "life-009", category: "Kehidupan", text: "Apa hal yang kamu pelajari dengan cara yang ‘mahal’?" },
    { id: "life-010", category: "Kehidupan", text: "Apa hal yang kamu ingin orang lain tidak menilai dari kamu?" },
    { id: "life-011", category: "Kehidupan", text: "Kapan terakhir kamu benar-benar istirahat tanpa merasa bersalah?" },
    { id: "life-012", category: "Kehidupan", text: "Apa hal yang paling ingin kamu pertahankan sampai tua nanti?" },
    { id: "life-013", category: "Kehidupan", text: "Apa yang kamu lakukan saat merasa kehilangan arah?" },
    { id: "life-014", category: "Kehidupan", text: "Kalau kamu bisa mengubah satu keputusan kecil di masa lalu, apa itu dan kenapa?" },
  ],
};
