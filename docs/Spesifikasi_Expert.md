# Spesifikasi Tahap Expert (EX01–EX10) — Kode Nusantara

**Versi:** 1.1 · 20 November 2026 · **Status:** EX01–EX10 SUDAH DIBANGUN di prototipe v20 (lihat §10). Belum pernah dimainkan siapa pun.
**Dasar:** draf EX01–EX10 di `Kurikulum_Stage_v0.3.md` §5.6, metafora di `Progression_Placement_Design.md` §10, dan pelajaran dari membangun dan meninjau Senior (SE01–SE10).
**Yang sudah diverifikasi dengan model murni (skrip Node, bukan pemain):** angka EX04, EX05, EX06, EX07 (§6). Sisanya (EX01–EX03, EX08–EX10) **belum** diverifikasi dan ditandai.

---

## 1. Keputusan pemilik yang dipakai

| Keputusan | Dampak di dokumen ini |
|---|---|
| Sertifikat menuliskan **username**, bukan nama asli | §8: tidak ada nama asli yang dikumpulkan; tidak perlu persetujuan khusus data pribadi selama username tidak dikirim ke server |
| Placement test memakai percobaan **terbaik** | Tidak memengaruhi Expert (Expert hanya terbuka setelah semua Senior selesai) |
| MB10 "Pertunjukan Malam" dan istilah (cetakan, objek, atribut, method, diri) dikonfirmasi | Expert tidak memakai istilah OOP baru |

## 2. Kritik terhadap draf sebelum merancang (jujur)

| Masalah di draf | Akibat | Perbaikan di rancangan ini |
|---|---|---|
| Draf memodelkan Expert sebagai urutan kartu seperti Senior | Antrean, pekerja, cache, dan pemantauan adalah sistem **yang berjalan terus**, bukan langkah sekali jalan. Urutan kartu tidak bisa mengungkapkannya | Paradigma baru: **aturan + detak** (§3) |
| EX04 "atur jumlah pekerja" | Satu angka yang bisa ditemukan dengan coba-coba tiga kali; tidak membuktikan paham | Dua setelan dengan biaya (pekerja dan penyangga); lonjakan di tiga profil beban (§5 EX04) |
| EX05 "atasi lonjakan dengan pekerja, tanpa kartu baru" | Di model saya, penambahan pekerja otomatis tidak lebih murah daripada pekerja tetap selama lonjakan pendek | Lonjakan dibuat panjang (8 detak) dan anggaran diperketat; hasilnya pekerja tetap tidak ada yang lulus (§6) |
| EX07 berjudul "Menara Pengawas" tetapi isinya cache | Metafora tertukar dengan EX09 (pemantauan) | EX07 = **Rak Cepat**; "Menara Pengawas" dipindah ke EX09 |
| Seluruh tingkat bergantung pada kata "kebijakan cache", "load balancer" | Risiko **hafalan istilah** (sudah dicatat di PROJECT_STATE) | Setiap tahap punya pesan gagal yang menyebut *mengapa* secara kuantitatif (detak ke-n, angka), dan varian yang membuat satu jawaban "hafalan" gagal |
| Tidak ada rencana durasi animasi | Simulasi 3 varian × 24 detak bisa 30 detik di 1× | Hanya satu jalan yang dianimasikan (§3.4) |

## 3. Mesin: aturan dan detak

### 3.1 Dua jenis kartu
- **Aturan** — "Ketika ⟨peristiwa⟩, lakukan ⟨aksi⟩". Dijalankan setiap kali peristiwa itu terjadi, bukan sekali.
- **Setelan** — nilai sistem yang tetap sepanjang simulasi: jumlah pekerja, ukuran penyangga, jumlah server, strategi, kebijakan rak. Tiap setelan punya biaya.

### 3.2 Satu detak
1. Dunia membangkitkan peristiwa (pesanan masuk, lonjakan, server gagal).
2. Semua aturan yang cocok menembak, dari atas ke bawah. Aksi yang menghasilkan peristiwa baru menembaknya **di detak berikutnya** (rantai butuh satu detak per mata rantai; itu yang membuat otomasi terlihat bekerja).
3. Dunia memajukan keadaan (antrean diproses, pekerja baru aktif).
4. Pemeriksa mencatat kejadian untuk jejak dan pesan gagal.

