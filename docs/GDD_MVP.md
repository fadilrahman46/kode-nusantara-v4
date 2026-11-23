# Game Design Document — *Kode Nusantara* (MVP)

**Versi:** v0.4 (dokumen hidup). **Bagian "Perubahan v0.4", lalu "Perubahan v0.3", di bawah mengesampingkan bagian lama yang bertentangan.**
**Perubahan dari v0.1:** perbaikan hasil review (Review_Dokumen_MVP.md butir 1–7): alur awal tanpa tes di depan + onboarding Papan Program, stage Beginner 4 dirancang ulang, kriteria bintang per stage, aturan riddle anti-blokir, bantuan di Hard, batas usia SD kelas 4, kebersihan dokumen.
**Fase:** 2 — Pre-Production
**Cakupan dokumen:** hanya MVP = **Placement Test 1 + Mode Beginner + Mode Junior**.
Sistem lengkap (Middle A/B, Senior, Expert, Test 2, sertifikat) ada di *Progression_Placement_Design.md v0.6*.


## Catatan v0.5 — prototipe v6 (15 Nov 2026)
Prototipe memuat seluruh 13 stage Beginner. Dua hal dari prototipe yang **belum** sejalan dengan teks GDD di bawah: (1) kartu **Jika** di prototipe adalah satu kartu dengan satu tindakan per jalur, belum kartu wadah bersarang (§3 "bisa memuat kartu lain"); (2) stage dengan variasi acak dinilai terhadap **semua** keadaan, dan pesan gagalnya menyebut keadaan yang belum terpenuhi. Detail dan penyimpangan lain: Dokumentasi_Testing_Prototipe.md §15.5. GDD belum diubah isinya; keputusan apakah wadah bersarang dibuat sebelum Junior menunggu hasil playtest B05–B07.

## Perubahan v0.4 — hasil review stage Beginner & Junior (12 Nov 2026)

Sumber: *Review_Stage_Beginner_Junior.md*, *Kurikulum_Stage_v0.3.md*, `design_lint/`. Daftar stage 6 mode yang berlaku ada di *Kurikulum_Stage_v0.3.md*; §6.2 dan §6.3 di bawah adalah salinannya untuk MVP.

| Bagian | Perubahan (berlaku) |
|---|---|
| §6.2 Beginner | **10 → 13 stage** dengan pola kenalkan→latih→pelintir (stage latihan B04, B07, B11); pembanding menjadi stage sendiri (B12); penutup B13 |
| §6.3 Junior | **12 → 14 stage**: + Ulangi bersarang (J03) + Syarat gabungan TIDAK/DAN/ATAU (J05); "Mesin di dalam Mesin" dipindah ke Middle A (MA02); latihan J02, J06, J10, J13 |
| §3.3 / §3.13 | + sensor sakelar; + kartu **TIDAK · DAN · ATAU**; Ulangi boleh bersarang; + **slot nilai** (spesifikasi baru) |
| §10 MVP scope | Pulau Perintah 13 stage, Pulau Mesin 14 stage (MVP = 27 stage) |
| Pemetaan prototipe | Prototipe v4 memakai label ID kurikulum: **B01** Pengantar, **B08** Jembatan Panjang (variabel; baru), **B09** Kotak Berbentuk, **B10** Timbangan Pasar |
| B08 "Jembatan Panjang" (variabel) | Stage pertama yang memperkenalkan **Isi kotak**. Dua tepian dipisah 3 petak air; **jembatan dibangun saat kartu Isi kotak dijalankan, sepanjang angka di kotak "langkah", dan tetap ada** (Bit tidak pernah berdiri di atas air walau kotak kemudian diisi angka lebih kecil). Kartu Isi kotak bawaan berisi **1 (sengaja salah)** sehingga pemain harus menemukan cara mengubahnya. Batas 7 kartu; solusi terpendek 6 kartu (Isi 3/4/5 + 5 × Maju). Pesan "Byur!" membedakan "belum ada jembatan" dan "jembatan kurang panjang" |
| Keputusan pemilik (12 Nov) | Logika boolean diajarkan (J05 + sensor sakelar B12); kenaikan scope MVP 27 stage diterima; B08 dikerjakan di prototipe |

## Perubahan v0.3 — sinkron dengan prototipe v3 dan simulasi playtest (12 Nov 2026)

Sumber: prototipe v3 yang diuji otomatis (*Dokumentasi_Testing_Prototipe.md* §12) dan simulasi (*Simulasi_Playtest_dan_Analisis.md*). Butir bertanda **[hipotesis]** menunggu playtest nyata.

