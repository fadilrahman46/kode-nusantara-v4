# Rencana Produksi MVP — Kode Nusantara

**Tanggal:** 12 November 2026 · **Fase:** 2 → 3 (menunggu go/no-go dari playtest nyata)
Dokumen ini menjawab Stage 3: inventaris konten & estimasi (B2), review #9 dan #10 (B6), nasib kode prototipe (B4), dan urutan produksi (C1–C6).

---

## 0. Keputusan pemilik (12 Nov 2026)

- **Kenaikan scope diterima:** MVP 27 stage (Beginner 13, Junior 14); estimasi ±315–480 jam.
- **Logika boolean diajarkan:** J05 Syarat Ganda dan sensor sakelar B12 menjadi bagian MVP.
- **B08 dikerjakan di prototipe** (selesai, v4). Biaya nyata belum dicatat: isi kolom "Jam nyata" untuk kalibrasi.

## 1. Inventaris konten & estimasi (B2)

**Status estimasi:** jam di bawah adalah **asumsi** untuk satu pengembang paruh waktu, belum dikalibrasi dengan jam nyata. Kolom "Jam nyata" diisi olehmu.

| Item | Jumlah | Jam per item (asumsi) | Total (asumsi) | Jam nyata |
|---|---|---|---|---|
| Mesin game: perulangan (termasuk bersarang), syarat gabungan, Mesin + parameter + keluaran, Rak, **slot nilai**, kartu bersarang di sentuh | 1 | — | 66–100 | |
| Stage Pulau Perintah (10 K/P × 3–5 jam + 3 L × 2–3 jam) | 13 | — | 36–59 | |
| Stage Pulau Mesin (10 K/P × 4–6 jam + 4 L × 2–3 jam) | 14 | — | 48–72 | |
| Riddle gerbang MVP (3 Beginner + 3 Junior; 3 bentuk per riddle) | 6 | 1,5–2,5 | 9–15 | |
| Teks hint (3 tingkat per stage) | 81 | ±0,25 | 20–25 | |
| Placement Test 1: 21 butir templat + UI + tes ulang | 1 | — | 20–30 | |
| Meta: peta, badge, skor, kode progres, simpan | 1 | — | 25–40 | |
| Seni: Bit, 3 NPC, 2 pulau, integrasi aset CC0 | 1 | — | 25–40 | |
| Audio: SFX + 2 musik | 1 | — | 8–12 | |
| UI HP, aksesibilitas, bahasa | 1 | — | 20–30 | |
| Uji otomatis + 2–3 ronde playtest | 1 | — | 30–45 | |
| Rilis: hosting, privasi, dokumen | 1 | — | 8–12 | |
| **Total** | | | **±315–480** | |

*Diperbarui 12 Nov setelah review stage Beginner/Junior: MVP 22 → 27 stage; selisih ±+12–19 jam (stage latihan murah, tetapi mekanik baru bersarang/syarat gabungan/slot nilai menambah pekerjaan mesin game). Middle–Expert tidak termasuk MVP.*

**Artinya:** pada 10 jam/minggu, MVP butuh **±31–48 minggu**; pada 15 jam/minggu, **±21–32 minggu**.

**Kandidat potongan** (pilih sampai totalnya realistis untukmu):
| Potongan | Hemat (asumsi) | Dampak |
|---|---|---|
| Riddle bentuk Sulit (susun ubin) diganti pilihan ganda | 6–8 jam | Sulit sedikit kurang menantang |
| Soal Placement Test berupa gambar 2D statis, bukan adegan 3D | ±8 jam | Tampilan lebih sederhana |
| Pulau Mesin 10 stage, bukan 12 | 8–12 jam | Konsep Junior lebih padat |
| Pak Rakit dihapus; Nek Urut mentor di dua pulau | ±5 jam | Variasi karakter berkurang |
| Musik dari aset CC0 | ±4 jam | — |

**Kalibrasi:** catat jam nyata untuk 2 tugas berikutnya, lalu kalikan semua estimasi dengan rasio (jam nyata ÷ estimasi). Estimasi tanpa kalibrasi untuk proyek solo biasanya terlalu optimis.

---

## 2. Review #9 dan #10 (B6) — keputusan