Urutan kartu **tidak** berpengaruh, kecuali di EX09 (prioritas penanganan gagal; dinyatakan di tahap itu).

### 3.3 Tampilan
Memakai dasbor "Papan Sistem" yang ada (`#sysView`), ditambah:
- **Garis waktu** teks-dulu: satu baris per detak dengan ikon, plus tabel ringkas (grafik hanya tambahan, bukan satu-satunya sumber informasi).
- Tombol kecepatan 1× / 4× dan **Lewati ke hasil**.
- Ringkasan hasil dibacakan sekali per jalan lewat daerah `aria-live="polite"`. Per detak tidak dibacakan.
- Mode gelap dan kontras ≥ 4,5:1 diuji seperti Senior (T2o DK/LT).

### 3.4 Durasi
- Hasil semua varian dihitung seketika (fungsi murni).
- Yang dianimasikan: varian pertama yang **gagal**, atau varian pertama bila semua lulus.
- Anggaran waktu: ≤ 24 detak × 0,4 dtk = 9,6 dtk pada 1×; 2,4 dtk pada 4×. Senior terpanjang diukur 8,5 dtk (SE04).

### 3.5 Syarat untuk setiap tahap (dari pelajaran Senior)
1. Mesin keadaan murni dengan `init`, `apply/tick`, `check`, `draw`.
2. Palet ≤ 6 kartu (maks 7).
3. Kartu baru memakai **nilai awal yang sengaja salah** (opsi pertama = jawaban keliru).
4. ≥ 3 varian yang membuat satu jawaban umum diperlukan.
5. Intro ≤ 4 halaman, ≤ 100 karakter per halaman.
6. Pesan gagal menyebut detak, angka, dan penyebab.
7. **Pembuktian jalan pintas**: ruang setelan kecil, jadi dicari seluruhnya (seperti ablasi SE10). Tahap yang ruangnya terlalu besar memakai pencarian ruang keadaan.
8. Diuji di 4 layar × 2 tema.

## 4. Kartu baru (±8 jenis)

| Kartu | Bidang | Dipakai |
|---|---|---|
| Aturan | Ketika (peristiwa), Maka (aksi) | EX01–EX03, EX05, EX09, EX10 |
| Pekerja | jumlah | EX04, EX10 |
| Penyangga | ukuran (6/12/24) | EX04, EX05, EX10 |
| Skala otomatis | ambang antrean, ambang turun | EX05, EX10 |
| Server | jumlah | EX06, EX08, EX10 |
| Strategi | satu-ke-satu / bergilir / paling kosong | EX06, EX08, EX10 |
| Rak | kebijakan, ukuran | EX07, EX08, EX10 |
| Tangani gagal | coba lagi (n, jeda), cadangan, pemutus | EX09, EX10 |

## 5. Tahap demi tahap

Legenda: **K** kartu baru, **L** latihan tanpa kartu baru, **P** proyek penutup. "Terverifikasi" berarti angka diperiksa dengan model murni di §6.

### EX01 · Pabrik Otomatis (K) — *belum diverifikasi*
- **Konsep:** pemicu → aksi berantai (otomasi).
- **Dunia:** pabrik menerima 10 pesanan. Peristiwa: *pesanan masuk*, *peti siap*, *peti terkirim*, ditambah pengecoh *stok menipis*, *jam sibuk*. Aksi: *kemas*, *kirim*, *beri tahu pelanggan*, ditambah pengecoh *cetak faktur*, *hapus pesanan*.
- **Jawaban:** masuk→kemas, siap→kirim, terkirim→beri tahu. Urutan kartu bebas, jadi 6 urutan benar.
- **Menang:** 10 pesanan terkirim **dan** diberi tahu, tanpa tombol manual.
- **Bukti paham:** salah pemicu (mis. masuk→kirim) menghasilkan "kirim peti kosong" di detak ke-n, jadi pemain harus memahami rantai, bukan menebak.
- **Batas kartu:** 4. **Varian:** pesanan datang satu-satu, berkelompok, dan terputus. Satu rangkaian aturan memenuhinya.
- **Risiko:** ini kartu *Aturan* pertama. Perlu pengantar visual satu halaman (bukan tahap baru) yang menunjukkan satu aturan berjalan.

