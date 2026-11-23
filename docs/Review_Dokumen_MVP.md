# Review: Kode Nusantara — Dokumen MVP

**Tanggal:** 11 November 2026
**Mode:** audit sendiri (blak-blakan, fokus pada apa yang harus diperbaiki)
**Catatan kejujuran:** ketiga dokumen ini disusun oleh Claude di percakapan yang sama. Review ini sengaja mencari kesalahan penyusunnya sendiri, tapi tetap rawan bias. Review independen oleh orang lain tetap dianjurkan.

---

## Ringkasan

Struktur besarnya sudah kuat: prasyarat materi konsisten, arsitektur interpreter masuk akal, dan prototype plan punya kriteria terukur. Masalahnya ada di **detail desain stage yang saling bertentangan dengan urutan materi**, terutama stage kondisional di Beginner yang membutuhkan perulangan yang belum diajarkan. Selain itu, **pengalaman 5 menit pertama** dibuka dengan tes 7 soal sebelum pemain menyentuh game. Risiko terbesar adalah estimasi 10–12 minggu yang tidak menghitung beban konten tersembunyi (hint, riddle, varian soal). Yang paling mendesak: pindahkan Placement Test 1 ke setelah stage pertama, dan rancang ulang stage Beginner 4.

## Cakupan review

**Dinilai:**
- Konsep game & scope: dari GDD_MVP.md, Progression_Placement_Design.md, PROJECT_STATE.md
- Gameplay *di atas kertas*: struktur loop, urutan stage, kurva kesulitan, kontradiksi internal `[inferensi dari GDD]`
- Rancangan sistem/teknis: arsitektur, data, save (desain, bukan kode)
- UI/UX *alur dan aturan*: dari spesifikasi teks

**Tidak dapat dinilai:**
- Apakah game-nya seru atau efektif mengajar → butuh build/prototipe dan playtest
- Tampilan visual UI, keterbacaan, tata letak sentuh → butuh mockup atau screenshot
- Kualitas kode & performa nyata → belum ada kode

---

## Temuan

### Gameplay

**[Major] G1 — Stage Beginner 4 membutuhkan perulangan yang belum diajarkan**
Bukti: GDD §6.2 stage 4: *"Lantai merah = belok, hijau = maju (posisi warna diacak tiap percobaan, jadi pemain harus pakai Jika)"*. Perulangan baru diajarkan di Junior (GDD §3.3, kartu "Ulangi" bermode Junior).
Dampak: jika ada beberapa petak berwarna acak, satu-satunya cara tanpa perulangan adalah menyalin kartu Jika berulang kali per petak. Pemain belajar bahwa kondisional itu merepotkan. Ini kebalikan dari tujuan stage.
Perbaikan: di Beginner, setiap stage kondisional hanya punya **satu titik keputusan**. Contoh: satu persimpangan dengan lantai berwarna acak, dan jalan lurus sebelum serta sesudahnya. Pola "cek setiap petak" dipindahkan ke Junior stage 4 (perulangan + kondisional), tempat ia memang seharusnya.

**[Major] G2 — Hampir setiap stage memperkenalkan mekanik baru; tidak ada stage latihan**
Bukti: kolom "Mekanik baru" GDD §6.2 dan §6.3 terisi di stage 1–9 Beginner dan 1–11 Junior. Junior memuat perulangan, fungsi (termasuk komposisi), list, dan akumulator dalam 12 stage.
Dampak: konsep diperkenalkan lalu langsung ditinggal. Tidak ada kesempatan memakai konsep di situasi baru sebelum konsep berikutnya datang. Risiko lonjakan kesulitan paling tinggi ada di Junior stage 6–8 (parameter → nilai keluaran → komposisi berturut-turut). `[inferensi dari GDD]`
Perbaikan: gunakan pola **kenalkan → latih → pelintir** per konsep. Pilih salah satu: (a) tambah 4–6 stage latihan (Beginner 14, Junior 16), atau (b) potong "Mesin di dalam Mesin" (Junior 8) dan pindahkan ke Middle A sebagai pengantar rekursi. Opsi (b) lebih murah dan sekaligus memperkuat jembatan ke rekursi.

**[Major] G3 — Kriteria bintang tidak membedakan apa pun di Beginner, dan tidak adil di stage acak**
Bukti: GDD §3.10: ★★ = langkah eksekusi ≤ target, ★★★ = jumlah kartu ≤ target. GDD §8.2: stage acak memakai seed per percobaan.
Dampak:
- Di Beginner tidak ada perulangan, sehingga jumlah langkah ≈ jumlah kartu. ★★ dan ★★★ hampir selalu didapat bersamaan; bintang kehilangan makna.
- Di stage acak (Beginner 4–5, Junior 3), jumlah langkah bergantung pada hasil acak. Program yang sama bisa mendapat ★★ di satu percobaan dan gagal di percobaan lain.
Perbaikan: definisikan kriteria bintang **per stage**, terkait konsep yang diajarkan. Contoh Beginner: ★★ = tanpa hint, ★★★ = berhasil dalam ≤ 2 kali jalankan. Untuk stage acak, nilai program terhadap **semua seed uji** (program harus benar di semua kemungkinan), bukan satu seed.