| # | Masalah | Keputusan |
|---|---|---|
| #9 (G2 lama) | Junior padat: hampir setiap stage memperkenalkan mekanik baru, tanpa stage latihan | **Ganti Junior stage 8 "Mesin di dalam Mesin" dengan stage latihan Mesin**, dan jadikan stage 4 latihan perulangan + kondisional. Komposisi fungsi dipindah ke Middle A sebagai pengantar rekursi. Jumlah stage tetap 12 |
| #10a (T3) | Pembagian tidak habis | **Selesai di prototipe:** ditolak dengan pesan "tidak bisa dibagi rata". Data level hanya memakai pembagian yang habis |
| #10b (T1) | Batas tes ulang hanya dijaga localStorage | **Terima risikonya.** Tambahkan checksum sederhana pada kode progres; jangan klaim badge sebagai bukti kemampuan |
| #10c (K4) | Tidak ada data efektivitas belajar setelah rilis | **Pilot 1 sekolah** dengan pre/post-test di luar game (memakai soal Placement Test). Statistik anonim opt-in hanya setelah kajian UU PDP |

---

## 3. Nasib kode prototipe (B4) — rekomendasi, keputusan di tanganmu

| Opsi | Kelebihan | Kekurangan |
|---|---|---|
| **A. Prototipe jadi fondasi** (lanjutkan satu berkas HTML) | Tercepat untuk 2–3 stage berikutnya | Satu berkas ±940 baris + Three.js tidak akan bertahan sampai 22 stage, banyak kartu, dan data level |
| **B. Prototipe jadi spesifikasi hidup; produksi di repo TypeScript + Vite** (rekomendasi) | Sesuai arsitektur GDD §8; modul terpisah (interpreter murni, data level JSON, editor, renderer); uji bisa dipindah ke Vitest + Playwright | Butuh ±1–2 minggu untuk memindahkan dasar sebelum konten baru |
| C. Mulai dari nol | Bebas | Membuang interpreter dan 6 suite uji yang sudah terbukti |

**Rekomendasi: B**, dengan dua syarat:
1. Mulai **setelah** playtest nyata memberi Go.
2. Pindahkan yang sudah terbukti lebih dulu: interpreter, data stage, dan uji T1/T2 sebagai uji regresi.

---

## 4. Urutan produksi (C1–C6)

**Gerbang:** C1 boleh dimulai sekarang. **C2–C6 hanya setelah playtest nyata = Go** (kriteria di *Playtest_Kit_P0_P1.md* §8).

### C1 — Perbaikan yang siap dikerjakan (tidak bergantung pada data anak)
| Tugas | Sumber | Estimasi (asumsi) | Uji penerimaan |
|---|---|---|---|
| UI berbahasa Indonesia: Petunjuk, Mudah/Sedang/Sulit, Tahap | G1 | 1 jam | Tidak ada istilah Inggris di UI anak (cek otomatis) |
| Hint 3 = kartu pertama solusi saja | F15 | 1 jam | T2: teks hint 3 tidak memuat semua kartu solusi |
| Modal hasil tertunda 1,6 detik, tanpa menggelapkan dunia | F16 | 1 jam | Screenshot: lampu menyala terlihat saat modal muncul |
| Pengali Sulit ×1,5 sampai varian data level ada | F13 | 15 menit | T2: skor Sulit = 150 untuk 3★ |
| Pesan gagal lebih ramah ("Tidak apa-apa, coba lagi!") | G3 | 15 menit | — |

**Sengaja tidak di C1:** H1/G2 (kartu tidak tampak bisa diubah) dan F14 (ikon Maju). Keduanya hipotesis yang ingin diuji di playtest; memperbaikinya lebih dulu menghapus kesempatan membuktikannya.

### C2–C6 — Setelah Go (garis besar)
| Urutan | Tugas | Estimasi (asumsi) | Selesai jika |
|---|---|---|---|
| C2 | Repo TypeScript + Vite (B4-B), pindahkan interpreter + uji; lalu P2 Junior stage 5–6 (Mesin, kartu bersarang di sentuh) | 2–3 minggu | Kriteria P2 di GDD §11 lulus pada 5 siswa SMP |
| C3 | Placement Test 1 + 21 varian templat + tes ulang | 3–4 hari | Validasi butir pada 30–50 siswa |
| C4 | Pulau Perintah 10 stage | ±3–4 minggu | Semua stage lolos uji otomatis + 1 ronde playtest |
| C5 | Pulau Mesin 12 stage | ±4–6 minggu | Sama |
| C6 | Rilis: hosting sendiri, uji lintas browser, pilot sekolah | 1–2 minggu | Checklist perangkat nyata lulus; pilot berjalan |
