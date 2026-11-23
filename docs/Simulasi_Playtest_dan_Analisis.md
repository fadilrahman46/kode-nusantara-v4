# SIMULASI — Playtest 5 Siswa, Review "Independen", dan Analisis Go/No-go

> ⚠️ **BUKAN DATA ANAK.** Seluruh isi dokumen ini adalah **prediksi** Claude berdasarkan perilaku prototipe v3 yang sebenarnya (*cognitive walkthrough* dengan 5 persona). Gunanya: (1) menguji apakah instrumen di *Playtest_Kit_P0_P1.md* menangkap hal yang tepat, dan (2) menyusun hipotesis yang harus **dibuktikan atau dibantah** oleh playtest nyata. **Jangan mengutip angka di sini sebagai hasil uji.**
>
> Tanggal: 12 November 2026 · Build: prototipe v3 · Penulis simulasi = penulis prototipe (bias tinggi)

> **Catatan validitas (12 Nov, diperbarui):** simulasi di bawah ditulis untuk prototipe yang melompati stage variabel. **B08 sudah ditambahkan ke prototipe** (urutan B01 → B08 → B09 → B10), sehingga prediksi H1 di bawah berlaku untuk B09/B10 *setelah* anak melewati B08. Prediksi untuk B08 sendiri belum disimulasikan.

---

## 1. Persona simulasi

| Kode | Persona | Mengapa dipilih |
|---|---|---|
| S1 | Kelas 4, membaca lambat, jarang memakai laptop (touchpad) | Batas bawah usia; menguji beban baca dan seret dengan touchpad |
| S2 | Kelas 4, sering main game (Roblox), melewati semua teks | Menguji apakah game bisa dipahami tanpa membaca |
| S3 | Kelas 5, rajin, membaca semua dialog | Kasus "ideal" sebagai pembanding |
| S4 | Kelas 6, pernah memakai Scratch | Menguji kebosanan dan placement test (kandidat 7/7) |
| S5 | Kelas 5, cemas bila salah, mudah menyerah | Menguji umpan balik kegagalan dan tangga bantuan |

## 2. Walkthrough per tugas (berbasis perilaku prototipe)

### Tugas A — Stage Pengantar
**Yang sebenarnya terjadi di game:** dialog halaman 1 kini dimulai dengan "Seret kartu Maju ke Papan Program."; kartu Maju berdenyut; mengetuk kartu juga menambahkannya; menjalankan 1 kartu memunculkan "Masih kurang 3 petak lagi menuju lampu."; 5 kartu membuat Bit menabrak tong dan muncul petunjuk membuang kartu.

| Persona | Prediksi | Dasar |
|---|---|---|
| S1 | Lampu menyala ±3–4 menit, **mungkin melewati batas 3 menit** | Membaca lambat; menyeret dengan touchpad sulit, tetapi klik juga menambah kartu |
| S2 | < 1 menit | Kartu berdenyut cukup tanpa membaca |
| S3 | ±1–2 menit | Mengikuti dialog |
| S4 | < 1 menit | — |
| S5 | ±2 menit; tegang saat Bit menabrak | Pesan "Duk! Bit menabrak" bisa terasa seperti dimarahi |

### Tugas B — B09 "Kotak Berbentuk"
**Fakta penting:** kartu "Isi kotak" yang baru ditambah **otomatis berisi "jumlah ikan = 3"**. Instruksi "Ketuk kartu di papan untuk mengubah isinya" ada di **halaman terakhir** dialog (halaman 2 di desktop, 3 di HP).

| Persona | Prediksi | Dasar |
|---|---|---|
| S1 | **Butuh bantuan (B1–B2)** | Tidak menemukan bahwa kartu bisa diketuk untuk diubah |
| S2 | **Berisiko macet**: menambah 3 kartu lalu Jalankan → "Hampir! Ikannya ada 5, bukan 3." berulang kali | Melewati dialog → tidak tahu kartu bisa diubah; menemukannya bila tak sengaja mengklik |
| S3 | Selesai ±4–6 menit | Membaca instruksi |
| S4 | Selesai ±3 menit | Pengalaman Scratch |
| S5 | Selesai dengan hint 1–2 ±6–8 menit | Hint riddle gratis membantu |

