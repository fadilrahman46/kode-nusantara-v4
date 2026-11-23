> **ARSIP — jangan dipakai sebagai acuan.** Struktur tingkat, segmen, dan teknologi di dokumen ini sudah digantikan oleh *Progression_Placement_Design.md* dan *GDD_MVP.md*. Disimpan hanya sebagai catatan sejarah keputusan.

# Game Concept Brief — *Kode Nusantara* (working title)

**Fase:** 1 — Planning & Concept
**Versi:** v0.2. Berubah dari v0.1: tanpa bahasa pemrograman, segmen SD–SMA, 5 tingkat, rilis publik.
Semua yang berlabel `ASUMSI:` wajib dikonfirmasi.

---

## 1. Core gameplay (satu kalimat)

Pemain **memanipulasi objek di dunia 3D yang merepresentasikan konsep pemrograman** untuk memecahkan puzzle. Contohnya: kotak berlabel adalah variabel, mesin adalah fungsi, dan cetakan adalah class. Setiap puzzle yang selesai membuka konsep dan wilayah berikutnya.

> Prinsip: **konsepnya adalah mekaniknya.** Pemain tidak bisa menang tanpa memakai konsep itu dengan benar.

## 2. Perubahan besar: tanpa bahasa pemrograman

Karena tidak ada sintaks yang diketik, input pemain berupa:

| Mode input | Dipakai untuk |
|---|---|
| **Kartu perintah** (drag & drop, disusun berurutan) | Urutan, perulangan, kondisional |
| **Objek dunia** (diambil, diberi label, dimasukkan, disambungkan) | Variabel, array, fungsi, objek |
| **Diagram/peta** (menyambung node) | Pewarisan, struktur data, rekursi |

**Jembatan opsional "Lihat versi kode":** setelah puzzle selesai, pemain bisa melihat pseudocode dari solusinya. Fitur ini tidak wajib, tapi penting agar konsep bisa ditransfer ke bahasa nyata nanti.

**Konsekuensi teknis:** JS-Interpreter dari v0.1 dibatalkan. Sebagai gantinya dibuat **interpreter mini milik sendiri** yang menjalankan susunan kartu/objek (struktur data sederhana, langkah demi langkah). Cara ini lebih sederhana, lebih aman, dan mudah dianimasikan.

## 3. Lima tingkat & pemetaan konsep

| Tingkat | Konsep | Metafora dunia (contoh) | Segmen paling cocok |
|---|---|---|---|
| **Beginner** | Urutan, perulangan, kondisional dasar | Robot mengikuti kartu; jalan bercabang | SD kelas 3–6 |
| **Junior** | Variabel, tipe data, operator, logika boolean | Kotak berlabel; timbangan; gerbang AND/OR | SD kelas 5 – SMP |
| **Middle** | Fungsi, parameter, return, array/list | Mesin dengan lubang input/output; rak bernomor | SMP |
| **Senior** | OOP: class, objek, atribut, method, pewarisan, enkapsulasi | Cetakan → hasil cetakan; silsilah cetakan; brankas | SMA |
| **Expert** | Rekursi, search & sort, stack/queue/tree, efisiensi | Cermin dalam cermin; menyusun buku; antrean; pohon akar | SMA akhir |

`ASUMSI:` tingkat ditentukan oleh **penguasaan**, bukan kelas. Siswa SD boleh lanjut ke Junior kalau sudah lulus Beginner.

## 4. Game loop

```
Masuk ruangan → NPC/riddle beri masalah → susun kartu/objek → jalankan & amati
      ↑                                                     ↓
 unlock konsep/wilayah ← dapat bintang ← debug & ulangi ←───┘
```

Meta-loop: Wilayah (1 konsep) → 8–12 ruangan → Puzzle penutup gabungan → wilayah berikutnya → Ujian tingkat → naik tingkat.