| Bagian | Perubahan (berlaku) |
|---|---|
| §3.1 Papan Program | Kartu di papan dipindah lewat **gagang ⠿** (target ≥ 40×48 px); badan kartu bisa digeser untuk menggulir papan dan diketuk untuk membuka pemilih. Mengetuk kartu palet juga menambah kartu. Papan otomatis menggulir ke kartu baru |
| §3.1 Membuang kartu | Layar lebar: tong sampah 🗑️. Layar sempit: seret kartu kembali ke deretan kartu (zona "Lepas di sini untuk membuang") |
| §3.8/§3.12 Hint *(hint 3 parsial sudah di prototipe v5 untuk B08–B10; sisanya spesifikasi)* | Hint 3 = **contoh parsial** (kartu pertama solusi), bukan jawaban penuh (F15). Label UI: **"💡 Petunjuk"** |
| §3.9 Tingkat kesulitan *(spesifikasi; belum di prototipe)* | Label UI **Mudah/Sedang/Sulit**. **Sulit memakai varian data level** (target/angka/batas berbeda) yang solusi terpendeknya berbeda dari Mudah; sampai varian tersedia, pengali Sulit ×1,5 (F13) |
| §3.10 Bintang | Teks hasil menyebut jumlah percobaan sebenarnya; istilah "hint pengurang skor" |
| Dialog NPC (baru) | Dialog dipecah per halaman (≤ 110 karakter; ≤ 80 di layar kecil) dengan tombol "Lanjut ▸"; tombol 💬 untuk membuka ulang. **Instruksi tindakan selalu di halaman pertama.** Di HP potret dialog berada di atas papan; di layar lain kamera memaskan adegan ke area di atas dialog |
| §6.2 Stage 7 | Tiga kotak di baris depan berjarak 2 petak; peti berisi **5 ikan terpisah** dua warna; papan nama "perahu: Kenari"; mercusuar kecil di belakang. **[hipotesis H1]** cara mengubah isi kartu mungkin sulit ditemukan; jangan diubah sebelum playtest |
| §6.2 Stage 8 | **Batas 3 kartu** (semua solusi wajib memakai ×). **[hipotesis H2]** bisa gagal karena aritmetika |
| §7.2 Layar Stage | Potret: dunia ±38% tinggi, dialog di panel bawah, kontrol 1 baris berikon (label disembunyikan, `aria-label` tetap), nama tahap di topbar. Lanskap pendek (tinggi ≤ 500 px): tata letak baris dipadatkan |
| §7.3 Hasil *(spesifikasi; belum di prototipe)* | Modal muncul setelah ±1,6 detik sebagai lembar bawah tanpa menggelapkan dunia (F16) |
| Label 3D | Label objek dirender sebagai **elemen HTML** yang diproyeksikan (huruf 12–13 px di semua layar); versi ringkas (ikon + isi) bila jarak antar-objek sempit |
| §8.1/§8.5 Teknis | Three.js r128 **disematkan** dalam satu berkas (±0,65 MB) agar jalan tanpa internet/CDN. Geometri dan material di-*dispose* saat ganti tahap |
| §11 Prototype plan | Instrumen playtest: *Playtest_Kit_P0_P1.md*. Kriteria tambahan: keterbacaan Stage 7 (≥ 4/5) dan arah kartu Maju (≥ 4/5, F14) |
| §12 Risiko | + G2/H1 kartu tidak tampak bisa diubah; + H2 aritmetika Stage 8; + ketergantungan akses ke anak untuk playtest |

---

## 1. Overview

| | |
|---|---|
| **Genre** | Puzzle + riddle logika pemrograman dengan kerangka RPG ringan |
| **Platform** | Web browser: laptop/Chromebook dan HP Android (sentuh) |
| **Audiens MVP** | Pelajar **SD kelas 4** – SMP (Beginner–Junior). Batas bawah SD kelas 4 dikunci. |
| **Bahasa** | Indonesia |
| **Pitch** | Bantu robot Bit menyalakan kembali mercusuar Nusantara dengan menyusun kartu perintah. Setiap pulau mengajarkan satu cara berpikir seorang programmer. |
| **Model** | `ASUMSI:` gratis, tanpa iklan, tanpa akun |

## 2. Core gameplay loop

```
Dengar masalah dari NPC / riddle
        ↓
Susun kartu perintah di Papan Program
        ↓
Jalankan (atau jalankan langkah demi langkah) → Bit beraksi di dunia 3D
        ↓
Berhasil? ── tidak → amati di baris mana Bit gagal → perbaiki ──┐
   │ ya                                                          │
   ↓                                                             │
Bintang + skor → (opsional) "Lihat versi kode" → stage berikutnya
                                                     ↑───────────┘
```

**Meta-loop:** Stage → Misi (1–4 stage + riddle gerbang) → Pulau (mode) → Badge.

## 3. Mekanik

### 3.1 Papan Program (input utama)
- Pemain **menyeret kartu** dari Palet ke Papan Program. Kartu tersusun vertikal dan dijalankan dari atas ke bawah.
- Kartu berbentuk wadah (Jika, Ulangi, Mesin) bisa **memuat kartu lain** (bersarang), ditandai dengan lekukan seperti puzzle.
- Ketuk kartu → ubah parameternya (angka, arah, nama kotak) lewat pemilih besar yang ramah sentuh. **Tidak ada keyboard.**
- Batas kartu per stage ditentukan data level.

### 3.2 Kontrol eksekusi
| Tombol | Fungsi |
|---|---|
| ▶ Jalankan | Menjalankan seluruh program dengan animasi |
| ⏭ Langkah | Menjalankan satu kartu, lalu menyorot kartu berikutnya (tidak tersedia di Hard) |
| ⏹ Ulang | Mengembalikan dunia ke kondisi awal |
| 🐢 / 🐇 | Kecepatan animasi |