**Hipotesis H1 (paling berisiko):** cara mengubah isi kartu tidak bisa ditemukan oleh pemain yang tidak membaca dialog. Instrumen menangkapnya lewat "Tingkat bantuan" dan kutipan.

### Tugas C — B10 "Timbangan Pasar"
**Fakta:** batas 3 kartu; angka 2/3/4; semua solusi wajib memakai × (T1 L10); pembagian tak habis ditolak.

| Persona | Prediksi | Dasar |
|---|---|---|
| S1 | Kemungkinan **tidak selesai** atau butuh hint 3 | Perlu merencanakan 3 langkah aritmetika sekaligus |
| S2 | Selesai lewat coba-coba (ruang solusi kecil: 5 solusi) | Coba-coba bisa berhasil tanpa paham |
| S3, S4 | Selesai | — |
| S5 | Selesai dengan hint 2–3 | — |

**Hipotesis H2:** B10 lebih menguji perencanaan aritmetika daripada konsep variabel, sehingga anak kelas 4 bisa gagal karena matematika, bukan karena logika.

### Tugas D–E — Pemahaman & Placement Test
- "Kotak untuk apa?": S3, S4, S5 kemungkinan menjawab "untuk menyimpan angka/isi"; S1, S2 cenderung menjawab berdasarkan warna/bentuk.
- Jumlah ikan: di laptop, 5 ikan terpisah → kemungkinan besar 5/5 benar.
- Arah Maju: ikon ⬆️ bisa membuat S1/S5 menunjuk ke atas layar (**H3**).
- Placement Test 1: hanya S4 berpeluang 7/7; soal 6 (urutan operasi 2 + 3 × 4) kemungkinan paling sering salah di kelas 4–5.

## 3. Prediksi terhadap kriteria (SIMULASI)

| Kriteria (GDD §11) | Ambang | Prediksi simulasi | Keyakinan |
|---|---|---|---|
| Onboarding P0 | ≥ 4/5 ≤ 3 menit tanpa bantuan | 4/5 (lulus tipis) | sedang |
| Tanpa bantuan — B09 | ≥ 4/5 ≤ 8 menit | **3/5 (gagal tipis)**, karena H1 | rendah–sedang |
| Tanpa bantuan — B10 | ≥ 4/5 ≤ 8 menit | 3–4/5 | rendah |
| Pemahaman | ≥ 3/5 | 3/5 (lulus tipis) | rendah |
| Mau lanjut | ≥ 3/5 | 4/5 | rendah |
| Keterbacaan B09 (tambahan) | ≥ 4/5 | 5/5 di laptop | sedang |
| Arah Maju (tambahan) | ≥ 4/5 | 3/5 | rendah |

**Status simulasi: "Go bersyarat".** Risiko terbesar ada di H1: cara mengubah isi kartu sulit ditemukan.

**Uji instrumen:** walkthrough ini menunjukkan lembar observasi sudah menangkap H1–H3. Satu kekurangan sudah kutambahkan ke kit: kolom "Mencoba penjumlahan berulang dulu" di B10 (untuk H2).

---

## 4. Review "independen" (SIMULASI, sudut pandang guru SD)