**[Major] G4 — Riddle gerbang: tingkat kesulitan, sifat memblokir, dan bentuk jawaban Hard tidak terdefinisi**
Bukti:
- GDD §6.2: riddle Misi 2 *"Hanya satu penjaga yang jujur…"*, jenis teka-teki ksatria-penipu yang sulit bahkan bagi orang dewasa, untuk audiens SD kelas 4.
- Progression §1: *"Mode selesai = semua stage + semua misi"*. Artinya riddle wajib untuk badge.
- GDD §3.8: riddle Hard = *"susun jawaban sendiri"*, padahal GDD §3.1: *"Tidak ada keyboard."*
Dampak: satu riddle yang terlalu sulit bisa memblokir seluruh progres pemain SD. Bentuk jawaban Hard tidak bisa diimplementasikan sesuai spesifikasi saat ini.
Perbaikan:
1. Riddle gerbang **tidak boleh memblokir mutlak**: setelah 2 kali salah, tawarkan petunjuk; setelah 3 kali, gerbang terbuka dengan skor misi dikurangi.
2. Ganti riddle "penjaga jujur" dengan deduksi satu langkah untuk Beginner.
3. Definisikan "susun jawaban" sebagai **menyusun ubin/kartu jawaban**, bukan mengetik.

**[Minor] G5 — Pemain Hard yang macet tidak mendapat bantuan konkret**
Bukti: Progression §6: Hard = 1 hint dan tanpa tombol Langkah. GDD §3.8: hint tingkat 1 *"selalu berupa riddle samar"*. Rumus skor mengurangi 10% per hint.
Dampak: pemain Hard hanya pernah melihat hint paling samar dan kehilangan alat debugging utama (eksekusi langkah demi langkah). Padahal debugging adalah keterampilan yang diajarkan. Pengurangan skor juga membuat pemain enggan memakai hint riddle, yang justru berfungsi sebagai materi belajar.
Perbaikan: di Hard, pertahankan tombol Langkah tetapi beri pengurangan skor kecil saat dipakai. Hint pertama (riddle) dibuat gratis; pengurangan skor hanya untuk hint tingkat 2–3.

### UI/UX (alur & aturan, dari spesifikasi teks)

**[Major] U1 — Pengalaman pertama dibuka dengan tes, bukan permainan**
Bukti: GDD §7.1: *"Judul → Buat Juru Kode → Tawaran Placement Test 1 → 7 soal → … → Peta"*. GDD tidak punya spesifikasi onboarding untuk Papan Program (cara seret, menyusun bersarang, mengubah parameter).
Dampak: momen bermain pertama baru datang setelah ±5 menit mengerjakan soal pilihan ganda. Untuk anak SD, kesan pertamanya adalah "ini ulangan". Ini persis jebakan game edukasi yang sejak awal ingin dihindari. Soal tes juga memakai kartu dan metafora yang belum pernah dilihat pemain baru.
Perbaikan: urutan menjadi **Judul → stage pengantar (Beginner 1, ±2 menit, sekaligus tutorial seret kartu) → tawaran Placement Test 1**. Bingkai tes sebagai "Ujian Si Teka" di dalam cerita, bukan layar terpisah. Tambahkan satu subbagian onboarding Papan Program di GDD §7.

**[Major] U2 — Bahasa Placement Test 1 tidak sama dengan bahasa game, dan soal 5 ambigu**
Bukti:
- Progression §4 soal 3, 4, 6, 7 memakai notasi `apel ← apel + 2`. Di game, pemain memakai kartu "Isi kotak … dengan …" dan "Ubah kotak … (+ − × ÷)" (GDD §3.3).
- Soal 5 memakai nama "Angka/Teks/Benar-Salah", padahal di game tipe data diajarkan sebagai **bentuk** kotak (bulat/persegi/sakelar, GDD §3.4).
- Soal 5: *"hanya boleh berisi ya atau tidak"*. Jawaban "Teks" juga bisa dibela, karena "ya" dan "tidak" adalah kata.
Dampak: tes mengukur kemampuan membaca notasi asing, bukan pemahaman konsep. Pemain yang paham kartu bisa gagal karena notasinya. Ini mendorong false negative pada aturan 7/7 yang sudah ketat.
Perbaikan: tampilkan semua soal sebagai **susunan kartu dan kotak bentuk** yang sama persis dengan di game. Ubah soal 5 menjadi: "Lampu hanya bisa *menyala* atau *mati*. Kotak mana yang cocok?" dengan pilihan bentuk kotak.