Kartu yang sedang dijalankan **menyala**. Jika gagal, kartu penyebabnya **berkedip merah** dan Bit menunjukkan reaksi (menabrak, bingung, atau jatuh). Tidak ada pesan error teknis.

### 3.3 Set kartu MVP

| Kelompok | Kartu | Mode |
|---|---|---|
| Gerak | Maju · Belok kiri · Belok kanan · Ambil · Taruh · Tekan tombol | Beginner |
| Sensor (kondisi) | Ada tembok? · Warna lantai = …? · Ada benda? · Kotak … (=, ≠, <, >) … · Kotak sakelar nyala? | Beginner |
| Kondisional | Jika … maka … · Jika … maka … selain itu … | Beginner |
| Data | Isi kotak … dengan … · Ubah kotak … (+ − × ÷) … | Beginner |
| Perulangan | Ulangi … kali (boleh bersarang) · Selama … | Junior |
| Syarat gabungan | TIDAK · DAN · ATAU (dipakai di kartu Jika dan Selama) | Junior |
| Fungsi | Buat Mesin (nama, masukan) · Jalankan Mesin · Keluarkan … | Junior |
| List | Rak: ambil isi ke-… · Taruh di rak · Untuk setiap isi rak … | Junior |

### 3.4 Kotak (variabel) & tipe data
- Kotak adalah objek 3D berlabel di dunia. Isinya terlihat dan berubah dengan animasi.
- **Tipe data sebagai bentuk fisik:** kotak **bulat** = angka, kotak **persegi** = teks, kotak **sakelar** = benar/salah. Nilai yang tidak cocok bentuknya ditolak dengan animasi "tidak muat". Pemain belajar konsep tipe tanpa definisi.

### 3.5 Matematika dasar
- Kartu Ubah kotak memakai operator + − × ÷.
- Pada stage gabungan, ekspresi ditampilkan sebagai **susunan balok**: balok × dan ÷ menempel lebih dulu, sehingga urutan operasi terlihat secara visual.
- Matematika **selalu terikat aksi**. Contohnya: hasil hitungan menentukan berapa langkah jembatan muncul, atau berat yang harus ditaruh di timbangan. Tidak ada soal hitungan lepas.

### 3.6 Rak (list) — Junior
Rak bernomor **mulai dari 0** sebagai objek dunia. Bit bisa mengambil, menaruh, dan menelusuri rak dengan "Untuk setiap isi rak".

### 3.7 Mesin (fungsi) — Junior
Pemain membuat Mesin di bengkel. Bentuknya: wadah berisi kartu + lubang masukan (parameter) + corong keluaran (nilai keluaran). Mesin muncul sebagai kartu baru di Palet dan bisa dipakai berulang. Inilah inti pemahaman "dipakai ulang".

### 3.8 Riddle
- **Gerbang Misi:** teka-teki logika di akhir setiap misi, misalnya pola atau deduksi **satu langkah** untuk Beginner. Deduksi bertingkat baru dipakai mulai Junior.
- **Aturan anti-blokir:** riddle gerbang tidak pernah mengunci progres.
  - Salah 2 kali → Si Teka memberi petunjuk.
  - Salah 3 kali → gerbang terbuka, tetapi bonus misi (+10%) untuk misi itu tidak diberikan. Pemain boleh kembali kapan saja untuk mendapatkan bonusnya.
  - "Mode selesai" dihitung dari gerbang yang sudah **dilewati**, bukan yang dijawab benar.
- **Bentuk jawaban per tingkat kesulitan:** pilihan ganda (Easy) → pilihan ganda dengan pengecoh mirip (Medium) → **menyusun ubin jawaban** dari kepingan yang tersedia (Hard). Tidak ada input keyboard di tingkat mana pun.
- **Riddle sebagai hint:** lihat §3.12.

### 3.9 Tingkat kesulitan
Layout stage **sama**; parameternya berbeda (lihat *Progression v0.6 §6*): pengecoh kartu, aturan hint, target bintang, bentuk riddle, dan pengali skor ×1 / ×1.5 / ×1.5 *(prototipe v7; ×2 untuk Sulit dikembalikan hanya jika varian data Sulit sudah ada, lihat Dokumentasi_Testing §16)*. Tombol **Langkah tersedia di semua tingkat**; di Hard, memakainya menurunkan pengali stage itu menjadi ×1.75. Tanpa timer.

### 3.10 Bintang
Kriteria bintang **ditentukan per stage** di data level dan dikaitkan dengan konsep yang diajarkan. Templat bawaan:

**Beginner** (belum ada perulangan, sehingga jumlah langkah ≈ jumlah kartu):
| Bintang | Syarat |
|---|---|
| ★ | Tujuan tercapai |
| ★★ | Tanpa hint berbayar (hint tingkat 2–3) |
| ★★★ | Berhasil dalam ≤ N kali tekan Jalankan: Easy ≤ 3, Medium ≤ 2, Hard 1 |

**Junior** (perulangan membuat efisiensi bermakna):
| Bintang | Syarat |
|---|---|
| ★ | Tujuan tercapai |
| ★★ | Jumlah langkah eksekusi ≤ target |
| ★★★ | Jumlah kartu ≤ target |