**Bintang:** (1) selesai, (2) langkah eksekusi efisien, (3) susunan paling ringkas. Ini mendorong pemakaian loop/fungsi, bukan pengulangan manual.

## 5. Platform & tech

| Komponen | Pilihan |
|---|---|
| Render | Three.js, low-poly, kamera isometrik tetap |
| Perangkat target | **Laptop/Chromebook sekolah DAN browser HP Android kelas bawah** (kontrol sentuh wajib) |
| Logika | Interpreter kartu/objek buatan sendiri |
| Save | localStorage (MVP), **tanpa akun** |
| Bahasa UI | Indonesia |
| Hosting | Static (itch.io / GitHub Pages / Cloudflare Pages) |

## 6. Art style

Low-poly dengan palet hangat, **netral usia**: tidak bayi untuk anak SMA dan tidak gelap untuk anak SD. Narasi memakai kalimat pendek dengan dukungan ikon (karena pembaca SD awal). `ASUMSI:` tidak ada artist khusus, jadi aset CC0 dipakai di awal.

## 7. Scope & MVP

- `ASUMSI:` tim 1–3 orang (belum dikonfirmasi).
- **MVP rilis publik = Tingkat Beginner lengkap** (3 wilayah, ±25–30 ruangan) + 1 wilayah demo Junior sebagai teaser.
- Tingkat Junior sampai Expert dirilis bertahap sebagai update.
- Di luar MVP: akun, dashboard guru, leaderboard, multiplayer, dan monetisasi.

## 8. Roadmap kasar

| Tahap | Milestone |
|---|---|
| M1–2 | Prototipe 2 ruangan: 1 Beginner (loop) + 1 Senior (class/objek). **Ini menguji metafora tersulit lebih awal.** |
| M3 | GDD + desain ruangan Beginner di kertas |
| M4–8 | Produksi Beginner + demo Junior |
| M9 | Playtest SD/SMP (20+ anak), pre/post-test konsep |
| M10–11 | Polish, uji perangkat murah, rilis publik v1.0 |
| Pasca-rilis | Junior → Middle → Senior → Expert, ±1 tingkat per 2–3 bulan |

## 9. Risiko utama

1. **Rentang usia 7–17 tahun terlalu lebar** untuk satu gaya bahasa, visual, dan humor. Mitigasi: art netral, sedangkan teks dan kesulitan menyesuaikan tingkat.
2. **Metafora OOP/rekursi bisa menyesatkan.** "Cetakan kue" adalah analogi populer, tapi gagal menjelaskan method dan enkapsulasi. Mitigasi: prototipe metafora Senior di minggu 1–2.
3. **Transfer belajar.** Paham "kotak berlabel" belum tentu bisa menulis `x = 5`. Mitigasi: jembatan "Lihat versi kode" dan pengukuran pre/post-test.
4. **Data anak (UU PDP No. 27/2022, plus COPPA jika ada pengguna AS).** Memproses data anak butuh persetujuan orang tua. Mitigasi: MVP tanpa akun, tanpa analytics yang mengidentifikasi, dan tanpa iklan.
5. **Performa Three.js di HP murah.** Mitigasi: batas poligon, tanpa bayangan real-time, dan uji di HP 2–3 GB RAM sejak M2.
6. **Kompetitor gratis** (Code.org, Lightbot, Scratch). Diferensiasi: konsep sampai OOP & algoritma tanpa sintaks, berbahasa Indonesia, berbasis web.

## 10. Kriteria lulus ke Fase 2

- [x] Segmen pemain: SD, SMP, SMA
- [x] Pendekatan: konsep tanpa bahasa pemrograman
- [x] Tujuan: rilis publik
- [x] Struktur: 5 tingkat
- [ ] Ukuran tim & deadline
- [ ] Model bisnis (gratis / donasi / lisensi sekolah)
- [ ] Prototipe metafora Beginner + Senior lolos uji: anak menyelesaikan puzzle tanpa bantuan dan bisa menjelaskan konsepnya kembali