### Konsep & scope

**[Major] K1 — Estimasi 10–12 minggu tidak menghitung beban konten tersembunyi**
Bukti: GDD §10: *"2 orang paruh waktu: 10–12 minggu"*. Konten yang tersirat di dokumen:
- 22 stage × parameter 3 tingkat kesulitan (§3.9)
- 66 teks hint, termasuk 22 riddle hint (§3.8: 3 hint per stage)
- 8 riddle gerbang × 3 bentuk = 24 varian (§3.8)
- 21 butir Placement Test 1, masing-masing berupa **mini-adegan 3D** (§6.1)
- Editor kartu bersarang drag & drop sentuh buatan sendiri (§8.1)
- Kode progres dengan QR (§8.4)
- 5 karakter, 4 di antaranya custom (§9)
Dampak: konten teks dan varian soal biasanya lebih lama dari perkiraan, dan editor drag & drop sentuh adalah salah satu bagian UI tersulit di web. `[asumsi]` Estimasi yang terlalu optimis akan mendorong pemotongan kualitas di akhir proyek.
Perbaikan: buat **inventaris konten** di spreadsheet (item × estimasi jam). Potong kandidat berikut sampai angkanya masuk akal: riddle bentuk Hard, QR (cukup kode teks), soal tes berbentuk adegan 3D (cukup gambar 2D statis), dan karakter Pak Rakit (Nek Urut mentor di kedua pulau).

**[Major] K2 — Target usia berbeda di setiap dokumen**
Bukti:
- GDD §1: audiens MVP *"SD kelas 4 – SMP"*
- Progression §2: Beginner untuk *"SD ke atas"*
- PROJECT_STATE: *"Pelajar SD, SMP, SMA"*
- Test 1 soal 6 menguji urutan operasi hitung campuran. `[asumsi]` Materi ini umumnya diajarkan sekitar kelas 4 ke atas.
Dampak: desain teks, tingkat kesulitan riddle, dan pemilihan peserta playtest bergantung pada batas bawah usia. Tiga dokumen dengan tiga jawaban berbeda akan menghasilkan keputusan yang saling bertentangan.
Perbaikan: tetapkan **satu batas bawah** (usul: SD kelas 4) dan cantumkan di PROJECT_STATE sebagai keputusan terkunci. Dokumen lain merujuk ke sana.

**[Minor] K3 — Kebersihan dokumen**
Bukti:
- Game_Concept_Brief.md v0.2 masih berisi tabel tingkat lama dan JS-Interpreter. Ini hanya dicatat "digantikan" di PROJECT_STATE, tapi file-nya tetap beredar.
- Tanggal "Last updated: 2026-11-10" di PROJECT_STATE (hari ini 11 November).
- Nama dunia tidak konsisten: "Kode Nusantara" (judul) vs "Nusantara Kode" (GDD §4).
- GDD §2: *"Misi (3–4 stage …)"*, padahal Misi 4 Beginner berisi 2 stage dan Misi 4 Junior berisi 1 stage.
Perbaikan: tandai Concept Brief sebagai **arsip** di baris pertama, perbaiki tanggal dan nama, dan ubah definisi misi menjadi "1–4 stage".

**[Catatan] K4 — Tidak ada cara mengetahui apakah game benar-benar mengajar setelah rilis**
Bukti: GDD §8.6: *"tanpa analytics di build publik MVP"*.
Dampak: untuk produk edukasi, klaim "mengajarkan logika pemrograman" tidak bisa dibuktikan atau diperbaiki tanpa data. Keputusan privasinya benar, tetapi menyisakan kekosongan.
Perbaikan: rencanakan **pilot di 1–2 sekolah** dengan pre/post-test di luar game, atau statistik agregat anonim opt-in (misalnya tingkat penyelesaian dan penggunaan hint per stage, tanpa identitas) setelah ada kajian UU PDP.

### Sistem & teknis

**[Minor] T1 — Batas tes ulang dan badge hanya dijaga localStorage**
Bukti: GDD §6.1 (maksimal 2 tes ulang) + §8.4 (semua riwayat di localStorage; kode progres bisa diekspor).
Dampak: membuat profil baru atau menghapus data browser mengembalikan jatah tes ulang. Kode progres juga bisa disunting untuk mendapatkan badge.
Perbaikan: **terima risiko ini**. Taruhannya rendah (hanya melompati Beginner), dan backend demi anti-curang tidak sepadan untuk MVP. Cukup tambahkan checksum sederhana pada kode progres agar tidak bisa disunting dengan mudah. Jangan klaim badge sebagai bukti kemampuan.