**Stage dengan unsur acak:** program dinilai terhadap **semua seed uji** stage itu (misalnya 4–8 seed). Program harus benar di semua kemungkinan untuk mendapat ★, dan jumlah langkah yang dinilai untuk ★★ adalah nilai **terburuk** dari semua seed. Dengan begitu, hasil acak tidak memengaruhi bintang.

### 3.11 "Lihat versi kode"
`ASUMSI:` disertakan di MVP dalam versi ringan. Setelah stage selesai, solusi pemain ditampilkan sebagai **pseudocode berbahasa Indonesia** (misalnya `ulangi 4 kali: maju()`). Fitur ini opsional dan tidak dinilai.

### 3.12 Hint
| | Easy | Medium | Hard |
|---|---|---|---|
| Hint tingkat 1 — riddle samar | Gratis | Gratis | Gratis |
| Hint tingkat 2 — arah konsep | Gratis | −10% skor stage | −15% skor stage |
| Hint tingkat 3 — contoh parsial | −10% skor stage | −10% skor stage | Tidak tersedia |

Riddle hint selalu gratis karena berfungsi sebagai materi belajar. Pemain Hard yang macet tetap punya hint arah konsep, tombol Langkah, dan opsi pindah ke Medium untuk stage itu.

### 3.13 Slot nilai

Kartu yang menerima nilai memiliki **slot nilai** berbentuk *chip*, bukan ekspresi bebas. Pilihan chip: angka/teks/sakelar (pemilih seperti di prototipe), **Isi kotak …**, **Hasil Mesin …** (muncul bersama kartu Keluarkan, J09) dan **Isi rak sekarang** (muncul bersama Untuk setiap, J12). Hanya satu tingkat (tidak ada chip di dalam chip). Komposisi fungsi (hasil Mesin sebagai argumen Mesin) diperkenalkan di Middle A (MA02). Detail: *Kurikulum_Stage_v0.3.md* §4. **Belum diimplementasikan di prototipe.**

## 4. Story & world

Kepulauan Kode Nusantara dijaga oleh **mercusuar-mercusuar logika**. Suatu malam, Badai Acak mengacak perintah semua mercusuar dan pulau-pulau menjadi gelap. Pemain adalah **Juru Kode** muda yang ditemani **Bit**, robot kecil yang hanya bisa bergerak mengikuti kartu perintah. Setiap pulau yang mercusuarnya menyala kembali membuka jalur laut ke pulau berikutnya.

| Pulau (mode) | Tema visual | Mercusuar |
|---|---|---|
| **Pulau Perintah** (Beginner) | Desa pesisir, dermaga, pasar | Mercusuar Urutan |
| **Pulau Mesin** (Junior) | Bengkel, kincir, gudang rak | Mercusuar Ulang |
| Pulau lain (pasca-MVP) | Tampil di peta sebagai siluet berkabut | — |

Narasi ditulis **pendek** (maksimal 2 kalimat per balon dialog) dan dilengkapi ikon.

## 5. Karakter

| Karakter | Peran | Fungsi mekanik |
|---|---|---|
| **Juru Kode** (pemain) | Avatar; pilih warna & aksesori sederhana | Identitas di peta; tidak bergerak di stage |
| **Bit** | Robot pelaksana kartu | Satu-satunya yang mengeksekusi program; reaksi Bit adalah umpan balik utama |
| **Nek Urut** | Mentor Pulau Perintah | Memperkenalkan konsep baru; memberi hint |
| **Pak Rakit** | Mentor Pulau Mesin | Memperkenalkan perulangan, Mesin, dan Rak |
| **Si Teka** | Burung penjaga gerbang | Memberikan riddle Gerbang Misi |

## 6. Systems

### 6.1 Placement Test 1
- **Tidak ditawarkan di layar pertama.** Pemain lebih dulu memainkan Stage Pengantar (Beginner 1, sekaligus tutorial Papan Program, lihat §7.5). Setelah itu Si Teka menawarkan **"Ujian Si Teka"**: *"Kalau kamu sudah jago, buktikan dan langsung berlayar ke Pulau Mesin!"*
- Pemain bisa memilih **"Nanti saja"**; ujian tetap tersedia dari Peta.
- 7 soal (materi Beginner); 7/7 → badge Junior Programmer → Pulau Mesin. ≤6 → badge Beginner Programmer → lanjut di Pulau Perintah.
- Semua soal ditampilkan memakai **kartu, kotak, dan dunia yang sama persis dengan game**, bukan notasi teks. Setiap soal punya pilihan ganda dan opsi "Aku belum tahu". Bank soal ada di *Progression v0.6 §4*.

**Tes ulang** (dikunci):
| Aturan | Nilai |
|---|---|
| Syarat | Selesaikan 3 stage di mode tempat pemain ditempatkan, **dihitung setelah penempatan** (Stage Pengantar tidak dihitung) |
| Batas | Maksimal 2 kali tes ulang (total 3 percobaan) |
| Soal | Varian berbeda; tidak pernah mengulang soal yang sama |
| Penilaian | Hanya percobaan terakhir; percobaan gagal tidak mengurangi apa pun |
| Lulus saat tes ulang | Langsung pindah ke Pulau Mesin; skor stage Beginner yang sudah dimainkan tetap tersimpan |