### EX02 · Alur Dua Jalur (L) — *belum diverifikasi*
- **Konsep:** pemicu bersyarat dan penanganan cabang.
- **Dunia:** pesanan kecil langsung dikemas. Pesanan besar (≥ 5 barang) harus *periksa stok* dulu; bila stok kurang, *pesan ke pemasok*.
- **Varian:** stok cukup, stok kurang, campuran. Program harus menangani keduanya (varian memaksa).
- **Batas kartu:** 7. **Bukti paham:** pesan gagal menyebut pesanan ke-n yang dikemas tanpa memeriksa stok.

### EX03 · Ban Berjalan (K) — *belum diverifikasi*
- **Konsep:** CI/CD: uji otomatis memblokir rilis buruk.
- **Rantai:** komit → uji → (lulus) kemas → kirim; (gagal) tolak + beri tahu pengembang.
- **Menang:** 5 komit, 1–2 di antaranya cacat; **tidak ada** cacat yang sampai ke produksi **dan** semua komit baik sampai (menolak semuanya gagal).
- **Beda dengan SE09:** di SE09 pemain menempatkan *gerbang*. Di sini pemain membangun *rantai pemicu* yang membuat gerbang itu otomatis.
- **Batas kartu:** 6. **Varian:** letak komit cacat berbeda (awal, tengah, beruntun).
- **Gerbang Si Teka sesudah EX03:** "Satu rilis cacat lolos ke produksi. Tahap pipeline mana yang paling mungkin kurang?"

### EX04 · Loket Ramai (K) — **terverifikasi**
- **Konsep:** kapasitas, antrean, penyangga (queue/worker).
- **Setelan:** pekerja (1–6, masing-masing memproses 2 tugas/detak, biaya 3) dan penyangga (6/12/24, biaya 1/2/4). **Anggaran 11.**
- **Beban (tugas/detak):** A = 2 (6 detak), 9 (4 detak), 2 (10 detak). B = 9 (4 detak) lalu 2 (16 detak). C = 4 konstan (20 detak). Tiga detak ekstra untuk menguras.
- **Menang:** tidak ada tugas hilang **dan** antrean kosong di akhir, dengan biaya ≤ 11.
- **Jawaban tunggal (seluruh ruang 6 × 3 dicari):** **2 pekerja + penyangga 24** (biaya 10). Pekerja mengikuti beban rata-rata (C = 4/detak = 2 pekerja); penyangga menyerap puncak.
- **Bukti paham:** jawaban "tambah pekerja sampai aman" melanggar anggaran; jawaban "penyangga kecil" menghilangkan tugas di detak lonjakan. Pesan gagal menyebut detak tugas pertama yang hilang dan panjang antrean saat itu.
- **Batas kartu:** 3 (Pekerja, Penyangga, +1 cadangan). **Palet:** 2.

### EX05 · Loket Lonjakan (L) — **terverifikasi**
- **Konsep:** skala otomatis (menambah pekerja saat perlu, menguranginya saat sepi).
- **Aturan:** Skala otomatis (ketika antrean > T, tambah 1 pekerja; aktif **1 detak** kemudian; ketika antrean ≤ D, kurangi 1; maks 6). Penyangga tetap 24. Mulai 1 pekerja.
- **Beban:** A = 1 (6 detak), 8 (8 detak), 1 (6 detak). B = 8 (8 detak) lalu 1 (12 detak). C = 2 konstan.
- **Anggaran:** 56 pekerja-detak.
- **Hasil pencarian:** **tidak ada** jumlah pekerja tetap yang lulus; skala otomatis lulus untuk T ∈ {0, 2, 4} dengan D = 2. T ≥ 6 gagal (dugaan penyebab: pekerja baru aktif terlambat; belum saya telusuri per detak).
- **Bukti paham:** pemain harus menyetel ambang **sebelum** penyangga penuh, mempertimbangkan keterlambatan 1 detak. Contoh bentuk pesan gagal (angka ilustrasi, belum dari model): "Antrean mencapai 24 di detak n; pekerja tambahan baru aktif di detak n+1".
- **Catatan jujur:** di model saya skala otomatis hanya menang bila lonjakan panjang. Dengan lonjakan 4 detak (EX04), penyangga sudah cukup dan skala otomatis tidak berguna. Ini pelajaran yang benar, tetapi pemain perlu melihatnya: EX05 sengaja memakai lonjakan lebih panjang.