**[Minor] T2 — Pemain yang melompati mode dirugikan di skor dan predikat**
Bukti: Progression §7: mode yang dilompati diberi kredit *"Medium, 2 bintang"* = 1,0 × dasar, sedangkan predikat dihitung dari maksimum *"semua Hard, 3 bintang"* = 2,0 × dasar (§9).
Dampak: pemain yang lolos tes dengan nilai sempurna mendapat kredit setengah skor maksimum di mode itu. Ini menurunkan peluang predikat Emas, sehingga yang pintar justru dihukum. Tidak berdampak di MVP (belum ada sertifikat), tapi lebih mahal diubah setelah rilis.
Perbaikan: keluarkan mode yang dilompati dari perhitungan predikat (persentase dihitung hanya dari mode yang dimainkan), atau beri kredit setara Hard 2 bintang.

**[Minor] T3 — Pembagian tidak punya aturan hasil**
Bukti: GDD §3.3 kartu Ubah kotak memakai ÷; GDD §3.4 kotak bulat = angka.
Dampak: 7 ÷ 2 menghasilkan 3,5. Pecahan desimal untuk SD kelas 4 dan perilaku interpreter belum ditentukan.
Perbaikan: di MVP, data level hanya mengizinkan pembagian yang hasilnya bulat; interpreter menolak pembagian tidak habis dengan reaksi Bit ("tidak bisa dibagi rata"). Pembagian dengan sisa ditunda.

---

## Yang sudah benar

- **Prasyarat materi konsisten di level mode** (Progression §2). Setiap mode hanya memakai konsep dari mode sebelumnya, dan Junior tidak bisa dilompati.
- **Arsitektur interpreter** (GDD §8.2): generator per langkah + world state data murni + solusi referensi yang divalidasi otomatis. Ini membuat Jalankan, Langkah, dan pengujian level memakai satu kode yang sama.
- **Tingkat kesulitan berbasis parameter** (Progression §6), bukan konten terpisah. Ini menghindari scope ×3.
- **Prototype plan dengan kriteria lulus yang terukur** (GDD §11), bukan sekadar "uji dan lihat".
- **Desain privasi** untuk audiens anak (GDD §8.6): tanpa akun, tanpa iklan, nama tidak keluar dari perangkat.

---

## Prioritas perbaikan

| # | Temuan | Langkah pertama | Effort |
|---|---|---|---|
| 1 | U1 — tes sebelum bermain | Ubah alur GDD §7.1: stage Beginner 1 dulu, lalu tawaran tes | 1 jam |
| 2 | G1 — stage Beginner 4 butuh perulangan | Tulis ulang stage 4 menjadi satu titik keputusan | 1 jam |
| 3 | K2 + K3 — inkonsistensi dokumen | Kunci batas usia SD kelas 4 di PROJECT_STATE; arsipkan Concept Brief; perbaiki nama & tanggal | 1–2 jam |
| 4 | U2 — notasi tes ≠ kartu game | Tulis ulang 7 soal Test 1 dalam bentuk kartu & kotak bentuk; ganti soal 5 | ½ hari |
| 5 | G4 — riddle gerbang | Tambahkan aturan anti-blokir; ganti riddle "penjaga jujur"; definisikan susun ubin untuk Hard | ½ hari |
| 6 | G3 — kriteria bintang | Ganti kriteria global dengan kriteria per stage; aturan "benar di semua seed" | ½ hari |
| 7 | G5 — bantuan di Hard | Hint riddle gratis; tombol Langkah tetap ada dengan pengurangan skor kecil | 1 jam |
| 8 | K1 — estimasi | Spreadsheet inventaris konten; tentukan potongan | 1 hari |
| 9 | G2 — tidak ada stage latihan | Pindahkan "Mesin di dalam Mesin" ke Middle A; tambahkan 2 stage latihan Junior | 1 hari |
| 10 | T3, T1, T2, K4 | Catat sebagai keputusan di dokumen; dikerjakan saat produksi atau pasca-MVP | 1–2 jam |

Butir 1–7 bisa diselesaikan dalam **±2 hari kerja** dan sebaiknya beres **sebelum prototipe P1/P2 dibangun**, karena beberapa di antaranya (G1, G3, U2) mengubah apa yang akan diprototipekan.

---

## Pertanyaan yang perlu dijawab tim

1. **Ukuran tim dan deadline.** Masih kosong sejak awal; tanpa ini temuan K1 tidak bisa diselesaikan.
2. **Batas bawah usia:** SD kelas 4, atau benar-benar SD kelas 3?
3. **Riddle gerbang:** wajib untuk badge, atau boleh dilewati dengan pengurangan skor?
4. **HP uji termurah:** model apa yang mewakili siswa sasaran?
5. **Pilot sekolah:** apakah ada sekolah atau kelas yang bisa dijadikan tempat uji, sehingga efektivitas belajar bisa diukur?