**Bank soal:** 3 varian × 7 = **21 butir**. Untuk menghemat pembuatan konten, butir dibuat sebagai **templat berparameter** (angka, arah, dan posisi berubah, tapi struktur soal tetap). Contoh: soal urutan operasi `a + b × c` dengan (a, b, c) acak dari tabel yang sudah divalidasi. Varian harus dicek manual agar tingkat kesulitannya setara.

Kalau pemain memilih "Nanti saja", **percobaan pertama** bisa diambil kapan saja tanpa syarat. Aturan tes ulang berlaku setelah percobaan pertama.

### 6.2 Daftar stage — Pulau Perintah (Beginner, 13 stage)

Tipe: **K** = memperkenalkan satu mekanik · **L** = latihan tanpa mekanik baru · **P** = puzzle penutup. Kartu Isi kotak yang baru ditambah di B08 dan seterusnya mengikuti spesifikasi §3.13.

| ID | Misi | Tipe | Tujuan stage | Mekanik baru | Memakai ulang |
|---|---|---|---|---|---|
| B01 | **Dermaga Gelap** | K | Bawa Bit ke tiang lampu (Stage Pengantar + tutorial Papan Program) | Kartu Maju |  |
| B02 |  | K | Lewati tikungan ke gudang | Belok kiri/kanan | maju |
| B03 |  | K | Ambil peti, taruh di perahu, tekan tombol lampu | Ambil · Taruh · Tekan tombol | maju, belok |
| B04 |  | L | Susun rute panjang berkelok untuk mengantar tiga peti | — | maju, belok, aksi |
| — | Gerbang Si Teka | Riddle | "Lampu menyala Merah, Biru, Biru, Merah, Biru, Biru, … Warna lampu ke-10?" | — | — |
| B05 | **Jalan Pasar** | K | SATU jembatan; lantai berwarna acak; Jika merah → Tekan tombol | Jika … maka … (+ sensor dunia: Ada tembok?, Warna lantai, Ada benda?) | maju, aksi |
| B06 |  | K | SATU persimpangan acak: Jika ada tembok → samping, selain itu → lurus | Jika … maka … selain itu … | jika, maju, belok |
| B07 |  | L | Dua persimpangan + satu jembatan berurutan, tanpa kartu baru | — | jika, selain itu, aksi, maju, belok |
| — | Gerbang Si Teka | Riddle | "Kunci ada di salah satu dari 3 peti. Peti merah kosong; kunci tidak di peti biru. Di mana kuncinya?" | — | — |
| B08 | **Gudang Kotak** | K | Isi kotak "langkah" agar jembatan muncul sepanjang isinya, lalu seberangi | Isi kotak … dengan … (variabel) | maju |
| B09 |  | K | Isi tiga kotak (bulat/persegi/sakelar) sesuai yang terlihat di dermaga [PROTOTIPE] | Bentuk kotak = tipe (bulat angka · persegi teks · sakelar nyala/mati) | isi kotak |
| B10 |  | K | Capai berat 14 dengan angka 2, 3, 4 dan maksimal 3 kartu [PROTOTIPE] | Ubah kotak (+ − × ÷) | isi kotak |
| B11 |  | L | Isi tiga kotak, hitung berat, lalu jalan ke dermaga, tanpa kartu baru | — | isi kotak, tipe, ubah kotak, maju |
| — | Gerbang Si Teka | Riddle | "Balok × menempel lebih dulu: 2 + 3 × 4 = ?" | — | ubah_kotak |
| B12 | **Mercusuar Urutan** | K | Jika kotak > 5 buka gerbang A, selain itu B; Jika sakelar nyala → lampu | Sensor kotak: Jika kotak (> < = ≠) N · Jika sakelar nyala | jika, selain itu, isi kotak, ubah kotak, tipe |
| B13 |  | P | Nyalakan mercusuar: urutan + aksi + kondisional + variabel + operasi + pembanding | — | maju, belok, aksi, jika, selain itu… |

Selesai → badge **Beginner Complete** → jalur laut ke Pulau Mesin terbuka.

### 6.3 Daftar stage — Pulau Mesin (Junior, 14 stage)