### EX06 · Pintu Tol (K) — **terverifikasi**
- **Konsep:** pembagian beban ke beberapa server.
- **Setelan:** jumlah server (2–5, biaya 1 masing-masing, **anggaran 3**) dan strategi (satu-ke-satu, bergilir, paling kosong). Tiap server memproses 4 permintaan/detak, antrean maks 4.
- **Lalu lintas:** 4 (3 detak), 11 (6 detak), 4 (4 detak).
- **Varian:** semua server normal; satu server lambat (kapasitas 2); dua server kecil (kapasitas 2).
- **Jawaban tunggal dalam anggaran 3:** **3 server + paling kosong** (0 permintaan hilang di semua varian). Bergilir kehilangan 6 permintaan pada server lambat; 4 server bergilir pun masih hilang 1. Strategi satu-ke-satu tidak lulus pada ukuran server mana pun dalam pencarian.
- **Bukti paham:** "bergilir" tampak adil tetapi gagal pada server yang lambat; hanya varian yang mengungkap itu. Pesan gagal menyebut server mana yang melimpah dan di detak berapa.
- **Gerbang Si Teka sesudah EX06:** "Antrean 100 tugas, 5 petugas mampu 10 tugas/menit masing-masing. Berapa menit sampai habis?" (jawaban 2).

### EX07 · Rak Cepat (K) — **terverifikasi**
- **Konsep:** cache dan kebijakan pengusiran.
- **Setelan:** Rak (kebijakan: pertama-masuk / paling lama tak dipakai / paling sering dipakai; ukuran 1–4, biaya = ukuran, **anggaran 3**).
- **Permintaan (24 per varian, 6 barang):** *populer tetap* (a dan b dominan), *rentetan* (tiap barang 4 kali berurutan), *campur*.
- **Menang:** tingkat kena rak ≥ 55% **di ketiga varian**.
- **Hasil pencarian:** ukuran 3 + **paling sering dipakai** (67% · 75% · 58%). "Paling lama tak dipakai" ukuran 3 gagal di *campur* (33%). Pertama-masuk gagal di dua varian. Ukuran 4 lulus tetapi melebihi anggaran.
- **Bukti paham:** kebijakan yang "terdengar masuk akal" (paling lama tak dipakai) gagal pada satu pola. Pesan gagal menyebut barang yang terus diusir dan kena-rak per varian.
- **Catatan jujur:** di dunia nyata LRU sering lebih baik daripada LFU. Pola permintaan di sini dipilih supaya LFU menang. Itu penyederhanaan tahap, **bukan** klaim tentang cache pada umumnya. Teks tahap harus menyebut: "untuk pola permintaan ini".

### EX08 · Jam Sibuk (L) — *belum diverifikasi*
- **Konsep:** menggabungkan pembagian beban dan rak.
- **Dunia:** server dan rak dari EX06–EX07. Permintaan yang kena rak **tidak** membebani server (biaya 0); yang tidak, biaya penuh.
- **Menang:** tidak ada permintaan hilang dalam anggaran gabungan (server + rak). Harus memilih keduanya; satu saja tidak cukup.
- **Varian:** tiga kombinasi lalu lintas × pola permintaan. **Perlu pencarian eksak** (ruang ≈ 4 × 3 × 3 × 4 setelan).

