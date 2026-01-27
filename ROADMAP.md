# MainKartu Roadmap

Dokumen ini berisi rencana update fitur dan konten untuk MainKartu.

## Visi
MainKartu adalah web app kartu pertanyaan untuk berbagai vibe obrolan:
- Deep Talk (mendalam)
- Have Fun (seru & ringan)
- Pasangan / Suami Istri (quality time & komunikasi)

## 1) Konten: Deck / Paket Kartu

### 1.1 Deck yang direncanakan
- **Deep Talk** (sudah ada)
- **Have Fun**
  - Ice breaker
  - A/B choices
  - “Most likely to”
  - mini challenge ringan
- **Pasangan / Suami Istri**
  - komunikasi & kebutuhan
  - konflik & resolusi
  - finansial & perencanaan
  - pembagian peran & rumah tangga
  - keluarga/parenting (opsional)
  - kedekatan & intimacy (tetap sopan, dengan toggle)

### 1.2 Deck tambahan (opsional)
- Sahabat
- Keluarga
- First Date
- Team/Komunitas

## 2) UX: Pilih Deck

### 2.1 MVP pilih deck
- Tambah layar **Pilih Deck** (sebelum Setup), berisi kartu/tiles:
  - Deep Talk
  - Have Fun
  - Pasangan
- Setelah pilih deck → lanjut ke Setup → Play.

### 2.2 Filter per deck (optional)
- Filter kategori (chip)
- Filter level (ringan → dalam)
- “Durasi sesi”: 5/10/20 menit (membatasi jumlah kartu yang keluar)

## 3) Mode Permainan

### 3.1 Quick Play (default)
- Tekan Kartu Berikutnya → draw pertanyaan.

### 3.2 Mix Mode (optional)
Contoh:
- 3 kartu ringan → 1 kartu deep
- atau sesuai deck (Have Fun lebih banyak ringan)

### 3.3 Couple Mode (Pasangan)
- Toggle “Topik sensitif” ON/OFF
- Opsional giliran (tanpa maksa)

## 4) TOD (Truth or Dare) Enhancements

Sudah ada TOD random + popup. Next:
- Riwayat TOD (tab khusus di modal riwayat)
- Tombol Copy/Share untuk TOD
- Limit reroll (optional) supaya terasa game

## 5) Admin & Data

### 5.1 Target struktur data: multi-deck
Tujuan: Deep Talk/Have Fun/Pasangan cukup nambah data, tanpa ubah logic.

Opsi struktur JSON (disarankan):
```json
{
  "version": "2026-01-27",
  "updatedAt": "2026-01-27T00:00:00Z",
  "decks": [
    {
      "id": "deep-talk",
      "name": "Deep Talk",
      "cards": [
        { "id": "deep-001", "text": "...", "category": "Kehidupan", "level": 2 }
      ]
    },
    {
      "id": "have-fun",
      "name": "Have Fun",
      "cards": [
        { "id": "fun-001", "text": "...", "category": "Icebreaker", "level": 1 }
      ]
    }
  ]
}
```

### 5.2 Admin publish
- Admin upload JSON → validasi schema → publish
- Versi & rollback (optional)

## 6) Milestone

### M1 — Multi-deck (Core)
- Tambah layar pilih deck
- Update schema & loader data
- Simpan deck terakhir di localStorage

### M2 — Deck Have Fun
- Tambah 100–200 kartu Have Fun
- Kategori ringan + mini games

### M3 — Deck Pasangan / Suami Istri
- Tambah 150–300 kartu pasangan
- Toggle topik sensitif

### M4 — Admin Proper (Auth + Blob)
- Login admin (OAuth)
- Publish multi-deck JSON ke Vercel Blob

## 7) Catatan Konten
- Hindari copy pertanyaan dari produk orang lain.
- Pastikan pertanyaan original dan aman digunakan.
- Sediakan toggle untuk topik yang lebih sensitif.