| ID | Misi | Tipe | Tujuan stage | Mekanik baru | Memakai ulang |
|---|---|---|---|---|---|
| J01 | **Kincir Rusak** | K | Jalan lurus 8 petak; batas kartu 2 | Ulangi … kali (wadah) | maju |
| J02 |  | L | Ulangi berisi beberapa kartu | — | ulangi n, maju, belok |
| J03 |  | K | Kelilingi kebun 3×4 dengan Ulangi di dalam Ulangi | Ulangi di dalam Ulangi | ulangi n, maju, belok |
| J04 |  | K | Maju sampai ada tembok (panjang jalan diacak) | Selama … (perulangan bersyarat) | ulangi n, jika, maju |
| J05 |  | K | Selama TIDAK ada tembok DAN ada koin … | TIDAK · DAN · ATAU pada syarat | selama, jika, maju |
| J06 |  | L | Ambil koin hanya di petak yang ada koinnya, tanpa kartu baru | — | ulangi n, ulangi bersarang, selama, syarat gabungan, jika… |
| — | Gerbang Si Teka | Riddle | "Berapa tepukan: Ulangi 3 kali [Ulangi 4 kali [Tepuk]]?" | — | ulangi_bersarang |
| J07 | **Bengkel Pak Rakit** | K | Bangun 3 menara identik dengan satu Mesin | Buat Mesin & Jalankan Mesin (fungsi) | ulangi n, maju, aksi |
| J08 |  | K | Mesin(tinggi) | Masukan Mesin | mesin, ulangi n |
| J09 |  | K | Mesin menghitung bahan → hasilnya mengisi kotak (slot nilai "hasil Mesin") | Keluarkan + slot nilai "hasil Mesin" | mesin, parameter, isi kotak, ubah kotak |
| J10 |  | L | Rangkai Mesin dan Ulangi, tanpa kartu baru | — | mesin, parameter, nilai keluaran, ulangi n, jika |
| — | Gerbang Si Teka | Riddle | "Mengapa Mesin lebih baik daripada menyalin kartu?" | — | mesin |
| J11 | **Gudang Rak** | K | Ambil barang dari rak nomor tertentu (mulai 0) | Rak bernomor mulai 0 (list) | isi kotak, aksi |
| J12 |  | K | Periksa semua barang; buang yang rusak (slot "isi rak sekarang") | Untuk setiap isi rak + slot nilai "isi rak sekarang" | rak, jika, aksi, ulangi n |
| J13 |  | L | Jumlahkan berat semua barang ke satu kotak, tanpa kartu baru | — | rak, untuk setiap, ubah kotak, isi kotak |
| — | Gerbang Si Teka | Riddle | "Rak berisi [apel, jeruk, mangga]: isi rak nomor 2?" | — | rak |
| J14 | **Mercusuar Ulang** | P | Nyalakan mercusuar dengan perulangan, Mesin, dan Rak | — | ulangi n, ulangi bersarang, selama, syarat gabungan, mesin… |

Selesai → badge **Junior Complete** → di peta muncul Pulau berikutnya berkabut bertuliskan **"Segera hadir: Placement Test 2"**.

### 6.4 Progresi, skor, badge (MVP)
- Skor stage = Dasar × Pengali kesulitan × (bintang / 3) × (1 − pengurangan hint berbayar). Dasar: Beginner 100, Junior 150. Pengali Hard turun ke ×1.75 jika tombol Langkah dipakai. Hint: lihat §3.12. Bonus misi +10% (tidak diberikan jika gerbang dibuka lewat aturan anti-blokir).
- Beginner yang dilompati lewat Test 1: kredit setara Medium, 2 bintang. Pulau Perintah tetap bisa dimainkan.
- **Badge MVP:** Beginner Programmer, Junior Programmer, Beginner Complete, Junior Complete, + Master Easy/Medium/Hard per pulau (opsional).
- **Sertifikat tidak ada di MVP** (syaratnya Senior Complete).

## 7. UI/UX

### 7.1 Alur layar
```
Judul → Buat Juru Kode (nama panggilan + warna) → STAGE PENGANTAR (Beginner 1 + tutorial, ±2–3 menit)
                                                              ▼
                                         Si Teka menawarkan "Ujian Si Teka"
   ├─ Ikut → 7 soal → Hasil + badge ─────┐
   └─ Nanti saja ────────────────────────┤
                                          ▼
                                 Peta Nusantara ⇄ Koleksi Badge / Pengaturan / Kode Progres / Ujian Si Teka
                                          ▼
                       Pilih misi → Pilih kesulitan → STAGE → Hasil stage → (Gerbang Si Teka)
```

### 7.2 Layar Stage
- **Landscape (laptop & HP):** dunia 3D di kiri (60%), Palet + Papan Program di kanan (40%).
- **Portrait (HP):** dunia 3D di atas (45%), Papan Program di bawah, Palet berupa laci yang bisa ditarik.
- Area sentuh minimal **48×48 px**. Kartu bisa disusun ulang dengan seret dan dihapus dengan diseret ke tempat sampah.
- Balon dialog NPC bisa ditutup, dan tombol 💡 Hint selalu terlihat.

### 7.3 Layar Hasil Stage
Bintang (animasi), skor, tombol "Lihat versi kode", "Coba lagi untuk ★★★", dan "Lanjut". **Tidak ada kata "gagal"**; kalau belum berhasil, Bit berkata "Hampir! Coba lihat kartu yang berkedip."

### 7.4 Aksesibilitas
- Ukuran teks bisa diperbesar.
- Warna di stage selalu disertai **pola atau ikon**, sehingga tetap bisa dimainkan oleh pemain buta warna.
- `ASUMSI:` pembaca suara Web Speech API (id-ID) sebagai opsi "Bacakan" untuk pemain SD awal. Kualitas suara bergantung perangkat.

### 7.5 Onboarding Papan Program (Stage Pengantar)
Tujuan: pemain bisa menyeret, menyusun, dan menjalankan kartu **tanpa membaca paragraf penjelasan**. Setiap langkah tutorial hanya bisa dilanjutkan dengan **melakukannya**.