### EX09 · Menara Pengawas (K) — *belum diverifikasi*
- **Konsep:** pemantauan, coba lagi, cadangan, pemutus (retry, fallback, circuit breaker).
- **Dunia:** server gagal dalam tiga cara (varian): *sementara* (mati 2 detak lalu pulih), *permanen* (mati dari detak 6), *berkedip* (tiap permintaan ke-3 gagal).
- **Kartu Tangani gagal:** coba lagi (n kali, jeda), pakai cadangan (kapasitas 5), pemutus (setelah k gagal beruntun berhenti memanggil server X detak).
- **Menang:** ≥ 90% permintaan sukses **dan** beban server tidak melebihi kapasitas (tidak ada "badai coba ulang").
- **Dugaan jawaban:** coba lagi 2× jeda 1 + cadangan + pemutus k = 3. *Dugaan saja*; angka harus dicari dengan model sebelum dipakai.
- **Bukti paham:** coba lagi tanpa pemutus menghabiskan kapasitas pada varian permanen; cadangan tanpa coba lagi membuang kapasitas pada varian sementara. Prioritas urutan aturan **berpengaruh** di sini (satu-satunya tahap).
- **Dasbor:** pemain membaca tabel keadaan server per detak (tahap ini mengajarkan memakai pemantauan, bukan menebak).

### EX10 · Toko Terbuka (P) — *belum diverifikasi*
- **Konsep:** semua jalur menjadi satu: pemicu → antrean → pekerja (skala otomatis) → server (strategi) → rak → penanganan gagal.
- **Batas kartu:** 12. **Palet:** 7 (maks).
- **Varian (4):** hari biasa; hari promo (lonjakan panjang); server rusak; pola permintaan berubah.
- **Menang:** tidak ada pesanan hilang, ≥ 90% sukses, biaya ≤ anggaran di keempat varian.
- **Verifikasi:** ruang setelan ≈ 10⁵–10⁶ (dicari seluruhnya), dengan ablasi: tanpa skala otomatis, tanpa rak, tanpa pemutus, tanpa strategi "paling kosong" → tidak ada program yang lulus. Bila ablasi menemukan jalan pintas, anggaran diperketat (cara yang sama seperti SE10).

## 6. Yang sudah dihitung (skrip model murni)

| Tahap | Parameter akhir | Hasil pencarian |
|---|---|---|
| EX04 | biaya pekerja 3, penyangga 1/2/4, anggaran 11; beban A/B/C | satu jawaban: 2 pekerja + penyangga 24 |
| EX05 | lonjakan 8 × 8 detak, penyangga 24, keterlambatan 1, anggaran 56 | tidak ada pekerja tetap; skala otomatis lulus untuk T ∈ {0, 2, 4}, D = 2 |
| EX06 | 3 server maks, antrean 4, kapasitas 4/2, lalu lintas 4·11·4 | satu jawaban: 3 server + paling kosong |
| EX07 | 3 pola × 24 permintaan, ukuran ≤ 3, ambang 55% | satu jawaban: ukuran 3 + paling sering dipakai |

Percobaan yang **gagal** dan memengaruhi rancangan: parameter pertama EX04 (lonjakan 10, biaya pekerja 3, anggaran 9–12) tidak punya satu pun jawaban; lonjakan pendek di EX05 membuat skala otomatis tidak lebih murah daripada pekerja tetap. Keduanya diubah sebelum dituliskan di sini.

Yang **belum** dihitung: EX01–EX03, EX08–EX10. Aturan keras: tahap tidak masuk build sebelum ruang jawabannya dicari seluruhnya.

## 7. Urutan, ukuran, dan risiko

**Urutan build yang disarankan:**
1. Mesin aturan + detak + garis waktu + tes dasar (belum ada tahap).
2. EX01–EX03 (aturan murni).
3. EX04–EX07 (setelan; angka sudah ada).
4. EX08–EX10, dengan model dan pencarian eksak ditulis lebih dulu.
5. Gerbang Si Teka sesudah EX03 dan EX06.

**Ukuran kasar** (dibanding sesi pembangunan Senior kemarin): mesin 2–3 sesi, EX01–EX03 1 sesi, EX04–EX07 2 sesi, EX08–EX10 2 sesi, ditambah tes dan dokumen di tiap sesi. Total perkiraan 7–9 sesi. Ini perkiraan, bukan janji; mesin detak adalah bagian yang belum pernah saya bangun di proyek ini.