> Ditulis Claude dengan sudut pandang guru kelas SD. **Bukan review independen**; tetap butuh 1 orang lain (prioritas #3).

| # | Severity | Temuan | Bukti | Saran |
|---|---|---|---|---|
| G1 | Major | **Istilah bahasa Inggris pada UI anak**: "Hint", "Easy/Medium/Hard", "Stage". Bantuan bergantung pada tombol berlabel "Hint" | Teks tombol dan menu di prototipe | "💡 Petunjuk", "Mudah/Sedang/Sulit", "Tahap" |
| G2 | Major | **Kartu bisa diubah, tetapi tidak terlihat bisa diubah** (H1). Argumen kartu tampak sebagai teks biasa | Kartu "Isi kotak" bawaan berisi 3; instruksi ada di halaman terakhir dialog | Beri tanda ✏️ pada argumen kartu, atau buka pemilih otomatis saat kartu "Isi" pertama ditambahkan. **Uji dulu**, jangan diperbaiki sebelum playtest |
| G3 | Minor | **Pesan gagal bernada menyalahkan** bagi anak cemas ("Duk! Bit menabrak.") | Teks pesan kegagalan | Pertahankan humor, tambahkan "Tidak apa-apa, coba lagi!" |
| G4 | Minor | **Durasi** 3 stage ±25 menit pas untuk satu jam pelajaran, tetapi belum ada mode kelas (satu perangkat untuk dua anak) | Desain saat ini satu pemain | Catat sebagai kebutuhan rilis sekolah, bukan MVP |
| G5 | Catatan | **Metafora bentuk = tipe** adalah buatan sendiri; di bahasa pemrograman nyata tipe bukan bentuk | B09 | Pertahankan "Lihat versi kode" sebagai jembatan; uji pemahaman D2 |
| G6 | Catatan | **B10 bisa gagal karena aritmetika** (H2), padahal targetnya konsep variabel | Ruang solusi: 5 solusi, semuanya memakai × | Tetap di Beginner; amati di playtest |

---

## 5. Keputusan F13–F16 (Go untuk dikerjakan di C1)

Keputusan ini **tidak bergantung pada data anak**, atau punya cadangan yang jelas. F14 dan F15 tetap diverifikasi saat playtest nyata.

| Temuan | Keputusan | Alasan | Diverifikasi oleh |
|---|---|---|---|
| **F13** Hard hanya menambah pengecoh | **Go:** Hard memakai **varian data level** (target/angka/batas kartu berbeda) yang solusi terpendeknya berbeda dari Easy. Sampai varian ada, pengali Hard turun ke ×1,5 | Pengali ×2 untuk soal yang sama tidak adil | Asersi baru T1: solusi terpendek Hard ≠ Easy |
| **F14** Ikon ⬆️ pada kartu Maju | **Go bersyarat:** ganti ikon dengan Bit kecil menghadap depan + panah, **hanya bila** < 4/5 anak menunjuk dengan benar (D5) | Biaya kecil, tapi bukti belum ada | Pertanyaan D5 di playtest nyata |
| **F15** Hint 3 berisi jawaban lengkap | **Go:** hint 3 hanya menunjukkan **kartu pertama** solusi, lalu "Sekarang lanjutkan sendiri". Ini juga menyesuaikan prototipe dengan GDD §3.8, yang sejak awal menulis "contoh parsial" | Prototipe menyimpang dari GDD; jawaban penuh membuat anak bisa menang tanpa berpikir | Jumlah pemakaian hint 3 + jawaban D1–D2 |
| **F16** Modal menutupi momen lampu menyala | **Go:** modal muncul setelah 1,6 detik, berupa lembar bawah yang tidak menggelapkan dunia | Momen puncak emosi harus terlihat | Ekspresi saat lampu menyala |

**Ditambahkan ke C1 (dari review simulasi):** G1 bahasa Indonesia pada UI (murah dan jelas). G2 **tidak** diperbaiki sebelum playtest nyata, karena itulah hipotesis yang ingin diuji.

---

## 6. Status keputusan sebenarnya

| | Status |
|---|---|
| Keputusan desain F13–F16 + G1 | **Go**: masuk C1 |
| Go/no-go produksi (C2–C6) | **Belum.** Menunggu playtest nyata dengan *Playtest_Kit_P0_P1.md* §8. Tanggal 12 November dipakai untuk simulasi; playtest nyata perlu tanggal baru karena izin orang tua tidak bisa diperoleh di hari yang sama |