| Langkah | Yang ditampilkan | Yang harus dilakukan pemain |
|---|---|---|
| 1 | Tangan animasi menyeret kartu Maju dari Palet ke Papan | Seret 1 kartu Maju ke Papan |
| 2 | Tombol ▶ berdenyut | Tekan Jalankan; Bit maju 1 petak, belum sampai |
| 3 | Bit berkata "Masih jauh!", petak sisa diberi tanda | Tambah kartu Maju sampai cukup, lalu jalankan |
| 4 | Bit menabrak karena kartu kelebihan (disiapkan oleh level) | Seret kartu yang berlebih ke tempat sampah |
| 5 | Lampu dermaga menyala | — (momen keberhasilan pertama, target < 60 detik sejak stage dibuka) |

Konsep yang diperkenalkan di 5 menit pertama dibatasi menjadi **3**: kartu, jalankan, hapus. Tombol Langkah, hint, dan ubah parameter diperkenalkan di stage 2–3, masing-masing saat pertama kali dibutuhkan.

## 8. Arsitektur teknis

### 8.1 Stack
| Komponen | Pilihan |
|---|---|
| Bahasa & build | TypeScript + Vite |
| 3D | Three.js (versi dikunci di package.json) |
| UI | HTML/CSS overlay + TypeScript tanpa framework berat (`ASUMSI:` Preact jika UI membesar) |
| Drag & drop | Pointer Events buatan sendiri (mendukung mouse + sentuh) |
| Penyimpanan | localStorage |
| Hosting | Static (Cloudflare Pages / GitHub Pages / itch.io) |

### 8.2 Modul
```
┌─────────────┐   program (JSON)   ┌──────────────┐   langkah/event   ┌──────────────┐
│ Card Editor │ ─────────────────► │  Interpreter │ ────────────────► │ World State  │
│ (UI kartu)  │                    │  (generator) │                   │ (data murni) │
└─────────────┘                    └──────────────┘                   └──────┬───────┘
                                                                              │ snapshot
┌─────────────┐   level (JSON)                                         ┌─────▼────────┐
│ Level Loader│ ──────────────────────────────────────────────────────►│ Renderer     │
└─────────────┘                                                        │ (Three.js)   │
                                                                       └──────────────┘
```

- **Program** = pohon node JSON, misalnya `{type:"repeat", count:4, body:[{type:"move"}, …]}`.
- **Interpreter** = generator yang meng-`yield` setiap langkah. Ini mendukung Jalankan, Langkah, dan kecepatan animasi dari satu kode yang sama. **Batas 500 langkah** per eksekusi untuk menghentikan perulangan tak berujung dengan pesan ramah ("Bit kelelahan berputar-putar!").
- **World State** = data murni (grid, posisi Bit, isi kotak, rak). Logika tidak bergantung pada Three.js, sehingga bisa diuji otomatis tanpa browser.
- **Deterministik:** stage dengan unsur acak memakai seed per percobaan, sehingga solusi bisa diverifikasi dan diputar ulang.
- **Validasi level otomatis:** setiap level menyimpan solusi referensi, dan tes otomatis memastikan solusi itu lulus dengan target ★★★ di ketiga tingkat kesulitan.

### 8.3 Format data level (ringkas)
```json
{
  "id": "beginner-07",
  "grid": { "w": 6, "h": 5, "tiles": "..." },
  "start": { "x": 0, "y": 0, "dir": "N" },
  "objects": [ { "type": "box", "id": "angka1", "shape": "number" } ],
  "goal": { "type": "boxesMatch", "targets": { "angka1": 7 } },
  "cards": { "easy": ["move","fill"], "medium": ["..."], "hard": ["..."] },
  "stars": { "maxSteps": 14, "maxCards": 6 },
  "hints": [ "riddle…", "arah konsep…", "contoh parsial…" ],
  "randomize": { "seeded": true, "fields": ["doorState"] },
  "reference": { "type": "program", "body": [] }
}
```

### 8.4 Save & progres
- Satu kunci localStorage berversi, misalnya `kn_save_v1`, berisi: profil (nama panggilan, avatar), skor terbaik per stage, bintang, kesulitan, badge, riwayat Test 1 (percobaan, ID varian yang sudah dipakai, jumlah stage sejak penempatan), dan pengaturan.
- **Kode Progres:** progres diekspor sebagai teks pendek atau QR untuk pindah perangkat, tanpa akun.
- Jika localStorage tidak tersedia (mode penyamaran), tampilkan peringatan bahwa progres tidak akan tersimpan.

### 8.5 Anggaran performa
| Target | Nilai |
|---|---|
| Unduhan awal | < 8 MB |
| Waktu muat di 4G | < 5 detik sampai Peta |
| FPS | 60 di laptop; ≥ 30 di HP 2–3 GB RAM |
| Render | Kamera orthografik isometrik, InstancedMesh untuk ubin, **tanpa bayangan real-time** (blob shadow), pixel ratio maksimum 2 |
| Draw call per stage | < 100 |