**Risiko:**
| Risiko | Mitigasi |
|---|---|
| Lompatan paradigma urutan → aturan membingungkan | Pengantar visual di EX01; playtest Senior → EX01 sebelum EX04 dibangun |
| Hafalan istilah (cache, load balancer) | Pesan gagal kuantitatif; varian yang mengalahkan jawaban hafalan |
| Penyederhanaan model dianggap kebenaran umum | Catatan eksplisit di teks tahap (EX07) |
| Durasi animasi | Satu jalan dianimasikan; Lewati ke hasil |
| Senior belum dimainkan siapa pun | Expert sebaiknya tidak dibangun penuh sebelum playtest Senior (`Playtest_Kit_Senior.md`) |

## 8. Sertifikat dan username

Aturan (sesuai keputusan pemilik: **username, bukan nama asli**):
- Pemain **mengetik username** saat mencetak. Layar mencetak menampilkan petunjuk: "Pakai nama samaran, bukan nama aslimu."
- Username **tidak dikirim ke server dan tidak disimpan** (sertifikat dibuat di perangkat). Bila nanti ada penyimpanan di sisi server, keputusan ini perlu ditinjau ulang.
- Sertifikat memuat: username, tingkat (Programmer = Senior Complete; Expert = Expert Complete), predikat, tanggal.
- Karena username bukan identitas, sertifikat **tidak dapat dipakai sebagai bukti kemampuan** oleh pihak lain. Teksnya harus mengatakan itu ("Penghargaan dalam game"), supaya tidak disalahartikan sebagai kredensial.
- Belum dibangun. Predikat Emas/Perak/Perunggu bergantung pada sistem skor yang sekarang hanya mencatat bonus gerbang. Skor total belum ada.

## 9. Pertanyaan terbuka untuk pemilik

1. Setuju dengan perubahan paradigma (aturan + detak) untuk Expert?
2. Setuju hanya satu jalan yang dianimasikan (bukan semua varian)?
3. Bangun Expert sekarang atau tunggu playtest Senior? (rekomendasi saya: bangun mesin dan EX01–EX03 saja sebagai uji paradigma, tunda sisanya.)
4. Perlu sertifikat Programmer lebih dulu daripada Expert? Sistem skor total belum ada; itu pekerjaan tersendiri.

---

## 10. Status build (v20, 20 November 2026) — apa yang berbeda dari rancangan

Seluruh angka di bawah berasal dari pencarian ruang setelan **penuh** oleh skrip uji (`t1l`, `t1m`, `t1n`), bukan dari pemain.

| Tahap | Kartu | Anggaran | Jawaban (dicari seluruhnya) | Catatan perbedaan dari rancangan |
|---|---|---|---|---|
| EX01 Pabrik Otomatis | Aturan | batas 4 kartu | 17 dari 15.275 himpunan | Efek aksi baru berlaku di **detak berikutnya**; tanpa itu tiga aturan "masuk→kemas, masuk→kirim, masuk→beri tahu" runtuh jadi satu detak dan lulus |
| EX02 Alur Dua Jalur | Aturan | batas 7 kartu | 9 dari 2.804.011 himpunan | Semua 9 memuat 6 aturan inti |
| EX03 Ban Berjalan | Aturan | batas 6 kartu | 140 dari 245.505 himpunan | **Beberapa urutan sah** (mis. kemas paralel dengan uji, kirim saat uji lulus). Definisi "aturan inti" di uji dilonggarkan; ini keputusan desain |
| EX04 Loket Ramai | Pekerja, Penyangga | 11 | tepat 1: 2 pekerja + penyangga 24 | sesuai rancangan |
| EX05 Loket Lonjakan | Pekerja, Skala otomatis | 56 pekerja-detak | tepat 3: skala T ∈ {0, 2, 4}, turun 2 | tidak ada pekerja tetap yang lulus |
| EX06 Pintu Tol | Server, Cara membagi | 3 | tepat 1: 3 server + paling kosong | sesuai rancangan |
| EX07 Rak Cepat | Rak | 3 | tepat 1: paling sering dipakai, ukuran 3 | teks tahap menyebut "untuk pola permintaan ini" |
| EX08 Jam Sibuk | Server, Cara membagi, Rak | 4 | tepat 1: 2 server + paling kosong + rak 2 paling sering dipakai | parameter dicari dulu (lalu lintas puncak 16, kapasitas server berbeda per keadaan); tanpa rak tidak ada yang lulus |
| EX09 Menara Pengawas | Coba lagi, Cadangan, Pemutus | server utama maks 6 percobaan/detak | tepat 2: coba lagi 2× jeda 2 → cadangan, pemutus 3 atau 4 | **Aturan menang diubah**: keadaan sementara dan berkedip menuntut ≥ 90% sukses lewat server utama (cadangan tidak boleh menutupi); keadaan permanen menuntut ≥ 90% total. Tanpa itu cadangan saja menyelesaikan semuanya. Urutan kartu Coba/Cadangan berpengaruh |
| EX10 Toko Terbuka | Skala, Server, Cara membagi, Rak, Coba lagi, Cadangan, Pemutus (7) | 13 (pekerja 1 dan penyangga 24 tetap, biaya 5 sudah termasuk) | tepat 12 dari 133.293 susunan | Lihat di bawah |