### 8.6 Privasi
Tanpa akun, tanpa iklan, tanpa pelacak pihak ketiga, dan tanpa analytics di build publik MVP. Nama panggilan hanya tersimpan di perangkat. Build playtest boleh mencatat log lokal yang diekspor manual oleh fasilitator.

## 9. Art & audio

- **Visual:** low-poly, palet hangat pesisir, dan netral usia. Aset modular CC0 (Kenney, Quaternius) dimodifikasi warna agar konsisten. Bit dan NPC adalah satu-satunya aset custom.
- **Animasi kunci:** Bit berjalan, menabrak, bingung, dan bersorak; kotak berubah isi; mercusuar menyala (momen puncak tiap pulau).
- **Audio:** SFX pendek untuk tiap kartu, nada naik untuk keberhasilan, dan nada lembut (bukan buzzer) untuk kegagalan. Satu musik latar per pulau. Ada tombol mute.

## 10. MVP scope

| Masuk MVP | Ditunda |
|---|---|
| Placement Test 1 + 21 butir varian + tes ulang | Test 2, Middle A/B, Senior, Expert |
| Pulau Perintah (13 stage, 4 misi) | Sertifikat |
| Pulau Mesin (14 stage, 4 misi) | Akun, sinkronisasi cloud, dashboard guru |
| Easy / Medium / Hard | Leaderboard, multiplayer |
| Skor, bintang, badge MVP | Voice-over profesional |
| Lihat versi kode (pseudocode) | Editor level |
| Kode progres (pindah perangkat) | Bahasa selain Indonesia |

**Perkiraan** (`ASUMSI:` 2 orang paruh waktu): 10–12 minggu sampai rilis publik MVP.

## 11. Prototype plan (dikerjakan sebelum produksi)

**Tujuan:** membuktikan bahwa core loop bekerja dan dua risiko terbesar bisa diatasi.

| Prototipe | Mengapa ini | Isi |
|---|---|---|
| **P1: Beginner stage 7–8** (tipe data + matematika) | Risiko terbesar Beginner: terasa seperti PR matematika | Greybox, 2 stage, kartu Isi/Ubah kotak, bentuk kotak = tipe |
| **P0: Stage Pengantar** (Beginner 1 + tutorial §7.5) | Kesan pertama & kemampuan memakai Papan Program tanpa penjelasan | Greybox, dibangun bersama P1 karena memakai editor yang sama |
| **P2: Junior stage 5–6** (Mesin + parameter) | Risiko UI terbesar: membuat kartu bersarang di layar sentuh HP | Greybox, bengkel Mesin, drag bersarang di HP |

**Kriteria lulus (diuji ke 5 siswa SD kelas 4–6 untuk P1, dan 5 siswa SMP untuk P2):**

| Kriteria | Lulus jika |
|---|---|
| Menyelesaikan tanpa bantuan | ≥ 4 dari 5 siswa, dalam ≤ 8 menit per stage |
| Pemahaman | ≥ 3 dari 5 bisa menjelaskan dengan kata sendiri "kotak itu untuk apa" (P1) / "Mesin itu untuk apa" (P2) |
| Kontrol sentuh | ≤ 2 kesalahan seret per stage di HP |
| Keinginan bermain | ≥ 3 dari 5 memilih "mau lanjut" ketika ditanya |
| Performa | ≥ 30 FPS di HP uji paling murah |
| Onboarding (P0) | ≥ 4 dari 5 siswa menyalakan lampu dermaga tanpa bantuan, dalam ≤ 3 menit |

**Gagal di satu kriteria →** perbaiki metafora/UI dan uji ulang sebelum produksi. **Jangan** menambah konten untuk menutupi masalah core loop.

## 12. Open questions & risiko

| # | Hal | Status |
|---|---|---|
| 1 | Ukuran tim, deadline, model bisnis | **Belum dijawab.** Perkiraan 10–12 minggu tidak bisa diandalkan tanpa ini |
| 2 | Beginner terasa seperti PR matematika | Diuji di P1 |
| 3 | Drag kartu bersarang di HP | Diuji di P2 |
| 4 | Rentang usia SD kelas 4 vs SMP dalam satu gaya | Pantau saat playtest. Batas bawah SD kelas 4 sudah dikunci |
| 5 | 21 butir varian Test 1 setara tingkat kesulitannya | Validasi ke 30–50 siswa |
| 6 | Janji "Senior/Expert/sertifikat" saat MVP baru berisi 2 pulau | Komunikasi rilis harus jujur: "Pulau baru segera hadir" |
| 7 | Pemain kehilangan progres (localStorage terhapus) | Kode progres + pengingat ekspor |
| 8 | Fitur "Lihat versi kode" disetujui? | `ASUMSI:` ya, versi ringan |
| 9 | Pembaca suara Web Speech API kualitasnya tidak seragam | Opsional, bukan andalan |
| 10 | Belum ada stage latihan; konsep Junior padat (review G2) | Belum diperbaiki; prioritas review #9 |
| 11 | Estimasi belum memperhitungkan konten tersembunyi (review K1) | Belum diperbaiki; prioritas review #8 |
| 12 | Pembagian tidak habis, batas tes ulang di localStorage, analytics edukasi (review T1, T3, K4) | Belum diperbaiki; prioritas review #10 |