**Penyimpangan jujur pada EX10.** Rancangan menginginkan satu jalur terpadu (pemicu → antrean → pekerja → server → rak → penanganan gagal). Pemodelan jalur terpadu saya coba dan **gagal**: pada berbagai parameter lalu lintas dan anggaran, ratusan sampai puluhan ribu susunan lulus dan hampir semua bagian bisa dilepas (hanya rak yang wajib). Yang dibangun adalah **gabungan lima subsistem dengan satu anggaran**: empat keadaan (hari promo, jam sibuk, server rusak, pola berubah), tiap keadaan menguji satu kelompok kartu, dan satu susunan harus lolos di keempatnya. Akibatnya tahap ini adalah proyek penutup yang menuntut semua bagian, tetapi **bagian-bagiannya tidak saling memengaruhi** kecuali rak (dipakai jam sibuk dan pola berubah). Ablasi: tanpa skala, rak, cadangan, pemutus, coba lagi, atau urutan Coba-sebelum-Cadangan → 0 susunan lulus. Strategi "paling kosong" **tidak wajib** (6 dari 12 jawaban memakai bergilir).

**Palet EX10:** 7 kartu (batas spesifikasi), diperoleh dengan membuang Pekerja dan Penyangga dari palet.

**Gerbang Si Teka (v21).** Gerbang Detak (setelah EX03, konsep aturan dan detak) dan Gerbang Antrean (setelah EX06, antrean, pekerja, pembagian beban). Masing-masing 3 varian yang **dihitung** oleh model murni, bukan diketik:

| Gerbang | Varian | Kunci |
|---|---|---|
| Detak | Rantai tiga aturan, pesanan masuk di detak 8: di detak berapa pelanggan diberi tahu? | 10 |
| Detak | Periksa stok → pesan ke pemasok (stok tiba 2 detak kemudian) → kemas, pesanan besar masuk di detak 9: di detak berapa dikemas? | 12 |
| Detak | Lima komit di detak 1–5, komit 2 dan 4 cacat: berapa aksi berjalan seluruhnya? | 13 |
| Antrean | 1 pekerja, penyangga 6, tugas 4,4,4,4: berapa tugas berhasil diproses? | 12 |
| Antrean | 2 server (4 dan 2 per detak), lalu lintas 8,8,8,8, bergilir: berapa dilayani? | 28 |
| Antrean | Sama, dibagi ke server paling kosong: berapa dilayani? | 31 |

Semua kunci dua digit dan bukan palindrom: uji lama G4b/G4c menolak kunci satu digit (bisa ditebak dari ubin) dan kunci yang sama bila dibalik. `EXS.lbSim` mendapat argumen kelima opsional (lalu lintas), bawaan tidak berubah.

**Yang belum:** sertifikat; playtest.
